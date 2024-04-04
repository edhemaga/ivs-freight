import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { ApplicantMedicalCertificateRoutingModule } from './applicant-medical-certificate-routing.module';
import { ApplicantModule } from '../../applicant.module';

// components
import { ApplicantMedicalCertificateComponent } from './applicant-medical-certificate.component';

import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';

@NgModule({
    declarations: [ApplicantMedicalCertificateComponent],
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantMedicalCertificateRoutingModule,
        ApplicantModule,

        // components
        TaInputComponent,
        TaUploadFilesComponent,
    ],
})
export class ApplicantMedicalCertificateModule {}
