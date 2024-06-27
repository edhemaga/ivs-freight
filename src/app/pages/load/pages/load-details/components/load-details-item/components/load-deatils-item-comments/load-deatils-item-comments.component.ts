import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaCommentsSearchComponent } from '@shared/components/ta-comments-search/ta-comments-search.component';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { LoadDetailsItemStringEnum } from '@pages/load/pages/load-details/components/load-details-item/enums/load-details-item-string.enum';

// models
import { LoadResponse, SignInResponse } from 'appcoretruckassist';
import { CommentCompanyUser } from '@shared/models/comment-company-user.model';
import { CommentData } from '@shared/models/comment-data.model';
import moment from 'moment';

@Component({
    selector: 'app-load-deatils-item-comments',
    templateUrl: './load-deatils-item-comments.component.html',
    styleUrls: ['./load-deatils-item-comments.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,

        // components
        TaCommentsSearchComponent,
    ],
})
export class LoadDeatilsItemCommentsComponent implements OnChanges {
    @Input() load: LoadResponse;
    @Input() isAddNewComment: boolean;
    @Input() isSearchComment: boolean;

    public companyUser: SignInResponse;

    public comments: CommentCompanyUser[] = [];
    public commentsBeforeSearch: CommentCompanyUser[] = [];

    public isCommenting: boolean = false;
    public isCommented: boolean = false;
    public isCommentEdited: boolean = false;

    private editedCommentId: number;
    private deletedCommentId: number;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.load?.currentValue) {
            this.getCompanyUser();

            this.createCommentsData(changes?.load?.currentValue);
        }

        if (changes?.isAddNewComment?.currentValue) this.createComment();
    }

    private getCompanyUser(): void {
        this.companyUser = JSON.parse(
            localStorage.getItem(LoadDetailsItemStringEnum.USER)
        );
    }

    private createCommentsData(load: LoadResponse): void {
        const { comments } = load;

        this.comments = comments.map((comment) => {
            return {
                companyUser: {
                    id: comment.companyUser.id,
                    name: comment.companyUser.fullName,
                    avatar: '' /* comment.companyUser.avatar */,
                },
                commentId: comment.id,
                commentContent: comment.commentContent,
                commentDate:
                    MethodsCalculationsHelper.convertDateFromBackendToDateAndTime(
                        comment.createdAt
                    ),
                isCommenting: false,
                isEdited: comment.isEdited,
                isMe: comment.companyUser.id === this.companyUser.userId,
            };
        });

        this.commentsBeforeSearch = this.comments;
    }

    public createComment(): void {
        if (this.comments.some((comment) => comment.isCommenting)) return;

        const newComment: CommentCompanyUser = {
            commentId: 0,
            companyUser: {
                id: this.companyUser.userId,
                name: `${this.companyUser.firstName} ${this.companyUser.lastName}`,
                avatar: null /*  this.companyUser.avatar */,
            },
            commentContent: null,
            commentDate: null,
            isCommenting: true,
        };

        this.isCommenting = true;
        this.isCommented = true;

        this.comments = [newComment, ...this.comments];
    }

    public handleCommentActionEmit(commentData: CommentData): void {
        switch (commentData.btnType) {
            case LoadDetailsItemStringEnum.CANCEL:
                if (!commentData.isEditCancel) {
                    this.comments.splice(commentData.commentIndex, 1);

                    this.isCommented = false;
                }

                this.isCommenting = false;

                break;
            case LoadDetailsItemStringEnum.CONFIRM:
                this.comments[commentData.commentIndex] = {
                    ...this.comments[commentData.commentIndex],
                    commentContent: commentData.commentContent,
                    commentDate: `${commentData.commentDate}, ${commentData.commentTime}`,
                    isCommenting: false,
                };

                this.editedCommentId = commentData.commentId;

                commentData.isEditConfirm && (this.isCommentEdited = true);

                this.isCommenting = false;

                break;
            case LoadDetailsItemStringEnum.DELETE:
                this.comments.splice(commentData.commentIndex, 1);

                this.deletedCommentId = commentData.commentId;

                this.isCommented = false;
                this.isCommenting = false;

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
}
