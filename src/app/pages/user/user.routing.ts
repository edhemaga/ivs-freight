import { Routes, RouterModule } from '@angular/router';
import { UserTableComponent } from './pages/user-table/user-table.component';

const routes: Routes = [{ path: '', component: UserTableComponent }];

export const UserRoutes = RouterModule.forChild(routes);
