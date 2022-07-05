import { ShipperDetailsModule } from './shipper-details/shipper-details.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { ShipperSingleResolver } from './state/shipper-state/shipper-details-state/shipper-single.resolver';


const routes: Routes = [
  {
    path: '',
    component: CustomerTableComponent,
    data: { title: 'Customer' },
  },
  {
    path:':id/shipper-details',
    loadChildren:()=>
    import('./shipper-details/shipper-details.module').then(
      (m) => m.ShipperDetailsModule
    ),
    resolve:{
      shipper:ShipperSingleResolver
    },
    data:{title:'Shipper details'}
  },
  {
    path: 'card',
    component: BrokerCardComponent,
    data: {title: 'Shipper cards'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CustomerRoutingModule {}
