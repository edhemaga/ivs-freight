import { Routes, RouterModule } from '@angular/router';
import { ShipperDetailsComponent } from './shipper-details.component';


const routes: Routes = [{ path: '', component: ShipperDetailsComponent }];

export const ShipperDetailsRoutes = RouterModule.forChild(routes);
