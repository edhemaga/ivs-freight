import { Routes, RouterModule } from '@angular/router';
import { LoadDetailsComponent } from '@pages/load/pages/load-details//load-details.component';

const routes: Routes = [{ path: '', component: LoadDetailsComponent }];

export const LoadDetailsRoutes = RouterModule.forChild(routes);
