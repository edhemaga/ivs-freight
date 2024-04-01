import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OwnerInfoComponent } from './owner-info.component';

const routes: Routes = [
    {
        path: '',
        component: OwnerInfoComponent,
        data: { title: 'Owner Info' },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OwnerInfoRoutingModule {}
