import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// moment
import moment from 'moment';

// services
import { ImageBase64Service } from 'src/app/core/utils/base64.image';

// enums
import { ConstantStringCommentEnum } from 'src/app/core/utils/enums/comment.enum';

// models
import { CommentCompanyUser } from '../../modals/load-modal/state/models/load-modal-model/comment-company-user';
import { CommentData } from 'src/app/core/model/comment-data';
import { DummyComment } from 'src/app/core/utils/comments-dummy-data';

@Component({
    selector: 'app-ta-comment',
    templateUrl: './ta-comment.component.html',
    styleUrls: ['./ta-comment.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
})
export class TaCommentComponent implements OnInit, AfterViewInit {
    @ViewChild('commentInput') public commentInput: ElementRef;

    @Input() commentData?: CommentCompanyUser;
    @Input() commentCardsDataDropdown?: DummyComment;
    @Input() openComment?: boolean;

    @Input() commentIndex?: number;
    @Input() isMe?: boolean = false;

    @Output() btnActionEmitter = new EventEmitter<CommentData>();

    private placeholder: string =
        ConstantStringCommentEnum.WRITE_COMMENT_PLACEHOLDER;
    public commentAvatar: SafeResourceUrl;

    public isCommenting: boolean = true;
    public isDisabled: boolean = true;
    public isEditing: boolean = false;
    public isEdited: boolean = false;

    public commentDate: string;
    private commentBeforeEdit: string;

    constructor(private imageBase64Service: ImageBase64Service) {}

    ngOnInit(): void {
        this.sanitazeAvatar();
    }

    ngAfterViewInit(): void {
        if (!this.commentCardsDataDropdown) this.setCommentPlaceholder();
    }

    private sanitazeAvatar(): void {
        this.commentAvatar = this.commentData?.companyUser?.avatar
            ? this.imageBase64Service.sanitizer(
                  this.commentData.companyUser.avatar
              )
            : null;
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

                const dateAndTimeNow = moment().format(
                    ConstantStringCommentEnum.COMMENT_DATE_TIME_FORMAT
                );
                const dateNow = moment().format(
                    ConstantStringCommentEnum.COMMENT_DATE_FORMAT
                );
                const timeNow = moment().format(
                    ConstantStringCommentEnum.COMMENT_TIME_FORMAT
                );
                const commentData: CommentData = {
                    commentDate: dateNow,
                    commentTime: timeNow,
                    commentContent: this.commentInput.nativeElement.textContent,
                    commentIndex: this.commentIndex,
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
}
