import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { MvrAuthorizationRoutingModule } from './mvr-authorization-routing.module';
import { ApplicantModule } from './../../applicant.module';

import { MvrAuthorizationComponent } from './mvr-authorization.component';

import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';
import { TaCheckboxComponent } from '../../../shared/ta-checkbox/ta-checkbox.component';

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
