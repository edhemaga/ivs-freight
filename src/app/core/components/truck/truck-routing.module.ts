import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TruckTableComponent } from './truck-table/truck-table.component';

const routes: Routes = [
  {
    path: '',
    component: TruckTableComponent,
    data: { title: 'Truck' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TruckRoutingModule {}
