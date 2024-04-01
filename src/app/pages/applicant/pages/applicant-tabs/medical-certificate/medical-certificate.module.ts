import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { MedicalCertificateRoutingModule } from './medical-certificate-routing.module';
import { ApplicantModule } from '../../../applicant.module';

// components
import { MedicalCertificateComponent } from './medical-certificate.component';

import { TaInputComponent } from 'src/app/core/components/shared/ta-input/ta-input.component';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';

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
