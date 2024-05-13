import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { SettingsCompanyComponent } from '@pages/settings/pages/settings-company/settings-company.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsCompanyComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsCompanyRoutingModule {}
