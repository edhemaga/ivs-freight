import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantOwnerInfoComponent } from './applicant-owner-info.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantOwnerInfoComponent,
        data: { title: 'Owner Info' },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplicantOwnerInfoRoutingModule {}
