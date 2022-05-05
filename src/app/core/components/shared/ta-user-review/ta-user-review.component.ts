import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-ta-user-review',
  templateUrl: './ta-user-review.component.html',
  styleUrls: ['./ta-user-review.component.scss'],
})
export class TaUserReviewComponent implements OnInit {
  @ViewChildren('reviewMessage') reviewMessageRef: QueryList<ElementRef>;
  @Input() reviewData: any[] = [];
  @Output() changedReviewData: EventEmitter<any[]> = new EventEmitter<any[]>();

  public isEditMode: boolean = false;

  constructor() {}

  ngOnInit() {
    this.reviewData.map((item) => ({ ...item, isEditMode: false }));
  }

  public onAction(review: any, type: string, index: number) {
    switch (type) {
      case 'edit': {
        this.reviewData.filter((item) => (item.isEditMode = false));
        review.isEditMode = true;
        this.reviewMessageRef.toArray()[index].nativeElement.value =
          review.comment;

        this.setInputCursorAtTheEnd(
          this.reviewMessageRef.toArray()[index].nativeElement
        );
        break;
      }
      case 'delete': {
        this.reviewData = this.reviewData.filter(
          (item) => item.id !== review.id
        );
        this.changedReviewData.emit(this.reviewData);
        break;
      }
      case 'confirm': {
        review.comment =
          this.reviewMessageRef.toArray()[index].nativeElement.value;
        review.isEditMode = false;
        break;
      }
      case 'cancel': {
        review.isEditMode = false;
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

  public identity(index: number, item: any): number {
    return item.id;
  }
}
