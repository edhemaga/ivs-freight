import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteMainComponent } from './components/website-main/website-main.component';
import { WebsiteUnderConstructionComponent } from './components/website-under-construction/website-under-construction.component';

const routes: Routes = [
    {
        path: '',
        component: WebsiteMainComponent,
        data: { title: 'Website' },
        children: [
            {
                path: 'features',
                component: WebsiteUnderConstructionComponent,
                data: { title: 'Features' },
            },
            {
                path: 'pricing',
                component: WebsiteUnderConstructionComponent,
                data: { title: 'Features' },
            },
            {
                path: 'support',
                component: WebsiteUnderConstructionComponent,
                data: { title: 'Features' },
            },
            { path: '**', redirectTo: '/website', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule],
})
export class WebsiteRoutingModule {}
