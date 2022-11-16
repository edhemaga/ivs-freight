import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HosRulesComponent } from './hos-rules.component';

import { SharedModule } from '../../../shared/shared.module';
import { HosRulesRoutingModule } from './hos-rules-routing.module';
import { ApplicantModule } from '../../applicant.module';

@NgModule({
   declarations: [HosRulesComponent],
   imports: [
      CommonModule,
      SharedModule,
      HosRulesRoutingModule,
      ApplicantModule,
   ],
})
export class HosRulesModule {}
