import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadTableComponent } from './load-table/load-table.component';

const routes: Routes = [
  {
    path: '',
    component: LoadTableComponent,
    data: { title: 'Load' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class LoadRoutingModule {}
