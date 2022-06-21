import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmTruckTrailerComponent } from './pm-truck-trailer.component';

const routes: Routes = [
  {
    path: '',
    component: PmTruckTrailerComponent,
    data: { title: 'PM' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PMRoutingModule {}
