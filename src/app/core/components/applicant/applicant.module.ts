import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ApplicantRoutingModule } from './applicant-routing.module';

import { ReviewFeedbackService } from './state/services/review-feedback.service';

import { ApplicantComponent } from './applicant/applicant.component';
import { ApplicantHeaderComponent } from './applicant-header/applicant-header.component';
import { ApplicantFooterComponent } from './applicant-footer/applicant-footer.component';
import { ApplicantNextStepComponent } from './applicant-next-step/applicant-next-step.component';
import { ApplicantConfirmAllReviewComponent } from './applicant-confirm-all-review/applicant-confirm-all-review.component';
import { ApplicantReviewFeedbackComponent } from './applicant-review-feedback/applicant-review-feedback.component';
import { ApplicantSignaturePadComponent } from './applicant-signature-pad/applicant-signature-pad.component';
import { ApplicantWelcomeScreenComponent } from './applicant-welcome-screen/applicant-welcome-screen.component';
import { ApplicantNextBackBtnComponent } from './applicant-next-back-btn/applicant-next-back-btn.component';

import { Step1Component } from './applicant-steps/step1/step1.component';
import { Step2Component } from './applicant-steps/step2/step2.component';
import { Step3Component } from './applicant-steps/step3/step3.component';
import { Step4Component } from './applicant-steps/step4/step4.component';
import { Step5Component } from './applicant-steps/step5/step5.component';
import { Step6Component } from './applicant-steps/step6/step6.component';
import { Step7Component } from './applicant-steps/step7/step7.component';
import { Step8Component } from './applicant-steps/step8/step8.component';
import { Step9Component } from './applicant-steps/step9/step9.component';
import { Step10Component } from './applicant-steps/step10/step10.component';
import { Step11Component } from './applicant-steps/step11/step11.component';

import { Step6FormComponent } from './applicant-forms/step6-form/step6-form.component';
import { Step5FormComponent } from './applicant-forms/step5-form/step5-form.component';
import { Step4FormComponent } from './applicant-forms/step4-form/step4-form.component';
import { Step3FormComponent } from './applicant-forms/step3-form/step3-form.component';
import { Step2FormComponent } from './applicant-forms/step2-form/step2-form.component';

import { SharedModule } from '../shared/shared.module';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { ApplicantEndScreenComponent } from './applicant-end-screen/applicant-end-screen.component';
import { ProspectiveEmployerPdfComponent } from './state/pdf-export/sph-form/prospective-employer-pdf/prospective-employer-pdf.component';

@NgModule({
  declarations: [
    ApplicantComponent,
    ApplicantHeaderComponent,
    ApplicantFooterComponent,
    ApplicantNextStepComponent,
    ApplicantConfirmAllReviewComponent,
    ApplicantReviewFeedbackComponent,
    ApplicantSignaturePadComponent,
    ApplicantNextBackBtnComponent,
    ApplicantWelcomeScreenComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
    Step7Component,
    Step8Component,
    Step9Component,
    Step10Component,
    Step11Component,

    Step6FormComponent,
    Step5FormComponent,
    Step4FormComponent,
    Step3FormComponent,
    Step2FormComponent,
    ApplicantEndScreenComponent,
    ProspectiveEmployerPdfComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ApplicantRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,

    SharedModule,
    AngularSignaturePadModule,
  ],
  exports: [
    ApplicantNextBackBtnComponent,
    ApplicantHeaderComponent,
    ApplicantFooterComponent,
    ApplicantSignaturePadComponent,
  ],
  providers: [ReviewFeedbackService],
})
export class ApplicantModule {}
