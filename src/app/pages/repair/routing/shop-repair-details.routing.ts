import { Routes, RouterModule } from '@angular/router';
import { ShopRepairDetailsComponent } from '../pages/shop-repair-details/shop-repair-details.component';

const routes: Routes = [{ path: '', component: ShopRepairDetailsComponent }];

export const ShopRepairDetailsRoutes = RouterModule.forChild(routes);
