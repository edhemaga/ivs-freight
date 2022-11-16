import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SphComponent } from './sph.component';

const routes: Routes = [
   {
      path: '',
      component: SphComponent,
      data: { title: 'SPH' },
      children: [],
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class SphRoutingModule {}
