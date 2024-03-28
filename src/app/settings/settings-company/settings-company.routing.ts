import { SettingsCompanyComponent } from './settings-company.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: SettingsCompanyComponent }];

export const SettingsCompanyRoutes = RouterModule.forChild(routes);
