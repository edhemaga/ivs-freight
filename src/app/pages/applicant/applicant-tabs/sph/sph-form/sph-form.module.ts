import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';
import { SphFormRoutingModule } from './sph-form-routing.module';
import { ApplicantModule } from '.././../../applicant.module';

import { SphFormComponent } from './sph-form.component';
import { Step1Component } from './sph-form-steps/step1/step1.component';
import { Step2Component } from './sph-form-steps/step2/step2.component';
import { Step3Component } from './sph-form-steps/step3/step3.component';
import { SphStep2FormComponent } from './sph-form-steps/step2/step2-form/step2-form.component';
import { SphFormThankYouComponent } from './sph-form-thank-you/sph-form-thank-you.component';
import { TaCheckboxComponent } from '../../../../shared/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from '../../../../shared/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputDropdownComponent } from '../../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputArrowsComponent } from '../../../../shared/ta-input-arrows/ta-input-arrows.component';
import { TaInputComponent } from '../../../../shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from '../../../../shared/input-address-dropdown/input-address-dropdown.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        SphFormComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        SphStep2FormComponent,
        SphFormThankYouComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SphFormRoutingModule,
        ApplicantModule,
        TaCheckboxComponent,
        TaInputRadiobuttonsComponent,
        TaInputDropdownComponent,
        TaInputArrowsComponent,
        TaInputComponent,
        InputAddressDropdownComponent,
        RouterModule
    ],
})
export class SphFormModule {}
