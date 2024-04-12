import { Routes, RouterModule } from '@angular/router';

// components
import { UserTableComponent } from '@pages/user/pages/user-table/user-table.component';

const routes: Routes = [{ path: '', component: UserTableComponent }];

export const UserRoutes = RouterModule.forChild(routes);
