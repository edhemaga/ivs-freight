import { Routes, RouterModule } from '@angular/router';
import { BrokerDetailsComponent } from '@pages/customer/pages/broker-details/broker-details.component';

const routes: Routes = [{ path: '', component: BrokerDetailsComponent }];

export const BrokerDetailsRoutes = RouterModule.forChild(routes);
