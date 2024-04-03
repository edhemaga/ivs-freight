import { Routes, RouterModule } from '@angular/router';

// components
import { SettingsCompanyComponent } from './settings-company.component';

const routes: Routes = [{ path: '', component: SettingsCompanyComponent }];

export const SettingsCompanyRoutes = RouterModule.forChild(routes);
