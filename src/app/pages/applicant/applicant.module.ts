/* MODULES */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// modules
import { ApplicantRoutingModule } from '@pages/applicant/applicant-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';

// pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';

// components
import { ApplicantComponent } from '@pages/applicant/pages/applicant/applicant.component';
import { ApplicantHeaderComponent } from '@pages/applicant/components/applicant-header/applicant-header.component';
import { ApplicantFooterComponent } from '@pages/applicant/components/applicant-footer/applicant-footer.component';
import { ApplicantSignaturePadComponent } from '@pages/applicant/components/applicant-signature-pad/applicant-signature-pad.component';
import { ApplicantWelcomeScreenComponent } from '@pages/applicant/pages/applicant/components/applicant-welcome-screen/applicant-welcome-screen.component';
import { ApplicantEndScreenComponent } from '@pages/applicant/pages/applicant/components/applicant-end-screen/applicant-end-screen.component';
import { ApplicantReviewFeedbackComponent } from '@pages/applicant/components/applicant-review-feedback/applicant-review-feedback.component';

import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from '@shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputArrowsComponent } from '@shared/components/ta-input-arrows/ta-input-arrows.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { CaInputDatetimePickerComponent } from 'ca-components';

@NgModule({ declarations: [
        ApplicantComponent,
        ApplicantHeaderComponent,
        ApplicantFooterComponent,
        ApplicantSignaturePadComponent,
        ApplicantWelcomeScreenComponent,
        ApplicantEndScreenComponent,
        ApplicantReviewFeedbackComponent,
    ],
    exports: [
        ApplicantHeaderComponent,
        ApplicantFooterComponent,
        ApplicantSignaturePadComponent,
        ApplicantReviewFeedbackComponent,
    ], imports: [
        /* MODULES */
        ApplicantRoutingModule,
        CommonModule,
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
        TaCounterComponent,
        TaCustomCardComponent,
        TaModalTableComponent,
        CaInputDatetimePickerComponent,
        CaInputDatetimePickerComponent,
        /* PIPES */
        SumArraysPipe], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ApplicantModule {}
