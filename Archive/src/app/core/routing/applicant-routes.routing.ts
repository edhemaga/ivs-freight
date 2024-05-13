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
            loadChildren: () =>
                import(
                    '@pages/applicant/pages/applicant-owner-info/applicant-owner-info.module'
                ).then((m) => m.ApplicantOwnerInfoModule),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 1,
            },
        },
        {
            path: 'medical-certificate/:id',
            loadChildren: () =>
                import(
                    '@pages/applicant/pages/applicant-medical-certificate/applicant-medical-certificate.module'
                ).then((m) => m.ApplicantMedicalCertificateModule),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 2,
            },
        },
        {
            path: 'mvr-authorization/:id',
            loadChildren: () =>
                import(
                    '@pages/applicant/pages/applicant-mvr-authorization/applicant-mvr-authorization.module'
                ).then((m) => m.ApplicantMvrAuthorizationModule),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 3,
            },
        },
        {
            path: 'psp-authorization/:id',
            loadChildren: () =>
                import(
                    '@pages/applicant/pages/applicant-psp-authorization/applicant-psp-authorization.module'
                ).then((m) => m.ApplicantPspAuthorizationModule),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 4,
            },
        },
        {
            path: 'sph/:id',
            loadChildren: () =>
                import(
                    '@pages/applicant/pages/applicant-sph/applicant-sph.module'
                ).then((m) => m.ApplicantSphModule),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 5,
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
            loadChildren: () =>
                import(
                    '@pages/applicant/pages/applicant-hos-rules/applicant-hos-rules.module'
                ).then((m) => m.ApplicantHosRulesModule),
            canActivate: [ApplicantGuard],
            resolve: { applicant: ApplicantResolver },
            data: {
                routeIdx: 6,
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
