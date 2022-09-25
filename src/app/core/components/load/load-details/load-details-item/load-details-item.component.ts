import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  LoadResponse,
  LoadStopResponse,
  SignInResponse,
  UpdateCommentCommand,
} from 'appcoretruckassist';
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
  constructor(
    private commentsService: CommentsService,
    private notificationService: NotificationService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.loadData.firstChange && changes.loadData.currentValue) {
      changes.loadData.currentValue[0].data;
      // this.getLegMilesLegTime(changes?.loadData?.currentValue[0]?.data);
    }
  }
  ngOnInit(): void {
    // this.getLegMilesLegTime(this.loadData[0].data);
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
          this.notificationService.success(
            'Comment successfully deleted.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            "Comment cant't be deleted.",
            'Error:'
          );
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
          this.notificationService.success(
            'Comment successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            "Comment cant't be updated.",
            'Error:'
          );
        },
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
