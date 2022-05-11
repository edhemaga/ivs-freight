import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepairCardComponent } from './repair-card/repair-card.component';
import { RepairTableComponent } from './repair-table/repair-table.component';

const routes: Routes = [
  {
    path: '',
    component: RepairTableComponent,
    data: { title: 'Repair' },
  },
  {
    path: 'card',
    component: RepairCardComponent,
    data: {title: 'Repear cards'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RepairRoutingModule {}
