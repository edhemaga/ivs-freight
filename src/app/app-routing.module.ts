import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';

const routes: Routes = [
  // Auth Routes
  {
    path: '',
    loadChildren: () => import('./core/components/authentication/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'report',
    loadChildren: () =>
      import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'load',
    loadChildren: () =>
      import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'mvr',
    loadChildren: () =>
      import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./core/components/dashboard/dashboard.module').then((m) => m.DashboardModule),
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
