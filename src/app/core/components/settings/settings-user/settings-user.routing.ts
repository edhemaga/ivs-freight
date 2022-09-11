import { SettingsUserComponent } from './settings-user.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: SettingsUserComponent },
];

export const SettingsUserRoutes = RouterModule.forChild(routes);
