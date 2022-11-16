import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantComponent } from './applicant/applicant.component';
import { Step1Component } from './applicant-steps/step1/step1.component';
import { Step2Component } from './applicant-steps/step2/step2.component';
import { Step3Component } from './applicant-steps/step3/step3.component';
import { Step4Component } from './applicant-steps/step4/step4.component';
import { Step5Component } from './applicant-steps/step5/step5.component';
import { Step6Component } from './applicant-steps/step6/step6.component';
import { Step7Component } from './applicant-steps/step7/step7.component';
import { Step8Component } from './applicant-steps/step8/step8.component';
import { Step9Component } from './applicant-steps/step9/step9.component';
import { Step10Component } from './applicant-steps/step10/step10.component';
import { Step11Component } from './applicant-steps/step11/step11.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicantComponent,
    children: [
      {
        path: '1',
        component: Step1Component,
        data: { title: 'Personal Info', depth: 1 },
      },
      {
        path: '2',
        component: Step2Component,
        data: { title: 'Work experience', depth: 2 },
      },
      {
        path: '3',
        component: Step3Component,
        data: { title: 'CDL Information', depth: 3 },
      },
      {
        path: '4',
        component: Step4Component,
        data: { title: 'Accident records', depth: 4 },
      },
      {
        path: '5',
        component: Step5Component,
        data: { title: 'Traffic violations', depth: 5 },
      },
      {
        path: '6',
        component: Step6Component,
        data: { title: 'Education', depth: 6 },
      },
      {
        path: '7',
        component: Step7Component,
        data: { title: '7 Days HOS', depth: 7 },
      },
      {
        path: '8',
        component: Step8Component,
        data: { title: 'Drug & Alcohol statement', depth: 8 },
      },
      {
        path: '9',
        component: Step9Component,
        data: { title: 'Driver rights', depth: 9 },
      },
      {
        path: '10',
        component: Step10Component,
        data: { title: 'Disclosure & release', depth: 10 },
      },
      {
        path: '11',
        component: Step11Component,
        data: { title: 'Authorization', depth: 11 },
      },
      { path: '**', redirectTo: '1', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantRoutingModule {}
