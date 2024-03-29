import { SettingsBillingComponent } from '../pages/settings-billing/settings-billing.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: SettingsBillingComponent }];

export const SettingsBillingRoutes = RouterModule.forChild(routes);
