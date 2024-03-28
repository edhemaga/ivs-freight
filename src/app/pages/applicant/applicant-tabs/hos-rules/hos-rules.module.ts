import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { HosRulesRoutingModule } from './hos-rules-routing.module';
import { ApplicantModule } from '../../applicant.module';

import { HosRulesComponent } from './hos-rules.component';

import { TaCheckboxComponent } from '../../../shared/ta-checkbox/ta-checkbox.component';

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
