import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { PspAuthorizationRoutingModule } from './psp-authorization-routing.module';
import { ApplicantModule } from '../../../applicant.module';

// components
import { PspAuthorizationComponent } from './psp-authorization.component';

import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';

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
