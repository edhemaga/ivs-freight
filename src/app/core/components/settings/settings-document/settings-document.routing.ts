import { Routes, RouterModule } from '@angular/router';
import { SettingsDocumentComponent } from './settings-document.component';

const routes: Routes = [{ path: '', component: SettingsDocumentComponent }];

export const SettingsDocumentRoutes = RouterModule.forChild(routes);
