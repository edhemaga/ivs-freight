import { Routes, RouterModule } from '@angular/router';
import { UserTableComponent } from './user-table/user-table.component';

const routes: Routes = [
  { path: '', component: UserTableComponent },
];

export const SettingsUserRoutes = RouterModule.forChild(routes);
