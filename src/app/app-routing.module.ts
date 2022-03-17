import { DispatcherResolverService } from './core/components/dispatcher/state/dispatcher-resolver.service';
import { DashboardResolverService } from './core/components/dashboard/state/dashboard-resolver.service';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';

const routes: Routes = [
  // Auth Routes
  {
    path: 'login',
    loadChildren: () => import('./core/components/authentication/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
    resolve: { dashboard: DashboardResolverService }
  },
  {
    path: 'dispatcher',
    loadChildren: () => import('./core/components/dispatcher/dispatcher.module').then((m) => m.DispatcherModule),
    canActivate: [AuthGuard],
    resolve: {dispatcher: DispatcherResolverService}
  },
  {
    path: 'settings',
    loadChildren: () => import('./core/components/settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'driver',
    loadChildren: () => import('./core/components/driver/driver.module').then((m) => m.DriverModule),
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
