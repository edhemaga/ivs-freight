import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalCertificateComponent } from './medical-certificate.component';

import { SharedModule } from '../../../shared/shared.module';
import { MedicalCertificateRoutingModule } from './medical-certificate-routing.module';
import { ApplicantModule } from '../../applicant.module';

@NgModule({
    declarations: [MedicalCertificateComponent],
    imports: [
        CommonModule,
        SharedModule,
        MedicalCertificateRoutingModule,
        ApplicantModule,
    ],
})
export class MedicalCertificateModule {}
