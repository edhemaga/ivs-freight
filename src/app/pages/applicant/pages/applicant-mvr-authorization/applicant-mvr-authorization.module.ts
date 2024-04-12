import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantMvrAuthorizationRoutingModule } from './applicant-mvr-authorization-routing.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { ApplicantMvrAuthorizationComponent } from './applicant-mvr-authorization.component';

import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';

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
