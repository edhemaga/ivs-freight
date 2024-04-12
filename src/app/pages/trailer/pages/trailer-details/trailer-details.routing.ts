import { Routes, RouterModule } from '@angular/router';

import { TrailerDetailsComponent } from '@pages/trailer/pages/trailer-details/trailer-details.component';

const routes: Routes = [{ path: '', component: TrailerDetailsComponent }];

export const TruckDetailsRoutes = RouterModule.forChild(routes);
