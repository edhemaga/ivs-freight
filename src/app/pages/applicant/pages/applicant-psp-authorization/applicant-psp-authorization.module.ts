import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantPspAuthorizationRoutingModule } from '@pages/applicant/pages/applicant-psp-authorization/applicant-psp-authorization-routing.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { ApplicantPspAuthorizationComponent } from '@pages/applicant/pages/applicant-psp-authorization/applicant-psp-authorization.component';

import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';

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
