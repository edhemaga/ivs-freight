import { Routes, RouterModule } from '@angular/router';
import { CustomAgreementComponent } from './custom-agreement.component';

const routes: Routes = [{ path: '', component: CustomAgreementComponent }];

export const SettingCustomAgreementRoutes = RouterModule.forChild(routes);
