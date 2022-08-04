import { ReviewsSortPipe } from './reviews-sort.pipe';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { SignInResponse } from 'appcoretruckassist';

export interface ReviewCommentModal {
  sortData: any[];
  data: any | number;
  action: string;
}

@Component({
  selector: 'app-ta-user-review',
  templateUrl: './ta-user-review.component.html',
  styleUrls: ['./ta-user-review.component.scss'],
  providers: [TitleCasePipe],
})
export class TaUserReviewComponent implements OnChanges {
  @ViewChildren('reviewMessage') reviewMessageRef: QueryList<ElementRef>;
  @Input() reviewData: any[] = [];
  /**
   * isNewReview: true;
   * must be set in object of array reviewData for new review,
   * and pass like input, for focusing first created new review !!!
   */
  @Input() isNewReview: boolean = false;

  @Output() changeReviewsEvent: EventEmitter<ReviewCommentModal> =
    new EventEmitter<ReviewCommentModal>();

  private user: SignInResponse = JSON.parse(localStorage.getItem('user'));

  constructor(
    private reviewSortPipe: ReviewsSortPipe,
    private titlecasePipe: TitleCasePipe
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reviewData?.currentValue != changes.reviewData?.previousValue) {
      this.reviewData.filter((item) => {
        return {
          ...item,
          prohibitEditingOthers:
            item.companyUser.id !== this.user.companyUserId,
        };
      });
    }

    if (this.isNewReview) {
      const timeout = setTimeout(() => {
        this.setInputCursorAtTheEnd(
          this.reviewMessageRef.toArray()[0].nativeElement
        );
        this.reviewData.filter((item) => (item.isEditMode = false));
        this.reviewData[0].isEditMode = true;
        this.reviewMessageRef.toArray()[0].nativeElement.value = null;

        clearTimeout(timeout);
      }, 150);
    }
  }

  public onAction(review: any, type: string, index: number) {
    switch (type) {
      case 'edit': {
        this.reviewData.filter((item) => (item.isEditMode = false));

        review.isEditMode = true;
        this.reviewMessageRef.toArray()[index].nativeElement.value =
          review.commentContent;

        this.setInputCursorAtTheEnd(
          this.reviewMessageRef.toArray()[index].nativeElement
        );
        break;
      }
      case 'delete': {
        this.reviewData = this.reviewData.filter(
          (item) => item.id !== review.id
        );
        this.reviewSortPipe.transform(this.reviewData);

        this.changeReviewsEvent.emit({
          sortData: this.reviewData,
          data: review.id,
          action: type,
        });
        break;
      }
      case 'add': {
        review.commentContent =
          this.reviewMessageRef.toArray()[index].nativeElement.value;
        review.isEditMode = false;
        review.isNewReview = false;
        review.updatedAt = new Date().toISOString();

        this.reviewSortPipe.transform(this.reviewData);
        this.changeReviewsEvent.emit({
          sortData: this.reviewData,
          data: review,
          action: type,
        });
        break;
      }
      case 'update': {
        review.commentContent =
          this.reviewMessageRef.toArray()[index].nativeElement.value;
        review.isEditMode = false;
        review.updatedAt = new Date().toISOString();

        this.reviewSortPipe.transform(this.reviewData);
        this.changeReviewsEvent.emit({
          sortData: this.reviewData,
          data: review,
          action: type,
        });
        break;
      }
      case 'cancel': {
        review.isEditMode = false;

        this.reviewData[0].isNewReview = false;
        break;
      }
      default: {
        break;
      }
    }
  }

  private setInputCursorAtTheEnd(input: any): void {
    const selectionEnd = input.selectionEnd;
    if (input.setSelectionRange) {
      input.setSelectionRange(selectionEnd, selectionEnd);
    }
    const timeout = setTimeout(() => {
      input.focus();
      clearTimeout(timeout);
    }, 150);
  }

  public transformText(event: any, ind: number) {
    this.reviewMessageRef.toArray()[ind].nativeElement.value =
      this.titleCaseInput(event);
  }

  public titleCaseInput(value: string) {
    return this.titlecasePipe.transform(value);
  }

  public identity(index: number, item: any): number {
    return item.id;
  }
}
