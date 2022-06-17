import { Component, OnInit } from '@angular/core';

import { ReviewFeedbackService } from '../state/services/review-feedback.service';

@Component({
  selector: 'app-applicant-confirm-all-review',
  templateUrl: './applicant-confirm-all-review.component.html',
  styleUrls: ['./applicant-confirm-all-review.component.scss'],
})
export class ApplicantConfirmAllReviewComponent implements OnInit {
  constructor(private reviewFeedbackService: ReviewFeedbackService) {}

  ngOnInit(): void {}

  onConfirmAll() {
    this.reviewFeedbackService.setAllAsConfirmed(true);
  }
}
