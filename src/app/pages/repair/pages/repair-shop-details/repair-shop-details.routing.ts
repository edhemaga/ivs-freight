import { Routes, RouterModule } from '@angular/router';
import { RepairShopDetailsComponent } from '@pages/repair/pages/repair-shop-details/repair-shop-details.component';

const routes: Routes = [{ path: '', component: RepairShopDetailsComponent }];

export const RepairShopDetailsRoutes = RouterModule.forChild(routes);
