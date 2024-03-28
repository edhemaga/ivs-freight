import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { HosRulesRoutingModule } from './hos-rules-routing.module';
import { ApplicantModule } from '../../applicant.module';

// components
import { HosRulesComponent } from './hos-rules.component';

import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';

@NgModule({
    declarations: [HosRulesComponent],
    imports: [
        /* MODULES */

        CommonModule,
        SharedModule,
        HosRulesRoutingModule,
        ApplicantModule,

        /* COMPONENTS */

        TaCheckboxComponent,
    ],
})
export class HosRulesModule {}
