import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { MvrAuthorizationRoutingModule } from './mvr-authorization-routing.module';
import { ApplicantModule } from './../../applicant.module';

// components
import { MvrAuthorizationComponent } from './mvr-authorization.component';

import { TaInputComponent } from 'src/app/core/components/shared/ta-input/ta-input.component';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';

@NgModule({
    declarations: [MvrAuthorizationComponent],
    imports: [
        /* MODULES */

        CommonModule,
        SharedModule,
        MvrAuthorizationRoutingModule,
        ApplicantModule,

        /* COMPONENTS */

        TaInputComponent,
        TaUploadFilesComponent,
        TaCheckboxComponent,
    ],
})
export class MvrAuthorizationModule {}
