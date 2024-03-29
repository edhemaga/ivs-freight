import { Routes, RouterModule } from '@angular/router';
import { BrokerDetailsComponent } from './broker-details.component';

const routes: Routes = [{ path: '', component: BrokerDetailsComponent }];

export const BrokerDetailsRoutes = RouterModule.forChild(routes);
