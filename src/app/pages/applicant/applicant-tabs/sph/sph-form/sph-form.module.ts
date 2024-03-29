import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { SphFormRoutingModule } from './sph-form-routing.module';
import { ApplicantModule } from '.././../../applicant.module';

import { SphFormComponent } from './sph-form.component';
import { Step1Component } from './sph-form-steps/step1/step1.component';
import { Step2Component } from './sph-form-steps/step2/step2.component';
import { Step3Component } from './sph-form-steps/step3/step3.component';
import { SphStep2FormComponent } from './sph-form-steps/step2/step2-form/step2-form.component';
import { SphFormThankYouComponent } from './sph-form-thank-you/sph-form-thank-you.component';
import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from 'src/app/core/components/shared/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputDropdownComponent } from 'src/app/core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputArrowsComponent } from 'src/app/core/components/shared/ta-input-arrows/ta-input-arrows.component';
import { TaInputComponent } from 'src/app/core/components/shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from 'src/app/core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        SphFormComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        SphStep2FormComponent,
        SphFormThankYouComponent,
    ],
    imports: [
        // Modules
        CommonModule,
        SharedModule,
        SphFormRoutingModule,
        ApplicantModule,
        RouterModule,

        // Components
        TaCheckboxComponent,
        TaInputRadiobuttonsComponent,
        TaInputDropdownComponent,
        TaInputArrowsComponent,
        TaInputComponent,
        InputAddressDropdownComponent,
    ],
})
export class SphFormModule {}
