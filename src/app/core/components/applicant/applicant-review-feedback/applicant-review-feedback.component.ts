import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ReviewFeedbackService } from '../state/services/review-feedback.service';

@Component({
  selector: 'app-applicant-review-feedback',
  templateUrl: './applicant-review-feedback.component.html',
  styleUrls: ['./applicant-review-feedback.component.scss'],
})
export class ApplicantReviewFeedbackComponent implements OnInit {
  public approved?: boolean;
  public description: string = '';

  @Input() reviewFeedbackData: any = {};
  @Input() index: number = 0;
  @Input() isFeedback: boolean = false;
  @Input() isApproved: boolean = false;
  @Output() sendReview: EventEmitter<any> = new EventEmitter();

  constructor(private reviewFeedbackService: ReviewFeedbackService) {}

  ngOnInit(): void {
    let isFirstLoad = true;

    this.reviewFeedbackService.currentSetAllConfirmed.subscribe(
      (confirmed: boolean) => {
        if (confirmed && !isFirstLoad) {
          this.approved = true;
          this.description = '';
        }

        this.reviewFeedbackData.approved = this.approved;
        this.reviewFeedbackData.description = this.description;

        this.sendReview.emit({
          reviewFeedbackData: this.reviewFeedbackData,
          index: this.index,
          firstLoad: isFirstLoad,
        });

        isFirstLoad = false;
      }
    );
  }

  onApprove(isApprove: boolean) {
    this.approved = isApprove;
    this.description = '';

    if (!isApprove) {
      this.reviewFeedbackService.sendBtnAction(false);
    }
  }
}
