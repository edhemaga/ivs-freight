import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { TaCommentsSearchComponent } from '@shared/components/ta-comments-search/ta-comments-search.component';

// Services
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// Enums
import { eGeneralActions } from '@shared/enums';

// Models
import { CommentData } from '@shared/models';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-load-details-additional',
    templateUrl: './load-details-additional.component.html',
    styleUrl: './load-details-additional.component.scss',
    standalone: true,
    imports: [
        // Modules
        CommonModule,

        // Components
        TaCommentsSearchComponent,
    ],
})
export class LoadDetailsAdditionalComponent {
    constructor(protected loadStoreService: LoadStoreService) {}

    // public handleCommentActionEmit(commentData: CommentData): void {
    //     switch (commentData.btnType) {
    //         case eGeneralActions.CANCEL:
    //             if (!commentData.isEditCancel)
    //                 this.comments.splice(commentData.commentIndex, 1);

    //             this.isCommenting = false;

    //             break;
    //         case eGeneralActions.CONFIRM:
    //             this.comments[commentData.commentIndex] = {
    //                 ...this.comments[commentData.commentIndex],
    //                 commentContent: commentData.commentContent,
    //                 commentDate: `${commentData.commentDate}, ${commentData.commentTime}`,
    //                 isCommenting: false,
    //                 isEdited: commentData.isEditConfirm,
    //             };

    //             this.editedCommentId = commentData.commentId;

    //             this.isCommenting = false;

    //             const commentContent =
    //                 this.comments[commentData.commentIndex].commentContent;

    //             if (commentData.isEditConfirm) {
    //                 this.updateCommentById(
    //                     this.editedCommentId,
    //                     commentContent
    //                 );
    //             } else {
    //                 this.createComment(
    //                     commentContent,
    //                     commentData.commentIndex
    //                 );
    //             }

    //             this.commentsCountChanged.emit(true);

    //             break;
    //         case eGeneralActions.DELETE:
    //             this.comments.splice(commentData.commentIndex, 1);

    //             this.deletedCommentId = commentData.commentId;

    //             this.isCommenting = false;

    //             this.deleteCommentById(this.deletedCommentId);

    //             this.commentsCountChanged.emit(true);

    //             break;
    //         default:
    //             break;
    //     }
    // }

    // private createComment(commentContent: string, commentIndex: number): void {

    //     this.loadStoreService.dispatchCreateComment()
    //     const comment = {
    //         entityTypeCommentId: 2,
    //         entityTypeId: this.load?.id,
    //         commentContent: commentContent,
    //     };

    //     this.commentsService
    //         .createComment(comment, this.load?.id)
    //         .pipe(takeUntil(this.destroy$))
    //         .subscribe((res) => {
    //             this.comments[commentIndex] = {
    //                 ...this.comments[commentIndex],
    //                 commentId: res.id,
    //             };
    //         });
    // }

    // private updateCommentById(id: number, commentContent: string): void {
    //     const comment = {
    //         id,
    //         commentContent,
    //     };

    //     this.commentsService
    //         .updateComment(comment, this.load?.id)
    //         .pipe(takeUntil(this.destroy$))
    //         .subscribe();
    // }

    // private deleteCommentById(id: number): void {
    //     this.commentsService
    //         .deleteCommentById(id, this.load?.id)
    //         .pipe(takeUntil(this.destroy$))
    //         .subscribe();
    // }
}
