import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { ShipperSingleResolver } from './state/shipper-state/shipper-details-state/shipper-single.resolver';
import { BrokerDetailsResolver } from './state/broker-details-state/broker-details.resolver';
import { BrokerMinimalListResolver } from './state/broker-details-state/broker-minimal-list-state/broker-minimal.resolver';
import { ShipperMinimalListResolver } from './state/shipper-state/shipper-details-state/shipper-minimal-list-state/shipper-minimal.resolver';

const routes: Routes = [
  {
    path: '',
    component: CustomerTableComponent,
    data: { title: 'Customer' },
  },
  {
    path: ':id/shipper-details',
    loadChildren: () =>
      import('./shipper-details/shipper-details.module').then(
        (m) => m.ShipperDetailsModule
      ),
    resolve: {
      shipper: ShipperSingleResolver,
      shipperMinimalList: ShipperMinimalListResolver,
    },
    data: { title: 'Shipper details' },
  },
  {
    path: ':id/broker-details',
    loadChildren: () =>
      import('./broker-details/broker-details.module').then(
        (m) => m.BrokerDetailsModule
      ),
    resolve: {
      broker: BrokerDetailsResolver,
      brokerMinimal: BrokerMinimalListResolver,
    },
  },
  {
    path: 'card',
    component: BrokerCardComponent,
    data: { title: 'Shipper cards' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
