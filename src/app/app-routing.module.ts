import { DispatcherResolverService } from './core/components/dispatcher/state/dispatcher-resolver.service';
import { DashboardResolverService } from './core/components/dashboard/state/dashboard-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';

const routes: Routes = [
  // Auth Routes
  {
    path: 'login',
    loadChildren: () =>
      import('./core/components/authentication/auth.module').then(
        (m) => m.AuthModule
      ),
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
  },
  {
    path: 'truck',
    loadChildren: () =>
      import('./core/components/truck/truck.module').then((m) => m.TruckModule),
  },
  {
    path: 'trailer',
    loadChildren: () =>
      import('./core/components/trailer/trailer.module').then(
        (m) => m.TrailerModule
      ),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./core/components/customer/customer.module').then(
        (m) => m.CustomerModule
      ),
  },
  {
    path: 'load',
    loadChildren: () =>
      import('./core/components/load/load.module').then((m) => m.LoadModule),
  },
  {
    path: 'repair',
    loadChildren: () =>
      import('./core/components/repair/repair.module').then(
        (m) => m.RepairModule
      ),
  },
  {
    path: 'fuel',
    loadChildren: () =>
      import('./core/components/fuel/fuel.module').then((m) => m.FuelModule),
  },
  {
    path: 'owner',
    loadChildren: () =>
      import('./core/components/owner/owner.module').then((m) => m.OwnerModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./core/components/account/account.module').then(
        (m) => m.AccountModule
      ),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./core/components/contacts/contacts.module').then(
        (m) => m.ContactsModule
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
