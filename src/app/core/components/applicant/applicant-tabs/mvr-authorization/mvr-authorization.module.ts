import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MvrAuthorizationComponent } from './mvr-authorization.component';

import { SharedModule } from '../../../shared/shared.module';
import { MvrAuthorizationRoutingModule } from './mvr-authorization-routing.module';
import { ApplicantModule } from './../../applicant.module';

@NgModule({
   declarations: [MvrAuthorizationComponent],
   imports: [
      CommonModule,
      SharedModule,
      MvrAuthorizationRoutingModule,
      ApplicantModule,
   ],
})
export class MvrAuthorizationModule {}
