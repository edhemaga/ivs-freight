import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantSphFormRoutingModule } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/applicant-sph-form-routing.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { ApplicantSphFormComponent } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/applicant-sph-form.component';
import { Step1Component } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/components/step1/step1.component';
import { Step2Component } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/components/step2/step2.component';
import { Step3Component } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/components/step3/step3.component';
import { SphStep2FormComponent } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/components/step2/step2-form/step2-form.component';
import { ApplicantSphFormThankYouComponent } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/components/applicant-sph-form-thank-you/applicant-sph-form-thank-you.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from '@shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputArrowsComponent } from '@shared/components/ta-input-arrows/ta-input-arrows.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { CaInputDatetimePickerComponent } from 'ca-components';

@NgModule({
    declarations: [
        ApplicantSphFormComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        SphStep2FormComponent,
        ApplicantSphFormThankYouComponent,
    ],
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantSphFormRoutingModule,
        ApplicantModule,
        RouterModule,

        // components
        TaCheckboxComponent,
        TaInputRadiobuttonsComponent,
        TaInputDropdownComponent,
        TaInputArrowsComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        CaInputDatetimePickerComponent
    ],
})
export class ApplicantSphFormModule {}
