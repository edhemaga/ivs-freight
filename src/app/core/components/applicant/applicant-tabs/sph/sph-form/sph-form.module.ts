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

@NgModule({
   declarations: [
      SphFormComponent,
      Step1Component,
      Step2Component,
      Step3Component,
      SphStep2FormComponent,
      SphFormThankYouComponent,
   ],
   imports: [CommonModule, SharedModule, SphFormRoutingModule, ApplicantModule],
})
export class SphFormModule {}
