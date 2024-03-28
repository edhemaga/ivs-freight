import { ViolationDetailsPageComponent } from './violation-details-page.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: ViolationDetailsPageComponent }];

export const ViolationDetailsRoutes = RouterModule.forChild(routes);
