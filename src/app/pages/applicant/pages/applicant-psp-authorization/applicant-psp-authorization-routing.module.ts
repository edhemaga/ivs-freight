import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantPspAuthorizationComponent } from '@pages/applicant/pages/applicant-psp-authorization/applicant-psp-authorization.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantPspAuthorizationComponent,
        data: { title: 'PSP Authorization' },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplicantPspAuthorizationRoutingModule {}
