import { TruckassistProgressExpirationComponent } from './core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { DispatcherResolverService } from './core/components/dispatcher/state/dispatcher-resolver.service';
import { DashboardResolverService } from './core/components/dashboard/state/dashboard-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';
import { SvgDefinitionsComponent } from './svg-definitions/svg-definitions.component';

import { ApplicantWelcomeScreenComponent } from './core/components/applicant/applicant-welcome-screen/applicant-welcome-screen.component';
import { DriverActiveResolver } from './core/components/driver/state/driver-active-state/driver-active.resolver';
import { HelperSignupUserComponent } from './core/components/authentication/helper-signup-user/helper-signup-user.component';
import { HelperComponent } from './core/components/authentication/helper/helper.component';
import { HelperForgotPasswordComponent } from './core/components/authentication/helper-forgot-password/helper-forgot-password.component';
import { TruckResolver } from './core/components/truck/state/truck.resolver';
import { TrailerResolver } from './core/components/trailer/state/trailer.resolver';
import { BrokerResolver } from './core/components/customer/state/broker-state/broker.resolver';
import { ShipperResolver } from './core/components/customer/state/shipper-state/shipper.resolver';
import { ShopResolver } from './core/components/repair/state/shop-state/shop.resolver';
import { DriverInactiveResolver } from './core/components/driver/state/driver-inactive-state/driver-inactive.resolver';

const routes: Routes = [
  // Auth Routes
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/components/authentication/auth.module').then(
        (m) => m.AuthModule
      ),
  },
  {
    path: 'api/account/signupuser',
    component: HelperSignupUserComponent,
    data: { title: 'Helper Component Route' },
  },
  {
    path: 'api/account/verifyowner',
    component: HelperComponent,
    data: { title: 'Helper Component Route' },
  },
  {
    path: 'api/account/verifyforgotpassword',
    component: HelperForgotPasswordComponent,
    data: { title: 'Helper Component Route' },
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
    path: 'dispatcher',
    loadChildren: () =>
      import('./core/components/dispatcher/dispatcher.module').then(
        (m) => m.DispatcherModule
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
    path: 'driver',
    loadChildren: () =>
      import('./core/components/driver/driver.module').then(
        (m) => m.DriverModule
      ),
    canActivate: [AuthGuard],
    resolve: {
      driverActive: DriverActiveResolver,
      driversInactive: DriverInactiveResolver,
    },
  },
  {
    path: 'truck',
    loadChildren: () =>
      import('./core/components/truck/truck.module').then((m) => m.TruckModule),
    canActivate: [AuthGuard],
    resolve: { truck: TruckResolver },
  },
  {
    path: 'trailer',
    loadChildren: () =>
      import('./core/components/trailer/trailer.module').then(
        (m) => m.TrailerModule
      ),
    canActivate: [AuthGuard],
    resolve: { trailer: TrailerResolver },
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
    path: 'load',
    loadChildren: () =>
      import('./core/components/load/load.module').then((m) => m.LoadModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'repair',
    loadChildren: () =>
      import('./core/components/repair/repair.module').then(
        (m) => m.RepairModule
      ),
    canActivate: [AuthGuard],
    resolve: { shop: ShopResolver },
  },
  {
    path: 'pm',
    loadChildren: () =>
      import('./core/components/pm-truck-trailer/pm-truck-trailer.module').then(
        (m) => m.PmTruckTrailerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel',
    loadChildren: () =>
      import('./core/components/fuel/fuel.module').then((m) => m.FuelModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'owner',
    loadChildren: () =>
      import('./core/components/owner/owner.module').then((m) => m.OwnerModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./core/components/account/account.module').then(
        (m) => m.AccountModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./core/components/contacts/contacts.module').then(
        (m) => m.ContactsModule
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
    path: 'safety/violation',
    loadChildren: () =>
      import('./core/components/safety/violation/violation.module').then(
        (m) => m.ViolationModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'safety/accident',
    loadChildren: () =>
      import('./core/components/safety/accident/accident.module').then(
        (m) => m.AccidentModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tools/todo',
    loadChildren: () =>
      import('./core/components/to-do/to-do.module').then((m) => m.ToDoModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'applicant/welcome',
    component: ApplicantWelcomeScreenComponent,
    data: { title: 'Welcome Screen' },
  },
  {
    path: 'applicant/:id',
    loadChildren: () =>
      import('./core/components/applicant/applicant.module').then(
        (m) => m.ApplicantModule
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
