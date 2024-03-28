import { Routes, RouterModule } from '@angular/router';
import { TruckDetailsComponent } from './truck-details.component';

const routes: Routes = [{ path: '', component: TruckDetailsComponent }];

export const TruckDetailsRoutes = RouterModule.forChild(routes);
