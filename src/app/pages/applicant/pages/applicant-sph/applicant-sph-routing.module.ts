import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantSphComponent } from './applicant-sph.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantSphComponent,
        data: { title: 'SPH' },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplicantSphRoutingModule {}
