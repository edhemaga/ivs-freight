import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantMedicalCertificateRoutingModule } from '@pages/applicant/pages/applicant-medical-certificate/applicant-medical-certificate-routing.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { ApplicantMedicalCertificateComponent } from '@pages/applicant/pages/applicant-medical-certificate/applicant-medical-certificate.component';

import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

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
