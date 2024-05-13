import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { SettingsDocumentComponent } from '@pages/settings/pages/settings-document/settings-document.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsDocumentComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsDocumentRoutingModule {}
