import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantMvrAuthorizationComponent } from './applicant-mvr-authorization.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantMvrAuthorizationComponent,
        data: { title: 'MVR Authorization' },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplicantMvrAuthorizationRoutingModule {}
