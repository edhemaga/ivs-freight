import { Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
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

// animations
import { dropdown_animation_comment } from './state/ta-comment.animation';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// moment
import moment from 'moment';

// services
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { LoadTService } from '../../load/state/load.service';
import { CommentsService } from 'src/app/core/services/comments/comments.service';

// enums
import { ConstantStringCommentEnum } from 'src/app/core/utils/enums/comment.enum';

// models
import { CommentCompanyUser } from '../../modals/load-modal/state/models/load-modal-model/comment-company-user';
import { CommentData } from 'src/app/core/model/comment-data';
import { convertDateFromBackendToDateAndTime } from 'src/app/core/utils/methods.calculations';
import { Comment } from '../../shared/model/cardTableData';

// pipe
import { SafeHtmlPipe } from 'src/app/core/pipes/safe-html.pipe';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

// components
import { AppTooltipComponent } from '../app-tooltip/app-tooltip.component';

@Component({
    selector: 'app-ta-comment',
    templateUrl: './ta-comment.component.html',
    styleUrls: ['./ta-comment.component.scss'],
    standalone: true,
    providers: [formatDatePipe],
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
        AppTooltipComponent,
    ],
    animations: [dropdown_animation_comment('dropdownAnimationComment')],
})
export class TaCommentComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('commentInput') public commentInput: ElementRef;
    @ViewChild('textareaRefValue', { static: false }) textareaRef: ElementRef;

    @ViewChild('customInput') customInput!: ElementRef;

    @Input() commentData?: CommentCompanyUser;

    @Input() commentCardsDataDropdown?: Comment;
    @Input() commentHighlight?: string;
    @Input() commentsCardId?: number;

    @Input() commentIndex?: number;
    @Input() isMe?: boolean = false;
    @Input() isEditButtonDisabled?: boolean = false;

    @Output() btnActionEmitter = new EventEmitter<CommentData>();

    private destroy$ = new Subject<void>();

    private placeholder: string =
        ConstantStringCommentEnum.WRITE_COMMENT_PLACEHOLDER;
    public commentAvatar: SafeResourceUrl;

    public isCommenting: boolean = true;
    public isDisabled: boolean = true;
    public isEditing: boolean = false;
    public isEdited: boolean = false;

    public commentDate: string;
    private commentBeforeEdit: string;

    // Cards comments
    public editingCardComment: boolean = false;

    public dataSubscription: Subscription;

    public newCommentText: string;

    constructor(
        private imageBase64Service: ImageBase64Service,
        private formatDatePipe: formatDatePipe,
        private commentsService: CommentsService,
        private loadService: LoadTService
    ) {}

    ngOnInit(): void {
        this.sanitazeAvatar();

        this.commentData?.commentContent && this.patchCommentData();
    }

    ngAfterViewInit(): void {
        if (!this.commentCardsDataDropdown) this.setCommentPlaceholder();
    }

    public adjustTextareaHeight(element: HTMLTextAreaElement): void {
        this.newCommentText = element.value;

        const lineHeight = 21;
        element.style.height = ConstantStringCommentEnum.HEIGHT;

        if (element.scrollWidth > element.offsetWidth) {
            element.style.height =
                lineHeight +
                element.scrollHeight +
                ConstantStringCommentEnum.PX;
        } else {
            element.style.height =
                element.scrollHeight + ConstantStringCommentEnum.PX;
        }
    }

    public transformDate(date: string): void {
        return this.formatDatePipe.transform(date);
    }

    public openEditComment(openClose: boolean): void {
        this.editingCardComment = openClose;
    }

    public editComment(commentId: number): void {
        const textareaValue = this.textareaRef.nativeElement.value;

        const comment = {
            id: commentId,
            commentContent: textareaValue,
        };

        this.commentsService
            .updateComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.editingCardComment = false;
                    this.commentCardsDataDropdown.commentContent =
                        textareaValue;
                },
                error: () => {},
            });
    }

    public deleteComment(commentId: number): void {
        const comment = {
            entityTypeId: this.commentsCardId,
            commentId: commentId,
        };

        this.commentsService
            .deleteCommentById(commentId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.loadService.removeComment(comment);
                },
                error: () => {},
            });
    }

    public checkIfLoggedUserCommented(user: number): boolean {
        const userLocalStorage = JSON.parse(
            localStorage.getItem(ConstantStringCommentEnum.USER)
        );
        return user === userLocalStorage.companyUserId;
    }

    public higlitsPartOfCommentSearchValue(commentTitle: string): string {
        if (!commentTitle || !this.commentHighlight) return commentTitle;

        return commentTitle.replace(
            new RegExp(this.commentHighlight, 'gi'),
            (match) => {
                return (
                    '<span class="highlighted" style="color:#92b1f5; background: #6f9ee033">' +
                    match +
                    '</span>'
                );
            }
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
                ConstantStringCommentEnum.EMPTY_STRING_PLACEHOLDER;

        this.checkIfCommentIsEmpty();
    }

    public checkIfCommentIsEmpty(): boolean {
        if (this.commentInput) {
            const divContent =
                this.commentInput.nativeElement.textContent.trim();

            return (this.isDisabled =
                divContent ===
                    ConstantStringCommentEnum.WRITE_COMMENT_PLACEHOLDER ||
                divContent ===
                    ConstantStringCommentEnum.EMPTY_STRING_PLACEHOLDER);
        }

        return (this.isDisabled = false);
    }

    public handleBtnActionClick(btnType: string): void {
        switch (btnType) {
            case ConstantStringCommentEnum.CONFIRM:
                if (this.isEditing) {
                    if (
                        this.commentInput.nativeElement.textContent.trim() !==
                        this.commentBeforeEdit
                    )
                        this.isEdited = true;

                    this.isEditing = false;
                }

                const dateAndTimeNow = convertDateFromBackendToDateAndTime(
                    new Date()
                );
                const dateNow = moment().format(
                    ConstantStringCommentEnum.COMMENT_DATE_FORMAT
                );
                const timeNow = moment().format(
                    ConstantStringCommentEnum.COMMENT_TIME_FORMAT
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
            case ConstantStringCommentEnum.CANCEL:
            case ConstantStringCommentEnum.DELETE:
                const emitData: CommentData = {
                    commentContent: this.commentInput.nativeElement.textContent,
                    commentIndex: this.commentIndex,
                    isEditCancel: this.isEditing,
                    btnType,
                };

                this.btnActionEmitter.emit(emitData);

                this.isEditing = false;
                this.isCommenting = false;

                break;
            case ConstantStringCommentEnum.EDIT:
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
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
