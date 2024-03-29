import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';

import { ApplicantWelcomeScreenComponent } from './pages/applicant/applicant-welcome-screen/applicant-welcome-screen.component';
import { ApplicantEndScreenComponent } from './pages/applicant/applicant-end-screen/applicant-end-screen.component';
import { SphFormThankYouComponent } from './pages/applicant/applicant-tabs/sph/sph-form/sph-form-thank-you/sph-form-thank-you.component';

import { RegisterUserHelperComponent } from './pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user-helper/register-user-helper.component';
import { RegisterUserHaveAccountHelperComponent } from './pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user-have-account-helper/register-user-have-account-helper.component';
import { VerifyUserHelperComponent } from './pages/website/components/website-sidebar/sidebar-content/register-user-content/verify-user-helper/verify-user-helper.component';
import { RegisterCompanyHelperComponent } from './pages/website/components/website-sidebar/sidebar-content/register-company-content/register-company-helper/register-company-helper.component';
import { ResetPasswordHelperComponent } from './pages/website/components/website-sidebar/sidebar-content/login-content/reset-password-helper/reset-password-helper.component';

import { BrokerResolver } from './pages/customer/resolvers/broker.resolver';
import { ShipperResolver } from './pages/customer/resolvers/shipper.resolver';
import { ShopResolver } from './pages/repair/state/shop-state/shop.resolver';
import { DriverInactiveResolver } from './pages/driver/state/driver-inactive-state/driver-inactive.resolver';
import { DriverActiveResolver } from './pages/driver/state/driver-active-state/driver-active.resolver';
import { TruckActiveResolver } from './pages/truck/state/truck-active-state/truck-active.resolver';
import { TruckInactiveResolver } from './pages/truck/state/truck-inactive-state/truck-inactive.resolver';
import { TrailerActiveResolver } from './pages/trailer/state/trailer-active-state/trailer-active.resolver';
import { TrailerInactiveResolver } from './pages/trailer/state/trailer-inactive-state/trailer-inactive.resolver';
import { OwnerActiveResolver } from './pages/owner/state/owner-active-state/owner-active.resolver';
import { OwnerInactiveResolver } from './pages/owner/state/owner-inactive-state/owner-inactive.resolver';
import { AccountResolver } from './pages/account/state/account-state/account.resolver';
import { RepairTruckResolver } from './pages/repair/state/repair-truck-state/repair-truck.resolver';
import { RepairTrailerResolver } from './pages/repair/state/repair-trailer-state/repair-trailer.resolver';
import { ContactResolver } from './pages/contacts/state/resolvers/contact.resolver';
import { pmTrailerResolver } from './pages/pm-truck-trailer/resolvers/pm-trailer.resolver';
import { pmTruckResolver } from './pages/pm-truck-trailer/resolvers/pm-truck.resolver';
import { TodoResolverService } from './pages/to-do/state/todo-resolver.service';
import { LoadPandingResolver } from './pages/load/state/load-pending-state/load-panding.resolver';
import { LoadClosedResolver } from './pages/load/state/load-closed-state/load-closed.resolver';
import { LoadActiveResolver } from './pages/load/state/load-active-state/load-active.resolver';
import { LoadTemplateResolver } from './pages/load/state/load-template-state/load-template.resolver';
import { RoadsideActiveResolver } from './pages/safety/violation/state/roadside-state/roadside-active/roadside-active.resolver';
import { RoadsideInactiveResolver } from './pages/safety/violation/state/roadside-state/roadside-inactive/roadside-inactive.resolver';
import { AccidentActiveResolver } from './pages/safety/accident/state/accident-state/accident-active/accident-active.resolver';
import { AccidentInactiveResolver } from './pages/safety/accident/state/accident-state/accident-inactive/accident-inactive.resolver';
import { AccidentNonReportedResolver } from './pages/safety/accident/state/accident-state/accident-non-reported/accident-non-reported.resolver';
import { ApplicantResolver } from './pages/applicant/state/resolver/applicant.resolver';
import { FuelResolver } from './pages/fuel/state/fule-state/fuel-state.resolver';
import { ApplicantTableResolver } from './pages/driver/state/applicant-state/applicant-table.resolver';
import { ApplicantSphFormResolver } from './pages/applicant/state/resolver/applicant-sph-form.resolver';
import { MilesResolverService } from './pages/miles/state/miles-resolver.service';
import { DispatcherResolverService } from './pages/dispatch/services/dispatcher-resolver.service';
import { UnderConstructionComponent } from './core/components/under-construction/under-construction.component';
import { ApplicantGuard } from './core/guards/applicant.guard';
import { RoutingResolver } from './pages/routing/state/routing-state/routing-state.resolver';
import { TelematicResolver } from './pages/telematic/state/telematic-state.resolver';
import { DashboardResolver } from './pages/dashboard/resolvers/dashboard.resolver';
import { CompanySettingsGuard } from './core/guards/company-settings.guard';

const routes: Routes = [
    /* WEBSITE */

    {
        path: 'website',
        loadChildren: () =>
            import('./pages/website/website.module').then(
                (m) => m.WebsiteModule
            ),
    },

    // Auth Routes

    {
        path: 'api/account/signupuser',
        component: RegisterUserHelperComponent,
        data: { title: 'Helper Component Route' },
    },
    {
        path: 'api/account/signupuserhaveaccount',
        component: RegisterUserHaveAccountHelperComponent,
        data: { title: 'Helper Component Route' },
    },
    {
        path: 'api/account/verifyuser',
        component: VerifyUserHelperComponent,
        data: { title: 'Helper Component Route' },
    },
    {
        path: 'api/account/verifyowner',
        component: RegisterCompanyHelperComponent,
        data: { title: 'Helper Component Route' },
    },
    {
        path: 'api/account/verifyforgotpassword',
        component: ResetPasswordHelperComponent,
        data: { title: 'Helper Component Route' },
    },

    // Auth Routes

    {
        path: 'dashboard',
        loadChildren: () =>
            import('./pages/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
        resolve: { dashboard: DashboardResolver },
        canActivate: [CompanySettingsGuard, AuthGuard],
    },
    {
        path: 'under-construction',
        component: UnderConstructionComponent,
    },
    {
        path: 'dispatcher',
        loadChildren: () =>
            import('./pages/dispatch/dispatch.module').then(
                (m) => m.DispatchModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: { dispatcher: DispatcherResolverService },
    },
    {
        path: 'company',
        loadChildren: () =>
            import('./pages/settings/settings.module').then(
                (m) => m.SettingsModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'list/load',
        loadChildren: () =>
            import('./pages/load/load.module').then((m) => m.LoadModule),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            loadTemplate: LoadTemplateResolver,
            loadPanding: LoadPandingResolver,
            loadActive: LoadActiveResolver,
            loadClosed: LoadClosedResolver,
        },
    },
    {
        path: 'list/driver',
        loadChildren: () =>
            import('./pages/driver/driver.module').then((m) => m.DriverModule),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            driverActive: DriverActiveResolver,
            driverInactive: DriverInactiveResolver,
            applicantAdminTable: ApplicantTableResolver,
        },
    },
    {
        path: 'list/truck',
        loadChildren: () =>
            import('./pages/truck/truck.module').then((m) => m.TruckModule),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            truckActive: TruckActiveResolver,
            truckInactive: TruckInactiveResolver,
        },
    },
    {
        path: 'list/trailer',
        loadChildren: () =>
            import('./pages/trailer/trailer.module').then(
                (m) => m.TrailerModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            trailerActive: TrailerActiveResolver,
            trailerInactive: TrailerInactiveResolver,
        },
    },
    {
        path: 'list/customer',
        loadChildren: () =>
            import('./pages/customer/customer.module').then(
                (m) => m.CustomerModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: { broker: BrokerResolver, shipper: ShipperResolver },
    },
    {
        path: 'list/repair',
        loadChildren: () =>
            import('./pages/repair/repair.module').then((m) => m.RepairModule),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            repairTruck: RepairTruckResolver,
            repairTrailer: RepairTrailerResolver,
            repairShop: ShopResolver,
        },
    },
    {
        path: 'list/pm',
        loadChildren: () =>
            import('./pages/pm-truck-trailer/pm-truck-trailer.module').then(
                (m) => m.PmTruckTrailerModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            pmTrailer: pmTrailerResolver,
            pmTruck: pmTruckResolver,
        },
    },
    {
        path: 'list/fuel',
        loadChildren: () =>
            import('./pages/fuel/fuel.module').then((m) => m.FuelModule),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            fuel: FuelResolver,
        },
    },
    {
        path: 'list/owner',
        loadChildren: () =>
            import('./pages/owner/owner.module').then((m) => m.OwnerModule),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            ownerActive: OwnerActiveResolver,
            ownerInactive: OwnerInactiveResolver,
        },
    },
    {
        path: 'list/rentor',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: 'Rentor' },
    },
    {
        path: 'list/account',
        loadChildren: () =>
            import('./pages/account/account.module').then(
                (m) => m.AccountModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            account: AccountResolver,
        },
    },
    {
        path: 'list/contact',
        loadChildren: () =>
            import('./pages/contacts/contacts.module').then(
                (m) => m.ContactsModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            contact: ContactResolver,
        },
    },
    {
        path: 'routing',
        loadChildren: () =>
            import('./pages/routing/routing.module').then(
                (m) => m.RoutingModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            routing: RoutingResolver,
        },
    },
    {
        path: 'report',
        component: UnderConstructionComponent,
        data: { title: 'Report' },
    },
    {
        path: 'statistic',
        component: UnderConstructionComponent,
        data: { title: 'Statistic' },
    },
    {
        path: 'chat',
        component: UnderConstructionComponent,
        data: { title: 'Chat' },
    },
    {
        path: 'places',
        component: UnderConstructionComponent,
        data: { title: 'Places' },
    },
    {
        path: 'file-manager',
        component: UnderConstructionComponent,
        data: { title: 'File Manager' },
    },
    {
        path: 'telematic',
        loadChildren: () =>
            import('./pages/telematic/telematic.module').then(
                (m) => m.TelematicModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            routing: TelematicResolver,
        },
    },
    {
        path: 'tools/calendar',
        loadChildren: () =>
            import('./pages/calendar/calendar.module').then(
                (m) => m.CalendarModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
    },
    {
        path: 'tools/miles',
        loadChildren: () =>
            import('./pages/miles/miles.module').then((m) => m.MilesModule),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: { miles: MilesResolverService },
    },
    {
        path: 'tools/1099',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: '1099' },
    },
    {
        path: 'tools/2290',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: '2290' },
    },
    {
        path: 'tools/factoring',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: 'Factoring' },
    },
    {
        path: 'tools/fax',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: 'Fax' },
    },
    {
        path: 'tools/sms',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: 'Sms' },
    },
    {
        path: 'safety/violation',
        loadChildren: () =>
            import('./pages/safety/violation/violation.module').then(
                (m) => m.ViolationModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            roadsideActive: RoadsideActiveResolver,
            roadsideInactive: RoadsideInactiveResolver,
        },
    },
    {
        path: 'safety/accident',
        loadChildren: () =>
            import('./pages/safety/accident/accident.module').then(
                (m) => m.AccidentModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: {
            accidentActive: AccidentActiveResolver,
            accidentInactive: AccidentInactiveResolver,
            accidentNonReported: AccidentNonReportedResolver,
        },
    },
    {
        path: 'safety/log',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: 'Log' },
    },
    {
        path: 'safety/scheduled-insurance',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: 'Scheduled Insurance' },
    },
    {
        path: 'safety/mvr',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: 'Mvr' },
    },
    {
        path: 'safety/test',
        component: UnderConstructionComponent,
        canActivate: [CompanySettingsGuard, AuthGuard],
        data: { title: 'Test' },
    },
    {
        path: 'tools/todo',
        loadChildren: () =>
            import('./pages/to-do/to-do.module').then((m) => m.ToDoModule),
        canActivate: [CompanySettingsGuard, AuthGuard],
        resolve: { todo: TodoResolverService },
    },
    // ------- Applicant Section
    {
        path: 'applicant/welcome',
        component: ApplicantWelcomeScreenComponent,
        data: { title: 'Welcome Screen' },
    },
    {
        path: 'application/:id',
        loadChildren: () =>
            import('./pages/applicant/applicant.module').then(
                (m) => m.ApplicantModule
            ),
        resolve: { applicant: ApplicantResolver },
        data: {
            routeIdx: 0,
        },
    },
    {
        path: 'owner-info/:id',
        loadChildren: () =>
            import(
                './pages/applicant/applicant-tabs/owner-info/owner-info.module'
            ).then((m) => m.OwnerInfoModule),
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
                './pages/applicant/applicant-tabs/medical-certificate/medical-certificate.module'
            ).then((m) => m.MedicalCertificateModule),
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
                './pages/applicant/applicant-tabs/mvr-authorization/mvr-authorization.module'
            ).then((m) => m.MvrAuthorizationModule),
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
                './pages/applicant/applicant-tabs/psp-authorization/psp-authorization.module'
            ).then((m) => m.PspAuthorizationModule),
        canActivate: [ApplicantGuard],
        data: {
            routeIdx: 4,
        },
    },
    {
        path: 'sph/:id',
        loadChildren: () =>
            import('./pages/applicant/applicant-tabs/sph/sph.module').then(
                (m) => m.SphModule
            ),
        canActivate: [ApplicantGuard],
        data: {
            routeIdx: 5,
        },
    },
    {
        path: 'sph-form',
        loadChildren: () =>
            import(
                './pages/applicant/applicant-tabs/sph/sph-form/sph-form.module'
            ).then((m) => m.SphFormModule),
        resolve: { applicantSphForm: ApplicantSphFormResolver },
    },
    {
        path: 'sph-form-end',
        component: SphFormThankYouComponent,
        data: { title: 'End Screen' },
        resolve: { applicantSphForm: ApplicantSphFormResolver },
    },
    {
        path: 'hos-rules/:id',
        loadChildren: () =>
            import(
                './pages/applicant/applicant-tabs/hos-rules/hos-rules.module'
            ).then((m) => m.HosRulesModule),
        canActivate: [ApplicantGuard],
        data: {
            routeIdx: 6,
        },
    },
    {
        path: 'applicant/end',
        component: ApplicantEndScreenComponent,
        data: { title: 'End Screen' },
        canActivate: [ApplicantGuard],
    },
    // ------- Applicant End
    {
        path: 'accounting',
        loadChildren: () =>
            import('./pages/accounting/accounting.module').then(
                (m) => m.AccountingModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
    },
    {
        path: 'accounting',
        loadChildren: () =>
            import('./pages/accounting/accounting.module').then(
                (m) => m.AccountingModule
            ),
        canActivate: [CompanySettingsGuard, AuthGuard],
    },
    {
        path: 'accounting/ifta',
        component: UnderConstructionComponent,
        data: { title: 'Ifta' },
    },
    {
        path: 'accounting/ledger',
        component: UnderConstructionComponent,
        data: { title: 'Ledger' },
    },
    {
        path: 'accounting/tax',
        component: UnderConstructionComponent,
        data: { title: 'Tax' },
    },
    {
        path: 'catalog',
        loadChildren: () =>
            import('./pages/catalog/catalog.module').then(
                (m) => m.CatalogModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'notifications',
        component: UnderConstructionComponent,
        data: { title: 'Notifications' },
    },

    { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
