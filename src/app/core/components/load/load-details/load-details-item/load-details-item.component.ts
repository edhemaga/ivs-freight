import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { UpdateCommentCommand } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from 'src/app/core/services/comments/comments.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { OnDestroy } from '@angular/core';
import { ReviewCommentModal } from '../../../shared/ta-user-review/ta-user-review.component';

@Component({
    selector: 'app-load-details-item',
    templateUrl: './load-details-item.component.html',
    styleUrls: ['./load-details-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoadDetailsItemComponent implements OnInit, OnChanges, OnDestroy {
    @Input() loadData: any;
    public comments: any[] = [];
    private destroy$ = new Subject<void>();
    public totalLegMiles: any;
    public totalLegTime: any;
    public status = null;
    public activePercntage: any;
    constructor(
        private commentsService: CommentsService,
        private notificationService: NotificationService
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.loadData.firstChange && changes.loadData.currentValue) {
            changes.loadData.currentValue[0].data;
            this.getActivePertange(
                changes?.loadData?.currentValue[0]?.data?.pendingPercentage
            );
        }
    }
    ngOnInit(): void {
        // this.getLegMilesLegTime(this.loadData[0].data);
        this.getActivePertange(this.loadData[0]?.data.pendingPercentage);
    }
    public getActivePertange(data: any) {
        this.activePercntage = data;
        if (this.activePercntage > 0 && this.activePercntage < 30) {
            this.status = {
                status: 'short',
                minPercentage: 0,
                maxPercentage: 33,
                colorFilled: '#E57373',
                colorEmpty: '#FFEBEE',
            };
        } else if (this.activePercntage > 30 && this.activePercntage < 60) {
            this.status = {
                status: 'medium',
                minPercentage: 33.1,
                maxPercentage: 66,
                colorFilled: '#FFB74D',
                colorEmpty: '#FFECD1',
            };
        } else if (this.activePercntage > 60 && this.activePercntage <= 100) {
            this.status = {
                status: 'long',
                minPercentage: 66.1,
                maxPercentage: 100,
                colorFilled: '#AAAAAA',
                colorEmpty: '#DADADA',
            };
        } else {
            this.status = null;
        }
    }
    // public getLegMilesLegTime(load: LoadResponse) {
    //   let total = load.stops.map((item) => {
    //     this.totalLegMiles = item.legMiles;
    //     this.totalLegTime = item.legHours + item.legMinutes;
    //     console.log(this.totalLegMiles);
    //     console.log(this.totalLegTime);
    //   });

    //   return total;
    // }

    /**Function retrun id */
    public identity(index: number, item: any): number {
        return item.id;
    }
    changeCommentEvent(comments: ReviewCommentModal) {
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

    private deleteComment(comments: ReviewCommentModal) {
        this.comments = comments.sortData;
        this.commentsService
            .deleteCommentById(comments.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    
                },
                error: () => {
                    
                },
            });
    }

    private updateComment(comments: ReviewCommentModal) {
        this.comments = comments.sortData;

        const comment: UpdateCommentCommand = {
            id: comments.data.id,
            commentContent: comments.data.commentContent,
        };

        this.commentsService
            .updateComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    
                },
                error: () => {
                   
                },
            });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
