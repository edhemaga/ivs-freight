import { ViolationDetailsComponent } from './violation-details.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: ViolationDetailsComponent }];

export const ViolationDetailsRoutes = RouterModule.forChild(routes);
