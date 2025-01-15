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
import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';

import { takeUntil } from 'rxjs/operators';

// models
import { AngularSvgIconModule } from 'angular-svg-icon';
import { User } from '@shared/models/user.model';
import { CreateCommentCommand } from 'appcoretruckassist';
import { ICreateCommentMetadata } from '@pages/load/pages/load-table/models';

// moment
import moment from 'moment';

// enums
import { TaInputDropdownTableStringEnum } from '@shared/components/ta-input-dropdown-table/enums/ta-input-dropdown-table-string.enum';
import { CommentStringEnum } from '@shared/components/ta-comment/enums/comment-string.enum';

// services
import { CommentsService } from '@shared/services/comments.service';
import { TaInputDropdownTableService } from '@shared/components/ta-input-dropdown-table/services/ta-input-dropdown-table.service';
import { LoadService } from '@shared/services/load.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Svg routes
import { NewCommentSvgRoutes } from '@shared/components/ta-input-dropdown-table/components/ta-new-comment/utils/svg-routes';

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

    public user: User;

    public placeholder: string =
        TaInputDropdownTableStringEnum.WRITE_COMMENT_PLACEHOLDER;

    public commentAvatar: SafeResourceUrl;

    public isDisabled: boolean = true;

    // Svg routes
    public newCommentSvgRoutes = NewCommentSvgRoutes;

    constructor(
        private loadService: LoadService,
        private loadStoreService: LoadStoreService,
        private commentService: CommentsService,
        private taInputDropdownTableService: TaInputDropdownTableService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.checkIfNewCommentOpen();
    }

    public getUserFromLocalStorage(): void {
        const user = JSON.parse(
            localStorage.getItem(TaInputDropdownTableStringEnum.USER)
        );

        this.user = user;
        this.commentAvatar = this.user?.avatarFile?.url ?? null;
    }

    public newComment(type: string, loadId: number): void {
        switch (type) {
            case TaInputDropdownTableStringEnum.OPEN_NEW_COMMENT:
                this.openNewComment = true;

                this.taInputDropdownTableService.setDropdownCommentNewCommentState(
                    TaInputDropdownTableStringEnum.OPEN_NEW_COMMENT
                );

                setTimeout(() => {
                    this.setCommentPlaceholder();
                }, 100);

                this.getUserFromLocalStorage();
                break;

            case TaInputDropdownTableStringEnum.ADD_NEW_COMMENT:
                const { nativeElement } = this.newCommentEl || {};
                const { textContent } = nativeElement || {};
                const comment: CreateCommentCommand = {
                    entityTypeCommentId: 2,
                    entityTypeId: loadId,
                    commentContent: textContent,
                };
                const dateNow = moment().format(
                    CommentStringEnum.COMMENT_DATE_FORMAT
                );
                const { avatarFile, firstName, lastName, companyUserId } = this.user || {};
                const { url } = avatarFile || {};
                const commentMetadata: ICreateCommentMetadata = {
                    cardId: loadId,
                    date: dateNow,
                    createdAt: dateNow,
                    companyUser: {
                        avatar: url,
                        fullName: `${ firstName } ${ lastName }`,
                        id: companyUserId,
                    }
                }

                this.loadStoreService.dispatchCreateComment(comment, commentMetadata);

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
                TaInputDropdownTableStringEnum.EMPTY_STRING_PLACEHOLDER;

        this.checkIfCommentIsEmpty();
    }

    public checkIfCommentIsEmpty(): boolean {
        if (this.newCommentEl) {
            const divContent =
                this.newCommentEl.nativeElement.textContent.trim();

            return (this.isDisabled =
                divContent ===
                    TaInputDropdownTableStringEnum.WRITE_COMMENT_PLACEHOLDER ||
                divContent ===
                    TaInputDropdownTableStringEnum.EMPTY_STRING_PLACEHOLDER);
        }

        return (this.isDisabled = false);
    }

    private checkIfNewCommentOpen(): void {
        this.taInputDropdownTableService
            .getDropdownCommentNewCommentState()
            .pipe(takeUntil(this.destroy$))
            .subscribe((opened) => {
                if (opened === TaInputDropdownTableStringEnum.OPEN_COMMENT) {
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
