import { Subject } from 'rxjs';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserModel } from 'src/app/core/model/user-localstorage.model';

//moment
import moment from 'moment';

// enums
import { ConstantStringTableDropdownEnum } from '../../../../utils/enums/ta-input-dropdown-table';

// services
import { CommentsService } from 'src/app/core/services/comments/comments.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { TaInputDropdownTableService } from '../utils/services/ta-input-dropdown-table.service';
import { LoadService } from 'src/app/shared/services/load.service';

@Component({
    selector: 'app-ta-new-comment',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
    templateUrl: './ta-new-comment.component.html',
    styleUrls: ['./ta-new-comment.component.scss'],
})
export class TaNewCommentComponent implements OnDestroy, OnInit {
    @ViewChild('newCommentEl') newCommentEl: ElementRef;

    @Input() commmentsData;
    @Input() openNewComment;

    private destroy$ = new Subject<void>();

    public user: UserModel;

    public placeholder: string =
        ConstantStringTableDropdownEnum.WRITE_COMMENT_PLACEHOLDER;

    public commentAvatar: SafeResourceUrl;

    public isDisabled: boolean = true;

    constructor(
        private loadService: LoadService,
        private commentService: CommentsService,
        public imageBase64Service: ImageBase64Service,
        private taInputDropdownTableService: TaInputDropdownTableService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.checkIfNewCommentOpen();
    }

    public getUserFromLocalStorage(): void {
        const user = JSON.parse(
            localStorage.getItem(ConstantStringTableDropdownEnum.USER)
        );

        this.user = user;

        this.sanitazeAvatar();
    }

    public newComment(type: string, loadId: number): void {
        switch (type) {
            case ConstantStringTableDropdownEnum.OPEN_NEW_COMMENT:
                this.openNewComment = true;

                this.taInputDropdownTableService.setDropdownCommentNewCommentState(
                    ConstantStringTableDropdownEnum.OPEN_NEW_COMMENT
                );

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

        this.checkIfCommentIsEmpty();
    }

    public checkIfCommentIsEmpty(): boolean {
        if (this.newCommentEl) {
            const divContent =
                this.newCommentEl.nativeElement.textContent.trim();

            return (this.isDisabled =
                divContent ===
                    ConstantStringTableDropdownEnum.WRITE_COMMENT_PLACEHOLDER ||
                divContent ===
                    ConstantStringTableDropdownEnum.EMPTY_STRING_PLACEHOLDER);
        }

        return (this.isDisabled = false);
    }

    private sanitazeAvatar(): void {
        this.commentAvatar = this.user?.avatar
            ? this.imageBase64Service.sanitizer(this.user?.avatar)
            : null;
    }

    private checkIfNewCommentOpen(): void {
        this.taInputDropdownTableService
            .getDropdownCommentNewCommentState()
            .pipe(takeUntil(this.destroy$))
            .subscribe((opened) => {
                if (opened === ConstantStringTableDropdownEnum.OPEN_COMMENT) {
                    this.openNewComment = false;

                    this.cdr.detectChanges();
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
