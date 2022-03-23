import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTableComponent } from './customer-table/customer-table.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerTableComponent,
    data: { title: 'Customer' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CustomerRoutingModule {}
