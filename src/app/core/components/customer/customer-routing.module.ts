import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerTableComponent,
    data: { title: 'Customer' },
  },
  {
    path: 'card',
    component: BrokerCardComponent,
    data: {title: 'Truck cards'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CustomerRoutingModule {}
