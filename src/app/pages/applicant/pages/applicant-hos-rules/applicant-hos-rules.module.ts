import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantHosRulesRoutingModule } from '@pages/applicant/pages/applicant-hos-rules/applicant-hos-rules-routing.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { ApplicantHosRulesComponent } from '@pages/applicant/pages/applicant-hos-rules/applicant-hos-rules.component';

import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';

@NgModule({
    declarations: [ApplicantHosRulesComponent],
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantHosRulesRoutingModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
    ],
})
export class ApplicantHosRulesModule {}
