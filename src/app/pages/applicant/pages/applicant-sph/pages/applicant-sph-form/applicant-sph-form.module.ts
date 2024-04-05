import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { ApplicantSphFormRoutingModule } from './applicant-sph-form-routing.module';
import { ApplicantModule } from 'src/app/pages/applicant/applicant.module';

// components
import { ApplicantSphFormComponent } from './applicant-sph-form.component';
import { Step1Component } from './components/step1/step1.component';
import { Step2Component } from './components/step2/step2.component';
import { Step3Component } from './components/step3/step3.component';
import { SphStep2FormComponent } from './components/step2/step2-form/step2-form.component';
import { ApplicantSphFormThankYouComponent } from './components/applicant-sph-form-thank-you/applicant-sph-form-thank-you.component';
import { TaCheckboxComponent } from 'src/app/shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from 'src/app/shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputDropdownComponent } from 'src/app/shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputArrowsComponent } from 'src/app/shared/components/ta-input-arrows/ta-input-arrows.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from 'src/app/shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';

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
    ],
})
export class ApplicantSphFormModule {}
