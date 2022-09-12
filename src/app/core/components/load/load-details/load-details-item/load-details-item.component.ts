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
} from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from 'src/app/core/services/comments/comments.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-load-details-item',
  templateUrl: './load-details-item.component.html',
  styleUrls: ['./load-details-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoadDetailsItemComponent implements OnInit, OnChanges {
  @Input() loadData: any;
  public comments: any[] = [];
  private destroy$ = new Subject<void>();
  public newComment: boolean = false;
  public companyUser: SignInResponse = null;
  public loadItemLenght: number = 0;
  constructor(
    private commentsService: CommentsService,
    private notificationService: NotificationService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.loadData.firstChange && changes.loadData.currentValue) {
      this.loadData = changes.loadData.currentValue;
    }
  }
  ngOnInit(): void {}
  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  public getStopItems(loadData: LoadResponse) {
    let coutn = loadData?.stops.map((item) => item.items.length);
    let total = coutn.length;
    return total;
  }
  changeReviewsEvent(event) {
    if (event.action == 'delete') {
      this.commentsService.deleteCommentById(event.data).subscribe({
        next: () => {
          this.notificationService.success(
            'Comment successfully deleted',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            `Comment with id: ${event.data} couldn't be deleted`,
            'Error:'
          );
        },
      });
    } else if (event.action == 'update') {
      this.commentsService
        .updateComment({
          id: event.data.id,
          commentContent: event.data.commentContent,
        })
        .subscribe({
          next: () => {
            this.notificationService.success(
              'Comment successfully updated',
              'Success:'
            );
          },
          error: () => {
            this.notificationService.error(
              `Comment with id: ${event.data} couldn't be updated`,
              'Error:'
            );
          },
        });
    }
  }
}
