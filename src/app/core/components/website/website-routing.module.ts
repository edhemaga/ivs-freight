import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteMainComponent } from './components/website-main/website-main.component';

const routes: Routes = [
    {
        path: '',
        component: WebsiteMainComponent,
        data: { title: 'Website' },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule],
})
export class WebsiteRoutingModule {}
