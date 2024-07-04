import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { ApplicantComponent } from '@pages/applicant/pages/applicant/applicant.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantComponent,
        children: [
            {
                path: '1',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step1/step1.component'
                    ).then((m) => m.Step1Component),
                data: {
                    title: 'Personal Info',
                    depth: 1,
                    routeIdx: 0,
                },
            },
            {
                path: '2',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step2/step2.component'
                    ).then((m) => m.Step2Component),
                data: {
                    title: 'Work experience',
                    depth: 2,
                    routeIdx: 1,
                },
            },
            {
                path: '3',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step3/step3.component'
                    ).then((m) => m.Step3Component),
                data: {
                    title: 'CDL Information',
                    depth: 3,
                    routeIdx: 2,
                },
            },
            {
                path: '4',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step4/step4.component'
                    ).then((m) => m.Step4Component),
                data: {
                    title: 'Accident records',
                    depth: 4,
                    routeIdx: 3,
                },
            },
            {
                path: '5',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step5/step5.component'
                    ).then((m) => m.Step5Component),
                data: {
                    title: 'Traffic violations',
                    depth: 5,
                    routeIdx: 4,
                },
            },
            {
                path: '6',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step6/step6.component'
                    ).then((m) => m.Step6Component),
                data: { title: 'Education', depth: 6, routeIdx: 5 },
            },
            {
                path: '7',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step7/step7.component'
                    ).then((m) => m.Step7Component),
                data: { title: '7 Days HOS', depth: 7, routeIdx: 6 },
            },
            {
                path: '8',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step8/step8.component'
                    ).then((m) => m.Step8Component),
                data: {
                    title: 'Drug & Alcohol statement',
                    depth: 8,
                    routeIdx: 7,
                },
            },
            {
                path: '9',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step9/step9.component'
                    ).then((m) => m.Step9Component),
                data: {
                    title: 'Driver rights',
                    depth: 9,
                    routeIdx: 8,
                },
            },
            {
                path: '10',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step10/step10.component'
                    ).then((m) => m.Step10Component),
                data: {
                    title: 'Disclosure & release',
                    depth: 10,
                    routeIdx: 9,
                },
            },
            {
                path: '11',
                loadComponent: () =>
                    import(
                        '@pages/applicant/pages/applicant-application/components/step11/step11.component'
                    ).then((m) => m.Step11Component),
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
