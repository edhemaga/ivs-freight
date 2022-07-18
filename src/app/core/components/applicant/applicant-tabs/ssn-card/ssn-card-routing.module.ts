import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SsnCardComponent } from './ssn-card.component';

const routes: Routes = [
  {
    path: '',
    component: SsnCardComponent,
    data: { title: 'Ssn Card' },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class SsnCardRoutingModule {}
