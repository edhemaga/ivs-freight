
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViolationTableComponent } from './violation-table/violation-table.component';

const routes: Routes = [
  {
    path: '',
    component: ViolationTableComponent,
    data: { title: 'Violation' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViolationRoutingModule {}
