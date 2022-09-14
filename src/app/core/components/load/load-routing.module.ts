import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadTableComponent } from './load-table/load-table.component';
import { LoadDetailsModule } from './load-details/load-details.module';
import { LoatItemResolver } from './state/load-details-state/load-details.resolver';

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
