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
  },
  {
    path: 'dispatcher',
    loadChildren: () => import('./core/components/dispatcher/dispatcher.module').then((m) => m.DispatcherModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'report',
    loadChildren: () => import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'dispatch',
    loadChildren: () => import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'company/settings',
    loadChildren: () => import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
