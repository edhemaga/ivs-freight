import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PspAuthorizationComponent } from './psp-authorization.component';

import { SharedModule } from '../../../shared/shared.module';
import { PspAuthorizationRoutingModule } from './psp-authorization-routing.module';
import { ApplicantModule } from './../../applicant.module';

@NgModule({
    declarations: [PspAuthorizationComponent],
    imports: [
        CommonModule,
        SharedModule,
        PspAuthorizationRoutingModule,
        ApplicantModule,
    ],
})
export class PspAuthorizationModule {}
