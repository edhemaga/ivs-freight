import { Routes, RouterModule } from '@angular/router';
import { LoadDetailsComponent } from './load-details.component';

const routes: Routes = [{ path: '', component: LoadDetailsComponent }];

export const LoadDetailsRoutes = RouterModule.forChild(routes);
