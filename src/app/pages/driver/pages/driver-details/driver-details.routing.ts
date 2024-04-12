import { Routes, RouterModule } from '@angular/router';
import { DriverDetailsComponent } from '@pages/driver/pages/driver-details/driver-details.component';

const routes: Routes = [{ path: '', component: DriverDetailsComponent }];

export const DriverDetailsRoutes = RouterModule.forChild(routes);
