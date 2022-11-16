import { FuelDetailsComponent } from './fuel-details.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: FuelDetailsComponent }];

export const FuelDetailsRoutes = RouterModule.forChild(routes);
