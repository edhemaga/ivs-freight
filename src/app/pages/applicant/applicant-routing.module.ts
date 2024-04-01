import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { Step1Component } from './pages/applicant-application/components/step1/step1.component';
import { Step2Component } from './pages/applicant-application/components/step2/step2.component';
import { Step3Component } from './pages/applicant-application/components/step3/step3.component';
import { Step4Component } from './pages/applicant-application/components/step4/step4.component';
import { Step5Component } from './pages/applicant-application/components/step5/step5.component';
import { Step6Component } from './pages/applicant-application/components/step6/step6.component';
import { Step7Component } from './pages/applicant-application/components/step7/step7.component';
import { Step8Component } from './pages/applicant-application/components/step8/step8.component';
import { Step9Component } from './pages/applicant-application/components/step9/step9.component';
import { Step10Component } from './pages/applicant-application/components/step10/step10.component';
import { Step11Component } from './pages/applicant-application/components/step11/step11.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantComponent,
        children: [
            {
                path: '1',
                component: Step1Component,
                data: {
                    title: 'Personal Info',
                    depth: 1,
                    routeIdx: 0,
                },
            },
            {
                path: '2',
                component: Step2Component,
                data: {
                    title: 'Work experience',
                    depth: 2,
                    routeIdx: 1,
                },
            },
            {
                path: '3',
                component: Step3Component,
                data: {
                    title: 'CDL Information',
                    depth: 3,
                    routeIdx: 2,
                },
            },
            {
                path: '4',
                component: Step4Component,
                data: {
                    title: 'Accident records',
                    depth: 4,
                    routeIdx: 3,
                },
            },
            {
                path: '5',
                component: Step5Component,
                data: {
                    title: 'Traffic violations',
                    depth: 5,
                    routeIdx: 4,
                },
            },
            {
                path: '6',
                component: Step6Component,
                data: { title: 'Education', depth: 6, routeIdx: 5 },
            },
            {
                path: '7',
                component: Step7Component,
                data: { title: '7 Days HOS', depth: 7, routeIdx: 6 },
            },
            {
                path: '8',
                component: Step8Component,
                data: {
                    title: 'Drug & Alcohol statement',
                    depth: 8,
                    routeIdx: 7,
                },
            },
            {
                path: '9',
                component: Step9Component,
                data: {
                    title: 'Driver rights',
                    depth: 9,
                    routeIdx: 8,
                },
            },
            {
                path: '10',
                component: Step10Component,
                data: {
                    title: 'Disclosure & release',
                    depth: 10,
                    routeIdx: 9,
                },
            },
            {
                path: '11',
                component: Step11Component,
                data: {
                    title: 'Authorization',
                    depth: 11,
                    routeIdx: 10,
                },
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
