import { Routes, RouterModule } from '@angular/router';
import { SettingsIntegrationComponent } from './settings-integration.component';

const routes: Routes = [
  { path: '', component: SettingsIntegrationComponent },
];

export const SettingsIntegrationRoutes = RouterModule.forChild(routes);
