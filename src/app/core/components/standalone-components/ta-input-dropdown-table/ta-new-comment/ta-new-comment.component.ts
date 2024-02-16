import { Subject } from 'rxjs';
import {
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserModel } from 'src/app/core/model/user-localstorage.model';

//moment
import moment from 'moment';

// enums
import { ConstantStringTableDropdownEnum } from '../../../../utils/enums/ta-input-dropdown-table';

// services
import { LoadTService } from '../../../load/state/load.service';
import { CommentsService } from 'src/app/core/services/comments/comments.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';

@Component({
    selector: 'app-ta-new-comment',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
    templateUrl: './ta-new-comment.component.html',
    styleUrls: ['./ta-new-comment.component.scss'],
})
export class TaNewCommentComponent implements OnDestroy {
    @ViewChild('newCommentEl') newCommentEl: ElementRef;

    @Input() commmentsData;
    @Input() openNewComment;

    private destroy$ = new Subject<void>();

    public user: UserModel;

    public placeholder: string =
        ConstantStringTableDropdownEnum.WRITE_COMMENT_PLACEHOLDER;

    constructor(
        private loadService: LoadTService,
        private commentService: CommentsService,
        public imageBase64Service: ImageBase64Service
    ) {}

    public getUserFromLocalStorage(): void {
        const user = JSON.parse(
            localStorage.getItem(ConstantStringTableDropdownEnum.USER)
        );

        this.user = user;
    }

    public newComment(type: string, loadId: number): void {
        switch (type) {
            case ConstantStringTableDropdownEnum.OPEN_NEW_COMMENT:
                this.openNewComment = true;

                setTimeout(() => {
                    this.setCommentPlaceholder();
                }, 100);

                this.getUserFromLocalStorage();
                break;

            case ConstantStringTableDropdownEnum.ADD_NEW_COMMENT:
                const comment = {
                    entityTypeCommentId: 2,
                    entityTypeId: loadId,
                    commentContent: this.newCommentEl.nativeElement.textContent,
                };

                this.commentService
                    .createComment(comment)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (res) => {
                            this.loadService.addData({
                                ...comment,
                                cardId: loadId,
                                createdAt: moment().format(),
                                companyUser: {
                                    avatar: this.user.avatar,
                                    fullName:
                                        this.user.firstName +
                                        ' ' +
                                        this.user.lastName,
                                    id: this.user.companyUserId,
                                },
                                id: res.id,
                            });
                        },
                    });

                this.openNewComment = false;

                break;

            default:
                break;
        }
    }

    private setCommentPlaceholder(): void {
        const commentInputDiv = this.newCommentEl
            .nativeElement as HTMLDivElement;
        if (!commentInputDiv.textContent.trim())
            commentInputDiv.textContent = this.placeholder;
    }

    public handleCommentBlur(): void {
        const commentInputDiv = this.newCommentEl
            .nativeElement as HTMLDivElement;

        if (!commentInputDiv.textContent.trim())
            commentInputDiv.textContent = this.placeholder;
    }

    public handleCommentChange(): void {
        const commentInputDiv = this.newCommentEl
            .nativeElement as HTMLDivElement;

        if (commentInputDiv.textContent.trim() === this.placeholder)
            commentInputDiv.textContent =
                ConstantStringTableDropdownEnum.EMPTY_STRING_PLACEHOLDER;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
