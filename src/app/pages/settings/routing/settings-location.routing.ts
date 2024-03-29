import { Routes, RouterModule } from '@angular/router';
import { SettingsLocationComponent } from '../pages/settings-location/settings-location.component';

const routes: Routes = [{ path: '', component: SettingsLocationComponent }];

export const SettingsLocationRoutes = RouterModule.forChild(routes);
