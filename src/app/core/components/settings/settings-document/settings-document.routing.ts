import { Routes, RouterModule } from '@angular/router';
import { SettingsDocumentComponent } from './settings-document.component';
import { SettingsDocumentModule } from './settings-document.module';

const routes: Routes = [
  { path: '', component: SettingsDocumentComponent },
];

export const SettingsDocumentRoutes = RouterModule.forChild(routes);
