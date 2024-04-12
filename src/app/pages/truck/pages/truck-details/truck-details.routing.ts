import { Routes, RouterModule } from '@angular/router';

// components
import { TruckDetailsComponent } from '@pages/truck/pages/truck-details//truck-details.component';

const routes: Routes = [{ path: '', component: TruckDetailsComponent }];

export const TruckDetailsRoutes = RouterModule.forChild(routes);
