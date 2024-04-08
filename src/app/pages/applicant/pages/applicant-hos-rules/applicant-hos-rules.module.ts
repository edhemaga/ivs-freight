import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicantHosRulesRoutingModule } from './applicant-hos-rules-routing.module';
import { ApplicantModule } from '../../applicant.module';

// components
import { ApplicantHosRulesComponent } from './applicant-hos-rules.component';

import { TaCheckboxComponent } from 'src/app/shared/components/ta-checkbox/ta-checkbox.component';

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
