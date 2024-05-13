/* import { Routes, RouterModule } from '@angular/router';

// components

const routes: Routes = [{ path: '', component: SettingsIntegrationComponent }];

export const SettingsIntegrationRoutes = RouterModule.forChild(routes);
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { SettingsIntegrationComponent } from '@pages/settings/pages/settings-integration/settings-integration.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsIntegrationComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsIntegrationRoutingModule {}
