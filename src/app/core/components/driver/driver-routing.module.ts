import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverTableComponent } from './driver-table/driver-table.component';

const routes: Routes = [
  {
    path: '',
    component: DriverTableComponent,
    data: { title: 'Driver' },
  },
  {
    path: ':id/details',
    loadChildren: () =>
      import('./driver-details/driver-details.module').then(
        (m) => m.DriverDetailsModule
      ),
    data: { title: 'Driver Details' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
