import { Routes, RouterModule } from '@angular/router';

// components
import { SettingsIntegrationComponent } from '@pages/settings/pages/settings-integration/settings-integration.component';

const routes: Routes = [{ path: '', component: SettingsIntegrationComponent }];

export const SettingsIntegrationRoutes = RouterModule.forChild(routes);
