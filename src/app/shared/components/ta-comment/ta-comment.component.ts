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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Subject, takeUntil } from 'rxjs';

// animations
import { dropdownAnimationComment } from '@shared/components/ta-comment/animations/dropdown-animation-comment.animation';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// moment
import moment from 'moment';

// services
import { ImageBase64Service } from '@shared/services/image-base64.service';
import { CommentsService } from '@shared/services/comments.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { TaInputDropdownTableService } from '@shared/components/ta-input-dropdown-table/services/ta-input-dropdown-table.service';
import { LoadService } from '@shared/services/load.service';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// enums
import { CommentStringEnum } from '@shared/components/ta-comment/enums/comment-string.enum';

// pipes
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// helpers
import { CopyPasteHelper } from '@shared/utils/helpers/copy-paste.helper';
import { CardDropdownHelper } from '@shared/utils/helpers/card-dropdown-helper';
// models
import { CommentCompanyUser } from '@shared/models/comment-company-user.model';
import { CommentData } from '@shared/models/comment-data.model';
import { Comment } from '@shared/models/card-models/card-table-data.model';

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

    @Input() isDeatilsCommentLayout?: boolean = false;

    @Output() btnActionEmitter = new EventEmitter<CommentData>();
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

    constructor(
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,

        // services
        private imageBase64Service: ImageBase64Service,
        private formatDatePipe: FormatDatePipe,
        private commentsService: CommentsService,
        private loadService: LoadService,
        private modalService: ModalService,
        private confirmationService: ConfirmationService,
        private taInputDropdownTableService: TaInputDropdownTableService
    ) {}

    ngOnInit(): void {
        this.sanitazeAvatar();

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

    public abbreviateFullName(fullName: string): string {
        const words = fullName.split(' ');
        if (fullName.length > 19) {
            if (words.length > 1) {
                return `${words[0].charAt(0)}. ${words.slice(1).join(' ')}`;
            }
        } else {
            return fullName;
        }
    }

    public openEditComment(openClose: boolean): void {
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
            .subscribe({
                next: () => {
                    this.editingCardComment = false;
                    this.commentCardsDataDropdown.commentContent = editComment;
                },
                error: () => {},
            });
    }

    public deleteComment(commentId: number): void {
        this.closeDropdown.emit(true);

        const comment = {
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
            }
        );

        this.confirmationService.confirmationData$.subscribe((response) => {
            if (response.type === CommentStringEnum.DELETE_SMALL)
                this.commentsService
                    .deleteCommentById(commentId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.loadService.removeComment(comment);
                        },
                        error: () => {},
                    });
        });
    }

    public checkIfLoggedUserCommented(user: number): void {
        const userLocalStorage = JSON.parse(
            localStorage.getItem(CommentStringEnum.USER)
        );
        this.loggedUserCommented = user === userLocalStorage.companyUserId;
    }

    public higlitsPartOfCommentSearchValue(commentTitle: string): string {
        return CardDropdownHelper.higlitsPartOfCommentSearchValue(
            commentTitle,
            this.commentHighlight,
            this.sanitizer
        );
    }

    private sanitazeAvatar(): void {
        this.commentAvatar = this.commentData?.companyUser?.avatar
            ? this.imageBase64Service.sanitizer(
                  this.commentData.companyUser.avatar
              )
            : null;
    }

    public toogleComment(comment: Comment): void {
        if (comment.isOpen) {
            this.commentCardsDataDropdown = { ...comment, isOpen: false };
        } else {
            this.commentCardsDataDropdown = { ...comment, isOpen: true };
        }
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

    public handleBtnActionClick(btnType: string): void {
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

                this.btnActionEmitter.emit(commentData);

                break;
            case CommentStringEnum.CANCEL:
            case CommentStringEnum.DELETE:
                const emitData: CommentData = {
                    commentId: this.commentData.commentId,
                    commentContent: this.commentInput.nativeElement.textContent,
                    commentIndex: this.commentIndex,
                    isEditCancel: this.isEditing,
                    btnType,
                };

                this.btnActionEmitter.emit(emitData);

                this.isEditing = false;
                this.isCommenting = false;

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
