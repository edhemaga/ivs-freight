import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicantMvrAuthorizationRoutingModule } from './applicant-mvr-authorization-routing.module';
import { ApplicantModule } from '../../applicant.module';

// components
import { ApplicantMvrAuthorizationComponent } from './applicant-mvr-authorization.component';

import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaCheckboxComponent } from 'src/app/shared/components/ta-checkbox/ta-checkbox.component';

@NgModule({
    declarations: [ApplicantMvrAuthorizationComponent],
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantMvrAuthorizationRoutingModule,
        ApplicantModule,

        // components
        TaInputComponent,
        TaUploadFilesComponent,
        TaCheckboxComponent,
    ],
})
export class ApplicantMvrAuthorizationModule {}
