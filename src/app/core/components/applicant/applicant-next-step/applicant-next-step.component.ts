import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ReviewFeedbackService } from '../state/services/review-feedback.service';

@Component({
  selector: 'app-applicant-next-step',
  templateUrl: './applicant-next-step.component.html',
  styleUrls: ['./applicant-next-step.component.scss'],
})
export class ApplicantNextStepComponent implements OnInit {
  /* Applicant */
  @Input() hideBackStep: boolean = false;
  @Input() isReview: boolean = false;
  @Input() showNextStep: boolean = false;
  @Output() stepEvent: EventEmitter<any> = new EventEmitter();

  /* Others */
  @Input() notApplicant: boolean = false;
  @Input() otherData: any;
  @Output() othersEvent: EventEmitter<any> = new EventEmitter();

  public canConfirmAll: boolean = false;

  constructor(private reviewFeedbackService: ReviewFeedbackService) {}

  ngOnInit(): void {
    this.reviewFeedbackService.currentBtnAction.subscribe((can: boolean) => {
      this.canConfirmAll = can;
    });
  }

  /* Applicant */
  onBackStep() {
    this.stepEvent.emit({ action: 'back-step' });
  }

  onNextStep() {
    this.stepEvent.emit({ action: 'next-step' });
  }

  /* Others */
  onOther() {
    this.othersEvent.emit({ component: this.otherData.component });
  }

  onSubmitReview() {
    this.reviewFeedbackService.setAllAsConfirmed(this.canConfirmAll);
  }
}
