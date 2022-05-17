import { Routes, RouterModule } from '@angular/router';
import { TrailerDetailsComponent } from './trailer-details.component';


const routes: Routes = [{ path: '', component: TrailerDetailsComponent }];

export const TruckDetailsRoutes = RouterModule.forChild(routes);
