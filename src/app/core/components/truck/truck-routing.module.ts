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
<<<<<<< HEAD
    path:':id/details',
    loadChildren:()=>
    import('./truck-details/truck-details.module').then(
      (m) => m.TruckDetailsModule
    ),
    data:{title:'Truck details'}
=======
    path: 'card',
    component: TruckCardComponent,
    data: {title: 'Truck cards'},
>>>>>>> 2e35f3d6d10d3101e0dad3ac13a61a4907ee5dbb
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TruckRoutingModule { }
