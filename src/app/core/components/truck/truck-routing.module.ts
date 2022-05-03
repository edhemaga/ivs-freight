import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TruckTableComponent } from './truck-table/truck-table.component';

const routes: Routes = [
  {
    path: '',
    component: TruckTableComponent,
    data: { title: 'Truck' },
  },
  {
    path:':id/details',
    loadChildren:()=>
    import('./truck-details/truck-details.module').then(
      (m) => m.TruckDetailsModule
    ),
    data:{title:'Truck details'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TruckRoutingModule { }
