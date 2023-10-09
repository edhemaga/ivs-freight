/* MODULES */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ApplicantRoutingModule } from './applicant-routing.module';

import { SharedModule } from '../shared/shared.module';

import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';

/* PIPES */

import { SumArraysPipe } from '../../pipes/sum-arrays.pipe';

/* COMPONENTS */

import { ApplicantComponent } from './applicant/applicant.component';
import { ApplicantHeaderComponent } from './applicant-header/applicant-header.component';
import { ApplicantFooterComponent } from './applicant-footer/applicant-footer.component';
import { ApplicantSignaturePadComponent } from './applicant-signature-pad/applicant-signature-pad.component';
import { ApplicantWelcomeScreenComponent } from './applicant-welcome-screen/applicant-welcome-screen.component';
import { ApplicantEndScreenComponent } from './applicant-end-screen/applicant-end-screen.component';
import { ApplicantNextBackBtnComponent } from './applicant-next-back-btn/applicant-next-back-btn.component';
import { ApplicantAddSaveBtnComponent } from './applicant-add-save-btn/applicant-add-save-btn.component';
import { ApplicantReviewFeedbackComponent } from './applicant-review-feedback/applicant-review-feedback.component';
import { ApplicantDeleteBtnComponent } from './applicant-delete-btn/applicant-delete-btn.component';

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

/* IMPORT COMPONENTS */

import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TaCheckboxComponent } from '../shared/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from '../shared/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { InputAddressDropdownComponent } from '../shared/input-address-dropdown/input-address-dropdown.component';
import { TaInputComponent } from '../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputArrowsComponent } from '../shared/ta-input-arrows/ta-input-arrows.component';
import { TaUploadFilesComponent } from '../shared/ta-upload-files/ta-upload-files.component';

@NgModule({
    declarations: [
        ApplicantComponent,
        ApplicantHeaderComponent,
        ApplicantFooterComponent,
        ApplicantSignaturePadComponent,
        ApplicantNextBackBtnComponent,
        ApplicantAddSaveBtnComponent,
        ApplicantWelcomeScreenComponent,
        ApplicantEndScreenComponent,
        ApplicantReviewFeedbackComponent,
        ApplicantDeleteBtnComponent,

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
    ],
    imports: [
        /* MODULES */

        ApplicantRoutingModule,
        CommonModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AngularSignaturePadModule,

        /* COMPONENTS */

        AppTooltipComponent,
        InputAddressDropdownComponent,
        TaCheckboxComponent,
        TaInputRadiobuttonsComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaInputArrowsComponent,
        TaUploadFilesComponent,

        /* PIPES */

        SumArraysPipe,
    ],
    exports: [
        ApplicantNextBackBtnComponent,
        ApplicantAddSaveBtnComponent,
        ApplicantHeaderComponent,
        ApplicantFooterComponent,
        ApplicantSignaturePadComponent,
        ApplicantReviewFeedbackComponent,
    ],
})
export class ApplicantModule {}
