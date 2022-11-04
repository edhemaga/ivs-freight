import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HosRulesComponent } from './hos-rules.component';

const routes: Routes = [
  {
    path: '',
    component: HosRulesComponent,
    data: { title: 'HOS Rules' },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HosRulesRoutingModule {}
