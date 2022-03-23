import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerTableComponent } from './owner-table/owner-table.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerTableComponent,
    data: { title: 'Owner' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class OwnerRoutingModule {}
