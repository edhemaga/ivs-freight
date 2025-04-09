import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// modules
import moment from 'moment';

// components
import { TaCommentsSearchComponent } from '@shared/components/ta-comments-search/ta-comments-search.component';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// services
import { CommentsService } from '@shared/services/comments.service';

// enums
import { LoadDetailsItemStringEnum } from '@pages/load/pages/load-details/components/load-details-item/enums/load-details-item-string.enum';

// models
import { LoadResponse, SignInResponse } from 'appcoretruckassist';
import { CommentCompanyUser } from '@shared/models/comment-company-user.model';
import { CommentData } from '@shared/models/comment-data.model';

@Component({
    selector: 'app-load-details-item-comments',
    templateUrl: './load-details-item-comments.component.html',
    styleUrls: ['./load-details-item-comments.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCommentsSearchComponent,
    ],
})
export class LoadDetailsItemCommentsComponent implements OnChanges, OnDestroy {
    @Input() load: LoadResponse;
    @Input() isAddNewComment: boolean;
    @Input() isSearchComment: boolean;
    @Input() isHeaderHidden: boolean = false;

    @Output() onCommentsCountChanged = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    public companyUser: SignInResponse;

    public comments: CommentCompanyUser[] = [];
    public commentsBeforeSearch: CommentCompanyUser[] = [];

    public isCommenting: boolean = false;

    private editedCommentId: number;
    private deletedCommentId: number;

    constructor(private commentsService: CommentsService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.load?.currentValue) {
            this.getCompanyUser();

            this.createCommentsData(changes?.load?.currentValue);
        }

        if (changes?.isAddNewComment?.currentValue) this.createNewComment();
    }

    private getCompanyUser(): void {
        this.companyUser = JSON.parse(
            localStorage.getItem(LoadDetailsItemStringEnum.USER)
        );
    }

    private createCommentsData(load: LoadResponse): void {
        const { comments } = load;

        if (!comments) return;

        this.comments = comments.map((comment) => {
            const { companyUser, id, commentContent, createdAt, isEdited } =
                comment;

            return {
                companyUser: {
                    id: companyUser.id,
                    name: companyUser.fullName,
                    avatarFile: companyUser.avatarFile,
                },
                commentId: id,
                commentContent,
                commentDate:
                    MethodsCalculationsHelper.convertDateFromBackendToDateAndTime(
                        createdAt
                    ),
                isCommenting: false,
                isEdited,
                isMe: companyUser.id === this.companyUser.userId,
            };
        });

        this.commentsBeforeSearch = this.comments;
    }

    public createNewComment(): void {
        if (this.comments.some((comment) => comment.isCommenting)) return;

        const newComment: CommentCompanyUser = {
            commentId: 0,
            companyUser: {
                id: this.companyUser.userId,
                name: `${this.companyUser.firstName} ${this.companyUser.lastName}`,
                avatarFile: this.companyUser.avatarFile,
            },
            commentContent: null,
            commentDate: null,
            isCommenting: true,
        };

        this.isCommenting = true;

        this.comments = [newComment, ...this.comments];
    }

    public handleCommentActionEmit(commentData: CommentData): void {
        switch (commentData.btnType) {
            case LoadDetailsItemStringEnum.CANCEL:
                if (!commentData.isEditCancel)
                    this.comments.splice(commentData.commentIndex, 1);

                this.isCommenting = false;

                break;
            case LoadDetailsItemStringEnum.CONFIRM:
                this.comments[commentData.commentIndex] = {
                    ...this.comments[commentData.commentIndex],
                    commentContent: commentData.commentContent,
                    commentDate: `${commentData.commentDate}, ${commentData.commentTime}`,
                    isCommenting: false,
                    isEdited: commentData.isEditConfirm,
                };

                this.editedCommentId = commentData.commentId;

                this.isCommenting = false;

                const commentContent =
                    this.comments[commentData.commentIndex].commentContent;

                if (commentData.isEditConfirm) {
                    this.updateCommentById(
                        this.editedCommentId,
                        commentContent
                    );
                } else {
                    this.createComment(
                        commentContent,
                        commentData.commentIndex
                    );
                }

                this.onCommentsCountChanged.emit(true);

                break;
            case LoadDetailsItemStringEnum.DELETE:
                this.comments.splice(commentData.commentIndex, 1);

                this.deletedCommentId = commentData.commentId;

                this.isCommenting = false;

                this.deleteCommentById(this.deletedCommentId);

                this.onCommentsCountChanged.emit(true);

                break;
            default:
                break;
        }
    }

    public handleSortActionEmit(sortDirection: string): void {
        const dateFormat = LoadDetailsItemStringEnum.DATE_FORMAT;

        this.comments = this.comments.sort((a, b) => {
            const dateA = moment(a.commentDate, dateFormat).valueOf();
            const dateB = moment(b.commentDate, dateFormat).valueOf();

            if (sortDirection === LoadDetailsItemStringEnum.ASC) {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
    }

    public handleSearchHighlightActionEmit(searchHighlightValue: string): void {
        if (searchHighlightValue) {
            this.comments = this.comments.filter(
                ({ commentContent, companyUser }) =>
                    commentContent
                        .toLowerCase()
                        .includes(searchHighlightValue) ||
                    companyUser.name
                        .toLowerCase()
                        .includes(searchHighlightValue)
            );
        } else {
            this.comments = this.commentsBeforeSearch;
        }
    }

    private createComment(commentContent: string, commentIndex: number): void {
        const comment = {
            entityTypeCommentId: 2,
            entityTypeId: this.load?.id,
            commentContent: commentContent,
        };

        this.commentsService
            .createComment(comment, this.load?.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.comments[commentIndex] = {
                    ...this.comments[commentIndex],
                    commentId: res.id,
                };
            });
    }

    private updateCommentById(id: number, commentContent: string): void {
        const comment = {
            id,
            commentContent,
        };

        this.commentsService
            .updateComment(comment, this.load?.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteCommentById(id: number): void {
        this.commentsService
            .deleteCommentById(id, this.load?.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
