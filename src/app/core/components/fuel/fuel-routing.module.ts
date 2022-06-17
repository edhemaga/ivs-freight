import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuelTableComponent } from './fuel-table/fuel-table.component';

const routes: Routes = [
  {
    path: '',
    component: FuelTableComponent,
    data: { title: 'Fuel' },
  },
  {
    path:':id/details',
    loadChildren:()=>import('./fuel-details/fuel-details.module').then(
      (m)=>m.FuelDetailsModule
    )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class FuelRoutingModule {}
