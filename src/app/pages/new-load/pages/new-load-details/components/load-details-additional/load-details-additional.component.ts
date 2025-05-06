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
import {
    CaLoadStatusLogComponent,
    CaTabSwitchComponent,
    CaToolbarDropdownComponent,
    CaCommentsComponent,
} from 'ca-components';

// Services
import { LoadStoreService } from '@pages/new-load/state/services/load-store.service';

// Enums
import {
    eGeneralActions,
    eColor,
    eDateTimeFormat,
    eSortDirection,
    eSharedString,
} from '@shared/enums';
import { eStringPlaceholder } from 'ca-components';
import { eLoadDetailsGeneral } from '@pages/new-load/enums';

// Models
import { CommentCompanyUser, CommentData, Tabs, User } from '@shared/models';
import {
    CommentService,
    CreateCommentCommand,
    SignInResponse,
} from 'appcoretruckassist';
import { ICreateCommentMetadata } from '@pages/load/pages/load-table/models';
import { IDropdownItem } from 'ca-components';

// helpers
import moment from 'moment';
import { UserHelper } from '@shared/utils/helpers';
import {
    CommentHelper,
    CommentTabHelper,
} from '@pages/new-load/pages/new-load-details/utils';

// pipes
import { CreateLoadCommentsPipe } from '@shared/pipes';
import { CreateLoadAdditionalInfoDropdownOptionsPipe } from '@pages/new-load/pages/new-load-details/pipes';

// assets
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

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
        TaCommentsSearchComponent,
        CaLoadStatusLogComponent,
        CaToolbarDropdownComponent,
        CaTabSwitchComponent,
        CaCommentsComponent,
        // pipes
        CreateLoadCommentsPipe,
        CreateLoadAdditionalInfoDropdownOptionsPipe,
    ],
})
export class LoadDetailsAdditionalComponent implements OnDestroy, OnInit {
    @Input() isAddNewComment: boolean;
    @Input() isSearchComment: boolean;
    @Input() isHeaderHidden: boolean = false;

    @Output() onCommentsCountChanged = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    public statusLogSortDirection = eSharedString.DSC;

    public companyUser: SignInResponse;

    // boolean flags
    public isSearchActive: boolean = false;
    public isDriverButtonSelected: boolean = false;

    // TODO mozda ovo preko nekog id-a odraditi
    public displayedSection:
        | eLoadDetailsGeneral.COMMENT
        | eLoadDetailsGeneral.STATUS_LOG = eLoadDetailsGeneral.COMMENT;

    // enums
    public eColor = eColor;
    public eSharedString = eSharedString;
    public eLoadDetailsGeneral = eLoadDetailsGeneral;

    // assets
    public sharedSvgRoutes = SharedSvgRoutes;
    public commentTabs: Tabs[] = CommentTabHelper.getCommentTabs();

    // filter
    public commentFilter: string = eStringPlaceholder.EMPTY;

    public currentUser: User = UserHelper.getUserFromLocalStorage();

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

    public onCommentAction(commentData: CommentData, loadId: number): void {
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
                if (comment.isEdited)
                    this.editComment(
                        comment.commentId,
                        comment.commentContent,
                        comment.commentDate,
                        comment.isEdited
                    );
                else {
                    const newComment: CreateCommentCommand =
                        CommentHelper.createCommentCommand(
                            loadId,
                            commentData.commentContent
                        );
                    this.commentService
                        .apiCommentPost(newComment)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe();
                }
                break;
            case eGeneralActions.DELETE:
                // this.loadStoreService.dispatchDeleteCommentById(
                //     commentData.commentId,
                //     loadId
                // );
                break;
            default:
                break;
        }
    }

    public onSortAction(sortDirection: eSortDirection, loadId: number): void {
        if (!sortDirection) return;
        // this.loadStoreService.sortLoadComments(loadId, sortDirection);
    }

    public onSearchHighlightAction(searchHighlightValue: string): void {
        this.commentFilter = searchHighlightValue;
    }

    public onToggleIsSearchActive(): void {
        this.isSearchActive = !this.isSearchActive;
    }

    public onAddNewComment(loadId: number): void {
        const comment: CreateCommentCommand =
            CommentHelper.createCommentCommand(loadId);
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
        // this.loadStoreService.dispatchCreateComment(comment, commentMetadata);
    }

    private editComment(
        commentId: number,
        commentContent: string,
        commentDate: string,
        isEdited: boolean
    ): void {
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
        // this.loadStoreService.dispatchUpdateComment(updatedComment);
    }

    public onDropdownItemSelect(event: IDropdownItem): void {
        if (
            event.title !== eLoadDetailsGeneral.COMMENT &&
            event.title !== eLoadDetailsGeneral.STATUS_LOG
        )
            return;

        this.displayedSection = event.title;
    }

    public onItemSelected(event: Tabs): void {
        this.isDriverButtonSelected = event.id === 2;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
