import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { Subject, takeUntil } from 'rxjs';

// animations
import { dropdownAnimationComment } from '@shared/components/ta-comment/animations/dropdown-animation-comment.animation';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// moment
import moment from 'moment';

// services
import { CommentsService } from '@shared/services/comments.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TaInputDropdownTableService } from '@shared/components/ta-input-dropdown-table/services/ta-input-dropdown-table.service';
import { LoadService } from '@shared/services/load.service';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { CommentStringEnum } from '@shared/components/ta-comment/enums/comment-string.enum';
import {
    eGeneralActions,
    eSharedString,
    eSortDirection,
    TableStringEnum,
} from '@shared/enums';

// pipes
import { TaCommentHighlistComponentPipe } from '@shared/components/ta-comment/pipes/ta-comment-higlits-comment.pipe';
import {
    AbbreviateFullnamePipe,
    HighlightCommentPartPipe,
    FormatDatePipe,
    SafeHtmlPipe,
} from '@shared/pipes';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// helpers
import { CopyPasteHelper } from '@shared/utils/helpers/copy-paste.helper';
import { UserHelper } from '@shared/utils/helpers';

// models
import { CommentCompanyUser } from '@shared/models/comment-company-user.model';
import { CommentData } from '@shared/models/comment-data.model';
import { Comment } from '@shared/models/card-models/card-table-data.model';

// assets
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
import { ePosition } from 'ca-components';

@Component({
    selector: 'app-ta-comment',
    templateUrl: './ta-comment.component.html',
    styleUrls: ['./ta-comment.component.scss'],
    standalone: true,
    providers: [FormatDatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbTooltipModule,
        NgbModule,

        // pipes
        SafeHtmlPipe,
        TaCommentHighlistComponentPipe,
        AbbreviateFullnamePipe,
        HighlightCommentPartPipe,

        // components
        TaAppTooltipV2Component,
    ],
    animations: [dropdownAnimationComment('dropdownAnimationComment')],
})
export class TaCommentComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('commentInput') public commentInput: ElementRef;
    @ViewChild('editCommentEl') editCommentEl: ElementRef;

    @ViewChild('customInput') customInput!: ElementRef;

    @Input() commentData?: CommentCompanyUser;

    @Input() commentCardsDataDropdown?: Comment;
    @Input() commentHighlight?: string;
    @Input() commentsCardId?: number;

    @Input() commentIndex?: number;
    @Input() isMe?: boolean = false;
    @Input() isEditButtonDisabled?: boolean = false;

    @Input() isDetailsCommentLayout?: boolean = false;

    @Output() onAction = new EventEmitter<CommentData>();
    @Output() closeDropdown = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    private placeholder: string = CommentStringEnum.WRITE_COMMENT_PLACEHOLDER;

    public commentAvatar: SafeResourceUrl;

    public isCommenting: boolean = true;
    public isDisabled: boolean = true;
    public isEditing: boolean = false;
    public isEdited: boolean = false;

    public commentDate: string;
    private commentBeforeEdit: string;

    // card comments
    public editingCardComment: boolean = false;

    public loggedUserCommented: boolean;

    // assets
    public sharedSvgRoutes = SharedSvgRoutes;
    public eGeneralActions = eGeneralActions;
    public eSortDirection = eSortDirection;
    public eSharedString = eSharedString;
    public ePosition = ePosition;

    constructor(
        private cdr: ChangeDetectorRef,

        // services
        private formatDatePipe: FormatDatePipe,
        private commentsService: CommentsService,
        private loadService: LoadService,
        private modalService: ModalService,
        private confirmationService: ConfirmationService,
        private taInputDropdownTableService: TaInputDropdownTableService
    ) {}

    ngOnInit(): void {
        this.commentAvatar =
            this.commentData?.companyUser?.avatarFile?.url ?? null;

        this.commentData?.commentContent && this.patchCommentData();

        this.checkIfNewCommentOpen();

        if (this.commentCardsDataDropdown) {
            this.checkIfLoggedUserCommented(
                this.commentCardsDataDropdown.companyUser.id
            );

            this.transformDate(this.commentCardsDataDropdown.createdAt);
        }
    }

    ngAfterViewInit(): void {
        if (!this.commentCardsDataDropdown) this.setCommentPlaceholder();
    }

    public transformDate(date: string): void {
        this.commentCardsDataDropdown.createdAt =
            this.formatDatePipe.transform(date);
    }

    public onOpenEditComment(openClose: boolean): void {
        if (openClose) {
            this.taInputDropdownTableService.setDropdownCommentNewCommentState(
                CommentStringEnum.OPEN_COMMENT
            );
            this.editingCardComment = openClose;
        } else {
            this.taInputDropdownTableService.setDropdownCommentNewCommentState(
                CommentStringEnum.EMPTY_STRING_PLACEHOLDER
            );
            this.editingCardComment = openClose;
        }

        setTimeout(() => {
            if (this.editCommentEl)
                this.editCommentEl.nativeElement.textContent =
                    this.commentCardsDataDropdown.commentContent;
        }, 200);
    }

    public editComment(commentId: number): void {
        const editComment = this.editCommentEl.nativeElement.textContent;

        const comment = {
            id: commentId,
            commentContent: editComment,
        };

        this.commentsService
            .updateComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.editingCardComment = false;
                this.commentCardsDataDropdown.commentContent = editComment;
            });
    }

    public deleteComment(commentId: number, btnType?: string): void {
        this.closeDropdown.emit(true);

        const comment = {
            commentContent: this.commentCardsDataDropdown
                ? this.commentCardsDataDropdown?.commentContent
                : this.commentInput.nativeElement.textContent,
            entityTypeId: this.commentsCardId,
            commentId: commentId,
        };

        this.modalService.openModal(
            ConfirmationModalComponent,
            {
                size: CommentStringEnum.SMALL,
            },
            {
                type: CommentStringEnum.DELETE_SMALL,
                data: { ...comment },
                template: TableStringEnum.COMMENT,
            }
        );

        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (response.type === CommentStringEnum.DELETE_SMALL) {
                    if (btnType) {
                        const emitData: CommentData = {
                            commentId: this.commentData.commentId,
                            commentContent:
                                this.commentInput.nativeElement.textContent,
                            commentIndex: this.commentIndex,
                            isEditCancel: this.isEditing,
                            btnType,
                        };

                        this.onAction.emit(emitData);

                        this.isEditing = false;
                        this.isCommenting = false;
                    } else {
                        this.commentsService
                            .deleteCommentById(commentId)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(() => {
                                this.loadService.removeComment(comment);
                            });
                    }
                }
            });
    }

    public checkIfLoggedUserCommented(user: number): void {
        const userLocalStorage = UserHelper.getUserFromLocalStorage();

        this.loggedUserCommented = user === userLocalStorage.companyUserId;

        this.cdr.detectChanges();
    }

    public onToggleComment(comment: Comment): void {
        this.commentCardsDataDropdown = {
            ...comment,
            isOpen: comment.isOpen,
        };
    }

    private setCommentPlaceholder(): void {
        const commentInputDiv = this.commentInput
            .nativeElement as HTMLDivElement;

        if (!commentInputDiv.textContent.trim())
            commentInputDiv.textContent = this.placeholder;
    }

    public handleCommentBlur(): void {
        const commentInputDiv = this.commentInput
            .nativeElement as HTMLDivElement;

        if (!commentInputDiv.textContent.trim())
            commentInputDiv.textContent = this.placeholder;
    }

    public handleCommentChange(): void {
        const commentInputDiv = this.commentInput
            .nativeElement as HTMLDivElement;

        if (commentInputDiv.textContent.trim() === this.placeholder)
            commentInputDiv.textContent =
                CommentStringEnum.EMPTY_STRING_PLACEHOLDER;

        this.checkIfCommentIsEmpty();
    }

    public checkIfCommentIsEmpty(): boolean {
        if (this.commentInput) {
            const divContent =
                this.commentInput.nativeElement.textContent.trim();

            return (this.isDisabled =
                divContent === CommentStringEnum.WRITE_COMMENT_PLACEHOLDER ||
                divContent === CommentStringEnum.EMPTY_STRING_PLACEHOLDER);
        }

        return (this.isDisabled = false);
    }

    public onHandleBtnActionClick(btnType: string): void {
        switch (btnType) {
            case CommentStringEnum.CONFIRM:
                if (this.isEditing) {
                    if (
                        this.commentInput.nativeElement.textContent.trim() !==
                        this.commentBeforeEdit
                    )
                        this.isEdited = true;

                    this.isEditing = false;
                }

                const dateAndTimeNow =
                    MethodsCalculationsHelper.convertDateFromBackendToDateAndTime(
                        new Date()
                    );
                const dateNow = moment().format(
                    CommentStringEnum.COMMENT_DATE_FORMAT
                );
                const timeNow = moment().format(
                    CommentStringEnum.COMMENT_TIME_FORMAT
                );
                const commentData: CommentData = {
                    commentId: this.commentData.commentId,
                    commentDate: dateNow,
                    commentTime: timeNow,
                    commentContent: this.commentInput.nativeElement.textContent,
                    commentIndex: this.commentIndex,
                    isEditConfirm: !!this.commentData.commentId,
                    btnType,
                };

                this.commentDate = dateAndTimeNow;

                this.isCommenting = false;

                this.onAction.emit(commentData);

                break;
            case CommentStringEnum.CANCEL:
            case CommentStringEnum.DELETE:
                this.deleteComment(this.commentData.commentId, btnType);
                break;
            case CommentStringEnum.EDIT:
                this.commentBeforeEdit =
                    this.commentInput.nativeElement.textContent.trim();

                this.isEditing = true;
                this.isCommenting = true;

                break;
            default:
                break;
        }
    }

    private patchCommentData(): void {
        this.isCommenting = false;
        this.isDisabled = false;

        setTimeout(() => {
            this.commentInput.nativeElement.textContent =
                this.commentData.commentContent;
        }, 100);

        this.commentDate = this.commentData.commentDate;
        this.isEdited = this.commentData.isEdited;
    }

    public onPaste(event: ClipboardEvent): void {
        CopyPasteHelper.onPaste(event);
    }

    private checkIfNewCommentOpen(): void {
        this.taInputDropdownTableService
            .getDropdownCommentNewCommentState()
            .pipe(takeUntil(this.destroy$))
            .subscribe((opened) => {
                if (opened === CommentStringEnum.OPEN_NEW_COMMENT) {
                    this.editingCardComment = false;

                    this.cdr.detectChanges();
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
