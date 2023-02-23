import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { PspAuthorizationRoutingModule } from './psp-authorization-routing.module';
import { ApplicantModule } from './../../applicant.module';

import { PspAuthorizationComponent } from './psp-authorization.component';

import { TaCheckboxComponent } from '../../../shared/ta-checkbox/ta-checkbox.component';

@NgModule({
    declarations: [PspAuthorizationComponent],
    imports: [
        /* MODULES */

        CommonModule,
        SharedModule,
        PspAuthorizationRoutingModule,
        ApplicantModule,

        /* COMPONENTS */

        TaCheckboxComponent,
    ],
})
export class PspAuthorizationModule {}
