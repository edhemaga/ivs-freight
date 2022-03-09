import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DispatcherTableComponent} from './dispatcher-table/dispatcher-table/dispatcher-table.component';

const routes: Routes = [
  {
    path: '',
    component: DispatcherTableComponent,
    data: {title: 'Dispatch board'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DispatchRoutingModule {
}
