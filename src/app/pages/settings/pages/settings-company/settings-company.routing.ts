import { Routes, RouterModule } from '@angular/router';

// components
import { SettingsCompanyComponent } from '@pages/settings/pages/settings-company/settings-company.component';

const routes: Routes = [{ path: '', component: SettingsCompanyComponent }];

export const SettingsCompanyRoutes = RouterModule.forChild(routes);
