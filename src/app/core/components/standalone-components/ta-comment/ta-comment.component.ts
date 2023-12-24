import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// moment
import moment from 'moment';

// enums
import { ConstantStringCommentEnum } from 'src/app/core/utils/enums/comment.enum';

// models
import { SignInResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-ta-comment',
    templateUrl: './ta-comment.component.html',
    styleUrls: ['./ta-comment.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
})
export class TaCommentComponent implements AfterViewInit {
    @ViewChild('commentInput') public commentInput: ElementRef;

    @Input() companyUser: SignInResponse;

    @Output() btnActionEmitter = new EventEmitter<string>();

    private placeholder: string =
        ConstantStringCommentEnum.WRITE_COMMENT_PLACEHOLDER;

    public isCommenting: boolean = true;
    public isDisabled: boolean = true;
    public isMe: boolean = false;
    public isEditing: boolean = false;
    public isEdited: boolean = false;

    public commentDate: string;
    private commentBeforeEdit: string;

    constructor() {}

    ngAfterViewInit(): void {
        this.setCommentPlaceholder();
    }

    private setCommentPlaceholder(): void {
        const div = this.commentInput.nativeElement as HTMLDivElement;

        if (!div.textContent.trim()) div.textContent = this.placeholder;
    }

    public handleCommentBlur(): void {
        const div = this.commentInput.nativeElement as HTMLDivElement;

        if (!div.textContent.trim()) div.textContent = this.placeholder;
    }

    public handleCommentChange(): void {
        const div = this.commentInput.nativeElement as HTMLDivElement;

        if (div.textContent.trim() === this.placeholder)
            div.textContent =
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
                    ConstantStringCommentEnum.COMMENT_DATE_FORMAT
                );

                this.commentDate = dateAndTimeNow;

                this.isCommenting = false;

                break;
            case ConstantStringCommentEnum.CANCEL:
            case ConstantStringCommentEnum.DELETE:
                this.btnActionEmitter.emit(btnType);

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
