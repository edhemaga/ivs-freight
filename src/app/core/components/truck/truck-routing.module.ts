import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TruckCardComponent } from './truck-card/truck-card.component';
import { TruckTableComponent } from './truck-table/truck-table.component';

const routes: Routes = [
  {
    path: '',
    component: TruckTableComponent,
    data: { title: 'Truck' },
  },
  {
    path: 'card',
    component: TruckCardComponent,
    data: {title: 'Truck cards'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TruckRoutingModule { }
