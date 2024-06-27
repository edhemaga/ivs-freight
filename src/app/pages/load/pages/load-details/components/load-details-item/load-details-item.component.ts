import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// services
import { CommentsService } from '@shared/services/comments.service';

// components
import { LoadDetailsCardComponent } from '@pages/load/pages/load-details/components/load-details-card/load-details-card.component';
import { LoadDetailsItemStopsComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/load-details-item-stops.component';
import { LoadDetailsItemCommentsComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-comments/load-details-item-comments.component';
import { LoadDetailsItemStatusHistoryComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-status-history/load-details-item-status-history.component';

// models
import { UpdateCommentCommand } from 'appcoretruckassist';
import { ReviewComment } from '@shared/models/review-comment.model';
import { DetailsConfig } from '@shared/models/details-config.model';

@Component({
    selector: 'app-load-details-item',
    templateUrl: './load-details-item.component.html',
    styleUrls: ['./load-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,

        LoadDetailsCardComponent,
        LoadDetailsItemStopsComponent,
        LoadDetailsItemCommentsComponent,
        LoadDetailsItemStatusHistoryComponent,
    ],
})
export class LoadDetailsItemComponent implements OnDestroy {
    @Input() detailsConfig: DetailsConfig;
    @Input() isAddNewComment: boolean;
    @Input() isSearchComment: boolean;

    private destroy$ = new Subject<void>();

    public comments: any[] = [];

    constructor(private commentsService: CommentsService) {}

    public trackByIdentity(_: number, item: DetailsConfig): number {
        return item.id;
    }

    changeCommentEvent(comments: ReviewComment) {
        switch (comments.action) {
            case 'delete': {
                this.deleteComment(comments);
                break;
            }
            case 'update': {
                this.updateComment(comments);
                break;
            }
            default: {
                break;
            }
        }
    }

    private deleteComment(comments: ReviewComment) {
        this.comments = comments.sortData;
        this.commentsService
            .deleteCommentById(comments.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private updateComment(comments: ReviewComment) {
        this.comments = comments.sortData;

        const comment: UpdateCommentCommand = {
            id: comments.data.id,
            commentContent: comments.data.commentContent,
        };

        this.commentsService
            .updateComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
