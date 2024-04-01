import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantMedicalCertificateComponent } from './applicant-medical-certificate.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantMedicalCertificateComponent,
        data: { title: 'Medical Certificate' },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplicantMedicalCertificateRoutingModule {}
