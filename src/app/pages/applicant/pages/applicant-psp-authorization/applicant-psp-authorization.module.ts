import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { ApplicantPspAuthorizationRoutingModule } from './applicant-psp-authorization-routing.module';
import { ApplicantModule } from '../../applicant.module';

// components
import { ApplicantPspAuthorizationComponent } from './applicant-psp-authorization.component';

import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';

@NgModule({
    declarations: [ApplicantPspAuthorizationComponent],
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantPspAuthorizationRoutingModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
    ],
})
export class ApplicantPspAuthorizationModule {}
