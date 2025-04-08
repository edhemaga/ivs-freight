import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Third-party modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { TaCommentsSearchComponent } from '@shared/components/ta-comments-search/ta-comments-search.component';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eSharedString } from '@shared/enums';

// Components
import { CaLoadStatusLogComponent } from 'ca-components';

// Enums
import {
    eGeneralActions,
    eColor,
    eDateTimeFormat,
    eSortDirection,
    eIconPath,
} from '@shared/enums';

// Models
import { CommentCompanyUser, CommentData } from '@shared/models';
import {
    CommentService,
    CreateCommentCommand,
    SignInResponse,
} from 'appcoretruckassist';
import { ICreateCommentMetadata } from '@pages/load/pages/load-table/models';

// helpers
import moment from 'moment';
import { UserHelper } from '@shared/utils/helpers';

// pipes
import { CreateLoadCommentsPipe } from '@shared/pipes';
import { eStringPlaceholder } from 'ca-components';

@Component({
    selector: 'app-load-details-additional',
    templateUrl: './load-details-additional.component.html',
    styleUrl: './load-details-additional.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,
        // components
        CaLoadStatusLogComponent,
        TaCommentsSearchComponent,
        // pipes
        CreateLoadCommentsPipe,
    ],
})
export class LoadDetailsAdditionalComponent implements OnDestroy, OnInit {
    @Input() isAddNewComment: boolean;
    @Input() isSearchComment: boolean;
    @Input() isHeaderHidden: boolean = false;

    @Output() commentsCountChanged = new EventEmitter<boolean>();

    public eSharedString = eSharedString;

    public statusLogSortDirection = eSharedString.DSC;

    private destroy$ = new Subject<void>();
    public companyUser: SignInResponse;
    // boolean flags
    public isStatusHistoryDisplayed: boolean = false;
    public isSearchActive: boolean = false;
    // enums
    public eColor = eColor;
    public eIconPath = eIconPath;
    // filter
    public commentFilter: string = eStringPlaceholder.EMPTY;

    constructor(
        public loadStoreService: LoadStoreService,
        public commentService: CommentService
    ) {}
    public ngOnInit(): void {
        this.getCompanyUser();
    }

    private getCompanyUser(): void {
        this.companyUser = UserHelper.getUserFromLocalStorage();
    }

    public onSortChange(sortDirection: eSharedString): void {
        this.statusLogSortDirection = sortDirection;
    }

    public handleCommentActionEmit(
        commentData: CommentData,
        loadId: number
    ): void {
        switch (commentData.btnType) {
            case eGeneralActions.CANCEL:
                break;
            case eGeneralActions.CONFIRM:
                const comment = {
                    ...commentData,
                    commentDate: `${commentData.commentDate}, ${commentData.commentTime}`,
                    isCommenting: false,
                    isEdited: commentData.isEditConfirm,
                };
                if (comment.isEdited) {
                    const { commentId, commentContent, commentDate, isEdited } =
                        comment;
                    const updatedComment: CommentCompanyUser = {
                        commentId,
                        commentContent,
                        commentDate,
                        isEdited,
                        companyUser: {
                            id: this.companyUser.userId,
                            name: `${this.companyUser.firstName} ${this.companyUser.lastName}`,
                            avatarFile: this.companyUser.avatarFile,
                        },
                    };
                    this.loadStoreService.dispatchUpdateComment(updatedComment);
                } else {
                    const newComment: CreateCommentCommand = {
                        entityTypeCommentId: 2,
                        entityTypeId: loadId,
                        commentContent: commentData.commentContent,
                    };
                    this.commentService
                        .apiCommentPost(newComment)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe();
                }
                break;
            case eGeneralActions.DELETE:
                this.loadStoreService.dispatchDeleteCommentById(
                    commentData.commentId,
                    loadId
                );
                break;
            default:
                break;
        }
    }
    public handleSortActionEmit(
        sortDirection: eSortDirection,
        loadId: number
    ): void {
        if (!sortDirection) return;
        this.loadStoreService.sortLoadComments(loadId, sortDirection);
    }
    public handleSearchHighlightActionEmit(searchHighlightValue: string): void {
        this.commentFilter = searchHighlightValue;
    }
    public toggleIsSearchActive(): void {
        this.isSearchActive = !this.isSearchActive;
    }
    public addNewComment(loadId: number): void {
        const comment: CreateCommentCommand = {
            entityTypeCommentId: 2,
            entityTypeId: loadId,
            commentContent: eStringPlaceholder.EMPTY,
        };
        const dateNow = moment().format(eDateTimeFormat.MM_DD_YY);
        const { avatarFile, firstName, lastName, companyUserId } =
            this.companyUser;
        const commentMetadata: ICreateCommentMetadata = {
            cardId: loadId,
            date: dateNow,
            createdAt: dateNow,
            companyUser: {
                avatar: avatarFile.url,
                fullName: `${firstName} ${lastName}`,
                id: companyUserId,
            },
        };
        this.loadStoreService.dispatchCreateComment(comment, commentMetadata);
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
