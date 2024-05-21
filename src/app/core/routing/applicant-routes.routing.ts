import { ApplicantWelcomeScreenComponent } from '@pages/applicant/pages/applicant/components/applicant-welcome-screen/applicant-welcome-screen.component';
import { ApplicantSphFormThankYouComponent } from '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/components/applicant-sph-form-thank-you/applicant-sph-form-thank-you.component';
import { ApplicantEndScreenComponent } from '@pages/applicant/pages/applicant/components/applicant-end-screen/applicant-end-screen.component';

// guards
import { ApplicantGuard } from '@core/guards/applicant.guard';

// resolvers
import { ApplicantResolver } from '@pages/applicant/resolvers/applicant.resolver';
import { ApplicantSphFormResolver } from '@pages/applicant/pages/applicant-sph/resolvers/applicant-sph-form.resolver';

export class ApplicantRoutes {
    static routes = [
        {
            path: 'applicant/welcome',
            component: ApplicantWelcomeScreenComponent,
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: { title: 'Welcome Screen' },
        },
        {
            path: 'application/:id',
            loadChildren: () =>
                import('@pages/applicant/applicant.module').then(
                    (m) => m.ApplicantModule
                ),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 0,
            },
        },
        {
            path: 'owner-info/:id',
            loadComponent: () =>
                import(
                    '@pages/applicant/pages/applicant-owner-info/applicant-owner-info.component'
                ).then((m) => m.ApplicantOwnerInfoComponent),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 1,
                title: 'Owner Info',
            },
        },
        {
            path: 'medical-certificate/:id',
            loadComponent: () =>
                import(
                    '@pages/applicant/pages/applicant-medical-certificate/applicant-medical-certificate.component'
                ).then((m) => m.ApplicantMedicalCertificateComponent),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 2,
                title: 'Medical Certificate',
            },
        },
        {
            path: 'mvr-authorization/:id',
            loadComponent: () =>
                import(
                    '@pages/applicant/pages/applicant-mvr-authorization/applicant-mvr-authorization.component'
                ).then((m) => m.ApplicantMvrAuthorizationComponent),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 3,
                title: 'MVR Authorization',
            },
        },
        {
            path: 'psp-authorization/:id',
            loadComponent: () =>
                import(
                    '@pages/applicant/pages/applicant-psp-authorization/applicant-psp-authorization.component'
                ).then((m) => m.ApplicantPspAuthorizationComponent),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 4,
                title: 'PSP Authorization',
            },
        },
        {
            path: 'sph/:id',
            loadComponent: () =>
                import(
                    '@pages/applicant/pages/applicant-sph/applicant-sph.component'
                ).then((m) => m.ApplicantSphComponent),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 5,
                title: 'SPH'
            },
        },
        {
            path: 'sph-form',
            loadChildren: () =>
                import(
                    '@pages/applicant/pages/applicant-sph/pages/applicant-sph-form/applicant-sph-form.module'
                ).then((m) => m.ApplicantSphFormModule),
            resolve: { applicantSphForm: ApplicantSphFormResolver },
        },
        {
            path: 'sph-form-end',
            component: ApplicantSphFormThankYouComponent,
            data: { title: 'End Screen' },
            resolve: { applicantSphForm: ApplicantSphFormResolver },
        },
        {
            path: 'hos-rules/:id',
            loadComponent: () =>
                import(
                    '@pages/applicant/pages/applicant-hos-rules/applicant-hos-rules.component'
                ).then((m) => m.ApplicantHosRulesComponent),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 6,
                title: 'HOS Rules',
            },
        },
        {
            path: 'applicant/end',
            component: ApplicantEndScreenComponent,
            data: { title: 'End Screen' },
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
        },
    ];
}
