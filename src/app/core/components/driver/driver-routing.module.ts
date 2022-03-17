import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverTableComponent } from './driver-table/driver-table.component';

const routes: Routes = [
  {
    path: '',
    component: DriverTableComponent,
    data: { title: 'Driver' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
