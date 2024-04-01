import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantHosRulesComponent } from './applicant-hos-rules.component';

const routes: Routes = [
    {
        path: '',
        component: ApplicantHosRulesComponent,
        data: { title: 'HOS Rules' },
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplicantHosRulesRoutingModule {}
