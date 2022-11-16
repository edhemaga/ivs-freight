import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SphFormComponent } from './sph-form.component';
import { Step1Component } from '../../../applicant-tabs/sph/sph-form/sph-form-steps/step1/step1.component';
import { Step2Component } from './sph-form-steps/step2/step2.component';
import { Step3Component } from './sph-form-steps/step3/step3.component';

const routes: Routes = [
   {
      path: '',
      component: SphFormComponent,
      data: { title: 'SPH Form' },
      children: [
         {
            path: '1',
            component: Step1Component,
            data: { title: 'Prospective Employer', depth: 1 },
         },
         {
            path: '2',
            component: Step2Component,
            data: { title: 'Accident History', depth: 2 },
         },
         {
            path: '3',
            component: Step3Component,
            data: { title: 'Drug & Alcohol History', depth: 3 },
         },
         { path: '**', redirectTo: '1', pathMatch: 'full' },
      ],
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class SphFormRoutingModule {}
