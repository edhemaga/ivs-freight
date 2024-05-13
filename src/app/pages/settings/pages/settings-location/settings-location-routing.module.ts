import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { SettingsLocationComponent } from '@pages/settings/pages/settings-location/settings-location.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsLocationComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsLocationRoutingModule {}
