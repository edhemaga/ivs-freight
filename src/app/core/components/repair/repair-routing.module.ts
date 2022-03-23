import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepairTableComponent } from './repair-table/repair-table.component';

const routes: Routes = [
  {
    path: '',
    component: RepairTableComponent,
    data: { title: 'Repair' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RepairRoutingModule {}
