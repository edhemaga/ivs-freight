import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ReviewFeedbackService } from '../state/services/review-feedback.service';

@Component({
  selector: 'app-applicant-review-feedback',
  templateUrl: './applicant-review-feedback.component.html',
  styleUrls: ['./applicant-review-feedback.component.scss'],
})
export class ApplicantReviewFeedbackComponent implements OnInit {
  @Input() displayAnnotationButton: boolean;
  @Input() displayAnnotationTextArea: boolean;
  @Input() lineIndex: number;
  @Input() isFeedback: boolean = false;
  @Input() feedbackText: string;
  @Input() cardsLength?: number;
  @Input() cardIndex: number;

  @Output() annotationBtnClickEvent: EventEmitter<{
    lineIndex: number;
  }> = new EventEmitter();

  public annotationForm: FormGroup;

  /*   public approved?: boolean;
  public description: string = '';

  @Input() reviewFeedbackData: any = {};
  @Input() index: number = 0;
  @Input() isApproved: boolean = false;
  @Output() sendReview: EventEmitter<any> = new EventEmitter(); */

  constructor(
    private formBuilder: FormBuilder,
    private reviewFeedbackService: ReviewFeedbackService
  ) {}

  ngOnInit(): void {
    this.createForm();

    /* let isFirstLoad = true;

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
    ); */
  }

  /*  onApprove(isApprove: boolean) {
    this.approved = isApprove;
    this.description = '';

    if (!isApprove) {
      this.reviewFeedbackService.sendBtnAction(false);
    }
  } */

  public createForm(): void {
    this.annotationForm = this.formBuilder.group({
      annotation: [null],
    });
  }

  public handleAnnotationClick(): void {
    this.annotationForm.patchValue({
      annotation: [null],
    });

    this.annotationBtnClickEvent.emit({
      lineIndex: this.lineIndex,
    });
  }
}
