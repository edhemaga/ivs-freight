/* MODULES */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// modules
import { ApplicantRoutingModule } from './applicant-routing.module';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';

// pipes
import { SumArraysPipe } from 'src/app/shared/pipes/sum-arrays.pipe';

// components
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { ApplicantHeaderComponent } from './components/applicant-header/applicant-header.component';
import { ApplicantFooterComponent } from './components/applicant-footer/applicant-footer.component';
import { ApplicantSignaturePadComponent } from './components/applicant-signature-pad/applicant-signature-pad.component';
import { ApplicantWelcomeScreenComponent } from './pages/applicant/components/applicant-welcome-screen/applicant-welcome-screen.component';
import { ApplicantEndScreenComponent } from './pages/applicant/components/applicant-end-screen/applicant-end-screen.component';
import { ApplicantNextBackBtnComponent } from './components/applicant-next-back-btn/applicant-next-back-btn.component';
import { ApplicantAddSaveBtnComponent } from './components/applicant-buttons/applicant-add-save-btn/applicant-add-save-btn.component';
import { ApplicantReviewFeedbackComponent } from './components/applicant-review-feedback/applicant-review-feedback.component';
import { ApplicantDeleteBtnComponent } from './components/applicant-buttons/applicant-delete-btn/applicant-delete-btn.component';

import { Step1Component } from './pages/applicant-application/components/step1/step1.component';
import { Step2Component } from './pages/applicant-application/components/step2/step2.component';
import { Step3Component } from './pages/applicant-application/components/step3/step3.component';
import { Step4Component } from './pages/applicant-application/components/step4/step4.component';
import { Step5Component } from './pages/applicant-application/components/step5/step5.component';
import { Step6Component } from './pages/applicant-application/components/step6/step6.component';
import { Step7Component } from './pages/applicant-application/components/step7/step7.component';
import { Step8Component } from './pages/applicant-application/components/step8/step8.component';
import { Step9Component } from './pages/applicant-application/components/step9/step9.component';
import { Step10Component } from './pages/applicant-application/components/step10/step10.component';
import { Step11Component } from './pages/applicant-application/components/step11/step11.component';

import { Step6FormComponent } from './components/applicant-forms/step6-form/step6-form.component';
import { Step5FormComponent } from './components/applicant-forms/step5-form/step5-form.component';
import { Step4FormComponent } from './components/applicant-forms/step4-form/step4-form.component';
import { Step3FormComponent } from './components/applicant-forms/step3-form/step3-form.component';
import { Step2FormComponent } from './components/applicant-forms/step2-form/step2-form.component';

import { TaAppTooltipV2Component } from 'src/app/shared/components/app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCheckboxComponent } from 'src/app/shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from 'src/app/shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputAddressDropdownComponent } from 'src/app/shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from 'src/app/shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputArrowsComponent } from 'src/app/shared/components/ta-input-arrows/ta-input-arrows.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';

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

        TaAppTooltipV2Component,
        TaInputAddressDropdownComponent,
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
