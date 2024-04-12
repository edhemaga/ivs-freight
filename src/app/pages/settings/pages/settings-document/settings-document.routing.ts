import { Routes, RouterModule } from '@angular/router';

//components
import { SettingsDocumentComponent } from '@pages/settings/pages/settings-document/settings-document.component';

const routes: Routes = [{ path: '', component: SettingsDocumentComponent }];

export const SettingsDocumentRoutes = RouterModule.forChild(routes);
