import { TruckassistProgressExpirationComponent } from './core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { DispatcherResolverService } from './core/components/dispatcher/state/dispatcher-resolver.service';
import { DashboardResolverService } from './core/components/dashboard/state/dashboard-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';
import { SvgDefinitionsComponent } from './svg-definitions/svg-definitions.component';

import { DriverResolver } from './core/components/driver/state/driver.resolver';
import { HelperSignupUserComponent } from './core/components/authentication/helper-signup-user/helper-signup-user.component';

const routes: Routes = [
  // Auth Routes
  {
    path: '',
    loadChildren: () =>
      import('./core/components/authentication/auth.module').then(
        m => m.AuthModule
      ),
  },
  {
    path: 'api/account/signupuser',
    component: HelperSignupUserComponent,
    data: { title: 'Helper Component Route' },
  },
  /* "http://localhost:4200/api/account/signupuser?Code=iW9zms6920Srx1S8rAUvoA==&FirstName=Djoka&LastName=Mili&Phone=(012)%20123-4456&Email=contactkka@gmail.com&Address=7843%20W%2098th%20Pl,%20Hickory%20Hills,%20IL%2060457,%20USA&City=Hickory%20Hills&Country=US&AddressUnit=" */
  /* "http://localhost:4200/api/account/signupuser?Code=tHA8+RtR6k+PdQRMyAjT5w==&amp;FirstName=Djoka&amp;LastName=Mili&amp;Phone=0641231231&amp;Email=milutin.spaic@yahoo.com&amp;Address=7843 W 98th Pl, Hickory Hills, IL 60457, USA&amp;City=Hickory Hills&amp;Country=US&amp;AddressUnit=" */
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./core/components/dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
    canActivate: [AuthGuard],
    resolve: { dashboard: DashboardResolverService },
  },
  {
    path: 'dispatcher',
    loadChildren: () =>
      import('./core/components/dispatcher/dispatcher.module').then(
        m => m.DispatcherModule
      ),
    canActivate: [AuthGuard],
    resolve: { dispatcher: DispatcherResolverService },
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./core/components/settings/settings.module').then(
        m => m.SettingsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'driver',
    loadChildren: () =>
      import('./core/components/driver/driver.module').then(
        m => m.DriverModule
      ),
    canActivate: [AuthGuard],
    resolve: { driver: DriverResolver },
  },
  {
    path: 'truck',
    loadChildren: () =>
      import('./core/components/truck/truck.module').then(m => m.TruckModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'trailer',
    loadChildren: () =>
      import('./core/components/trailer/trailer.module').then(
        m => m.TrailerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./core/components/customer/customer.module').then(
        m => m.CustomerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'load',
    loadChildren: () =>
      import('./core/components/load/load.module').then(m => m.LoadModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'repair',
    loadChildren: () =>
      import('./core/components/repair/repair.module').then(
        m => m.RepairModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel',
    loadChildren: () =>
      import('./core/components/fuel/fuel.module').then(m => m.FuelModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'owner',
    loadChildren: () =>
      import('./core/components/owner/owner.module').then(m => m.OwnerModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./core/components/account/account.module').then(
        m => m.AccountModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./core/components/contacts/contacts.module').then(
        m => m.ContactsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tools/calendar',
    loadChildren: () =>
      import('./core/components/calendar/calendar.module').then(
        m => m.CalendarModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'safety/violation',
    loadChildren: () =>
      import('./core/components/safety/violation/violation.module').then(
        m => m.ViolationModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'safety/accident',
    loadChildren: () =>
      import('./core/components/safety/accident/accident.module').then(
        m => m.AccidentModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tools/todo',
    loadChildren: () =>
      import('./core/components/to-do/to-do.module').then(m => m.ToDoModule),
  },
  {
    path: 'test',
    component: TruckassistProgressExpirationComponent,
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
