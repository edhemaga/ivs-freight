import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { MedicalCertificateRoutingModule } from './medical-certificate-routing.module';
import { ApplicantModule } from '../../applicant.module';

import { MedicalCertificateComponent } from './medical-certificate.component';

import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';

@NgModule({
    declarations: [MedicalCertificateComponent],
    imports: [
        /* MODULES */

        CommonModule,
        SharedModule,
        MedicalCertificateRoutingModule,
        ApplicantModule,

        /* COMPONENTS */

        TaInputComponent,
        TaUploadFilesComponent,
    ],
})
export class MedicalCertificateModule {}
