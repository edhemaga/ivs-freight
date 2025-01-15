import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guards
import { AuthGuard } from '@core/guards/authentication.guard';

// components
import { WebsiteMainComponent } from '@pages/website/pages/website-main/website-main.component';
import { SelectCompanyComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/select-company/select-company.component';

import { WebsiteUnderConstructionComponent } from '@pages/website/components/website-under-construction/website-under-construction.component';

const routes: Routes = [
    {
        path: '',
        component: WebsiteMainComponent,
        data: { title: 'Website' },
        children: [
            {
                path: 'select-company',
                component: SelectCompanyComponent,
                data: { title: 'Select Company' },
                canActivate: [AuthGuard],
            },
            {
                path: 'features',
                component: WebsiteUnderConstructionComponent,
                data: { title: 'Features' },
            },
            {
                path: 'pricing',
                component: WebsiteUnderConstructionComponent,
                data: { title: 'Pricing' },
            },
            {
                path: 'support',
                component: WebsiteUnderConstructionComponent,
                data: { title: 'Support' },
            },

            // { path: '**', redirectTo: '/website', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule],
})
export class WebsiteRoutingModule {}
