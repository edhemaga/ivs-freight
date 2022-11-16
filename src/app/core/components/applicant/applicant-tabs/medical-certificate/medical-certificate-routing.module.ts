import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MedicalCertificateComponent } from './medical-certificate.component';

const routes: Routes = [
   {
      path: '',
      component: MedicalCertificateComponent,
      data: { title: 'Medical Certificate' },
      children: [],
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class MedicalCertificateRoutingModule {}
