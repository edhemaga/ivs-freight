import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CdlCardComponent } from './cdl-card.component';

const routes: Routes = [
  {
    path: '',
    component: CdlCardComponent,
    data: { title: 'Cdl Card' },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CdlCardRoutingModule {}
