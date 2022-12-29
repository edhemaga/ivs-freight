import { DashboardResolverService } from './core/components/dashboard/state/dashboard-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';
import { SvgDefinitionsComponent } from './svg-definitions/svg-definitions.component';

import { ApplicantWelcomeScreenComponent } from './core/components/applicant/applicant-welcome-screen/applicant-welcome-screen.component';
import { ApplicantEndScreenComponent } from './core/components/applicant/applicant-end-screen/applicant-end-screen.component';
import { DriverActiveResolver } from './core/components/driver/state/driver-active-state/driver-active.resolver';
import { HelperSignupUserComponent } from './core/components/authentication/helper-signup-user/helper-signup-user.component';
import { HelperComponent } from './core/components/authentication/helper/helper.component';
import { HelperForgotPasswordComponent } from './core/components/authentication/helper-forgot-password/helper-forgot-password.component';
import { BrokerResolver } from './core/components/customer/state/broker-state/broker.resolver';
import { ShipperResolver } from './core/components/customer/state/shipper-state/shipper.resolver';
import { ShopResolver } from './core/components/repair/state/shop-state/shop.resolver';
import { DriverInactiveResolver } from './core/components/driver/state/driver-inactive-state/driver-inactive.resolver';
import { SphFormThankYouComponent } from './core/components/applicant/applicant-tabs/sph/sph-form/sph-form-thank-you/sph-form-thank-you.component';

import { TruckActiveResolver } from './core/components/truck/state/truck-active-state/truck-active.resolver';
import { TruckInactiveResolver } from './core/components/truck/state/truck-inactive-state/truck-inactive.resolver';
import { TrailerActiveResolver } from './core/components/trailer/state/trailer-active-state/trailer-active.resolver';
import { TrailerInactiveResolver } from './core/components/trailer/state/trailer-inactive-state/trailer-inactive.resolver';
import { OwnerActiveResolver } from './core/components/owner/state/owner-active-state/owner-active.resolver';
import { OwnerInactiveResolver } from './core/components/owner/state/owner-inactive-state/owner-inactive.resolver';
import { AccountResolver } from './core/components/account/state/account-state/account.resolver';
import { RepairTruckResolver } from './core/components/repair/state/repair-truck-state/repair-truck.resolver';
import { RepairTrailerResolver } from './core/components/repair/state/repair-trailer-state/repair-trailer.resolver';
import { ContactResolver } from './core/components/contacts/state/contact-state/contact.resolver';
import { pmTrailerResolver } from './core/components/pm-truck-trailer/state/pm-trailer-state/pm-trailer.resolver';
import { pmTruckResolver } from './core/components/pm-truck-trailer/state/pm-truck-state/pm-truck.resolver';
import { TodoResolverService } from './core/components/to-do/state/todo-resolver.service';
import { LoadPandingResolver } from './core/components/load/state/load-pending-state/load-panding.resolver';
import { LoadClosedResolver } from './core/components/load/state/load-closed-state/load-closed.resolver';
import { LoadActiveResolver } from './core/components/load/state/load-active-state/load-active.resolver';
import { LoadTemplateResolver } from './core/components/load/state/load-template-state/load-template.resolver';
import { UserResolver } from './core/components/user/state/user-state/user.resolver';
import { RoadsideActiveResolver } from './core/components/safety/violation/state/roadside-state/roadside-active/roadside-active.resolver';
import { RoadsideInactiveResolver } from './core/components/safety/violation/state/roadside-state/roadside-inactive/roadside-inactive.resolver';
import { AccidentActiveResolver } from './core/components/safety/accident/state/accident-state/accident-active/accident-active.resolver';
import { AccidentInactiveResolver } from './core/components/safety/accident/state/accident-state/accident-inactive/accident-inactive.resolver';
import { AccidentNonReportedResolver } from './core/components/safety/accident/state/accident-state/accident-non-reported/accident-non-reported.resolver';
import { ApplicantResolver } from './core/components/applicant/state/resolver/applicant.resolver';
import { FuelResolver } from './core/components/fuel/state/fule-state/fuel-state.resolver';
import { ApplicantTableResolver } from './core/components/driver/state/applicant-state/applicant-table.resolver';
import { ApplicantSphFormResolver } from './core/components/applicant/state/resolver/applicant-sph-form.resolver';
import { MilesResolverService } from './core/components/miles/state/miles-resolver.service';
import { DispatcherResolverService } from './core/components/dispatch/state/dispatcher-resolver.service';
import { HideContentGuard } from './core/guards/hideContent.guard';
import { ApplicantGuard } from './core/guards/applicant.guard';

const routes: Routes = [
    // Auth Routes
    {
        path: 'auth',
        loadChildren: () =>
            import('./core/components/authentication/auth.module').then(
                (m) => m.AuthModule
            ),
        canActivate: [HideContentGuard],
    },
    {
        path: 'api/account/signupuser',
        component: HelperSignupUserComponent,
        data: { title: 'Helper Component Route' },
        canActivate: [HideContentGuard],
    },
    {
        path: 'api/account/verifyowner',
        component: HelperComponent,
        data: { title: 'Helper Component Route' },
        canActivate: [HideContentGuard],
    },
    {
        path: 'api/account/verifyforgotpassword',
        component: HelperForgotPasswordComponent,
        data: { title: 'Helper Component Route' },
        canActivate: [HideContentGuard],
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./core/components/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
        canActivate: [AuthGuard],
        resolve: { dashboard: DashboardResolverService },
    },
    {
        path: 'ads',
        loadChildren: () =>
            import('./core/components/dispatcher/dispatcher.module').then(
                (m) => m.DispatcherModule
            ),
        canActivate: [AuthGuard],
        resolve: { dispatcher: DispatcherResolverService },
    },
    {
        path: 'dispatcher',
        loadChildren: () =>
            import('./core/components/dispatch/dispatch.module').then(
                (m) => m.DispatchModule
            ),
        canActivate: [AuthGuard],
        resolve: { dispatcher: DispatcherResolverService },
    },
    {
        path: 'settings',
        loadChildren: () =>
            import('./core/components/settings/settings.module').then(
                (m) => m.SettingsModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'user',
        loadChildren: () =>
            import('./core/components/user/user.module').then(
                (m) => m.UserModule
            ),
        data: { title: 'User' },
        canActivate: [AuthGuard],
        resolve: {
            user: UserResolver,
        },
    },
    {
        path: 'load',
        loadChildren: () =>
            import('./core/components/load/load.module').then(
                (m) => m.LoadModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            loadTemplate: LoadTemplateResolver,
            loadPanding: LoadPandingResolver,
            loadActive: LoadActiveResolver,
            loadClosed: LoadClosedResolver,
        },
    },
    {
        path: 'driver',
        loadChildren: () =>
            import('./core/components/driver/driver.module').then(
                (m) => m.DriverModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            driverActive: DriverActiveResolver,
            driverInactive: DriverInactiveResolver,
            applicantAdminTable: ApplicantTableResolver,
        },
    },
    {
        path: 'truck',
        loadChildren: () =>
            import('./core/components/truck/truck.module').then(
                (m) => m.TruckModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            truckActive: TruckActiveResolver,
            truckInactive: TruckInactiveResolver,
        },
    },
    {
        path: 'trailer',
        loadChildren: () =>
            import('./core/components/trailer/trailer.module').then(
                (m) => m.TrailerModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            trailerActive: TrailerActiveResolver,
            trailerInactive: TrailerInactiveResolver,
        },
    },
    {
        path: 'customer',
        loadChildren: () =>
            import('./core/components/customer/customer.module').then(
                (m) => m.CustomerModule
            ),
        canActivate: [AuthGuard],
        resolve: { broker: BrokerResolver, shipper: ShipperResolver },
    },
    {
        path: 'repair',
        loadChildren: () =>
            import('./core/components/repair/repair.module').then(
                (m) => m.RepairModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            repairTruck: RepairTruckResolver,
            repairTrailer: RepairTrailerResolver,
            repairShop: ShopResolver,
        },
    },
    {
        path: 'pm',
        loadChildren: () =>
            import(
                './core/components/pm-truck-trailer/pm-truck-trailer.module'
            ).then((m) => m.PmTruckTrailerModule),
        canActivate: [AuthGuard],
        resolve: {
            pmTrailer: pmTrailerResolver,
            pmTruck: pmTruckResolver,
        },
    },
    {
        path: 'fuel',
        loadChildren: () =>
            import('./core/components/fuel/fuel.module').then(
                (m) => m.FuelModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            fuel: FuelResolver,
        },
    },
    {
        path: 'owner',
        loadChildren: () =>
            import('./core/components/owner/owner.module').then(
                (m) => m.OwnerModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            ownerActive: OwnerActiveResolver,
            ownerInactive: OwnerInactiveResolver,
        },
    },
    {
        path: 'account',
        loadChildren: () =>
            import('./core/components/account/account.module').then(
                (m) => m.AccountModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            account: AccountResolver,
        },
    },
    {
        path: 'contact',
        loadChildren: () =>
            import('./core/components/contacts/contacts.module').then(
                (m) => m.ContactsModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            contact: ContactResolver,
        },
    },
    {
        path: 'routing',
        loadChildren: () =>
            import('./core/components/routing/routing.module').then(
                (m) => m.RoutingModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'tools/calendar',
        loadChildren: () =>
            import('./core/components/calendar/calendar.module').then(
                (m) => m.CalendarModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'tools/miles',
        loadChildren: () =>
            import('./core/components/miles/miles.module').then(
                (m) => m.MilesModule
            ),
        canActivate: [AuthGuard],
        resolve: { miles: MilesResolverService },
    },
    {
        path: 'safety/violation',
        loadChildren: () =>
            import('./core/components/safety/violation/violation.module').then(
                (m) => m.ViolationModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            roadsideActive: RoadsideActiveResolver,
            roadsideInactive: RoadsideInactiveResolver,
        },
    },
    {
        path: 'safety/accident',
        loadChildren: () =>
            import('./core/components/safety/accident/accident.module').then(
                (m) => m.AccidentModule
            ),
        canActivate: [AuthGuard],
        resolve: {
            accidentActive: AccidentActiveResolver,
            accidentInactive: AccidentInactiveResolver,
            accidentNonReported: AccidentNonReportedResolver,
        },
    },
    {
        path: 'tools/todo',
        loadChildren: () =>
            import('./core/components/to-do/to-do.module').then(
                (m) => m.ToDoModule
            ),
        canActivate: [AuthGuard],
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
            import('./core/components/applicant/applicant.module').then(
                (m) => m.ApplicantModule
            ),
        resolve: { applicant: ApplicantResolver },
    },
    {
        path: 'medical-certificate/:id',
        loadChildren: () =>
            import(
                './core/components/applicant/applicant-tabs/medical-certificate/medical-certificate.module'
            ).then((m) => m.MedicalCertificateModule),
        canActivate: [ApplicantGuard],
    },
    {
        path: 'mvr-authorization/:id',
        loadChildren: () =>
            import(
                './core/components/applicant/applicant-tabs/mvr-authorization/mvr-authorization.module'
            ).then((m) => m.MvrAuthorizationModule),
        canActivate: [ApplicantGuard],
    },
    {
        path: 'psp-authorization/:id',
        loadChildren: () =>
            import(
                './core/components/applicant/applicant-tabs/psp-authorization/psp-authorization.module'
            ).then((m) => m.PspAuthorizationModule),
        canActivate: [ApplicantGuard],
    },
    {
        path: 'sph/:id',
        loadChildren: () =>
            import(
                './core/components/applicant/applicant-tabs/sph/sph.module'
            ).then((m) => m.SphModule),
        canActivate: [ApplicantGuard],
    },
    {
        path: 'sph-form',
        loadChildren: () =>
            import(
                './core/components/applicant/applicant-tabs/sph/sph-form/sph-form.module'
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
                './core/components/applicant/applicant-tabs/hos-rules/hos-rules.module'
            ).then((m) => m.HosRulesModule),
        canActivate: [ApplicantGuard],
    },
    {
        path: 'ssn-card/:id',
        loadChildren: () =>
            import(
                './core/components/applicant/applicant-tabs/ssn-card/ssn-card.module'
            ).then((m) => m.SsnCardModule),
        canActivate: [ApplicantGuard],
    },
    {
        path: 'cdl-card/:id',
        loadChildren: () =>
            import(
                './core/components/applicant/applicant-tabs/cdl-card/cdl-card.module'
            ).then((m) => m.CdlCardModule),
        canActivate: [ApplicantGuard],
    },
    {
        path: 'applicant/end',
        component: ApplicantEndScreenComponent,
        data: { title: 'End Screen' },
        canActivate: [ApplicantGuard],
    },
    // ------- Applicant End
    {
        path: 'owner-info/:id',
        loadChildren: () =>
            import(
                './core/components/applicant/applicant-tabs/owner-info/owner-info.module'
            ).then((m) => m.OwnerInfoModule),
        canActivate: [AuthGuard],
        resolve: { applicant: ApplicantResolver },
    },
    {
        path: 'accounting',
        loadChildren: () =>
            import('./core/components/accounting/accounting.module').then(
                (m) => m.AccountingModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'catalog',
        component: SvgDefinitionsComponent,
    },

    { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],

    exports: [RouterModule],
})
export class AppRoutingModule {}
