import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantSphFormComponent } from './applicant-sph-form.component';
import { Step1Component } from './components/step1/step1.component';
import { Step2Component } from './components/step2/step2.component';
import { Step3Component } from './components/step3/step3.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantSphFormComponent,
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
export class ApplicantSphFormRoutingModule {}
