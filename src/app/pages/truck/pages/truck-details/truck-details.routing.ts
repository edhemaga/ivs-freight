import { Routes, RouterModule } from '@angular/router';

// components
import { TruckDetailsComponent } from './truck-details.component';

const routes: Routes = [{ path: '', component: TruckDetailsComponent }];

export const TruckDetailsRoutes = RouterModule.forChild(routes);
