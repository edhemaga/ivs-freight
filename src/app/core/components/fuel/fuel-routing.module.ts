import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuelTableComponent } from './fuel-table/fuel-table.component';

const routes: Routes = [
  {
    path: '',
    component: FuelTableComponent,
    data: { title: 'Fuel' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class FuelRoutingModule {}
