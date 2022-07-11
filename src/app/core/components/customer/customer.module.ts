import { ShipperDetailsModule } from './shipper-details/shipper-details.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ShipperDetailsComponent } from './shipper-details/shipper-details.component';
import { ShipperDetailsSingleComponent } from './shipper-details/shipper-details-single/shipper-details-single.component';
import { ShipperCardViewComponent } from './shipper-card-view/shipper-card-view.component';
import { BrokerDetailsComponent } from './broker-details/broker-details.component';
import { BrokerCardViewComponent } from './broker-card-view/broker-card-view.component';
import { BrokerDetailsSingleComponent } from './broker-details/broker-details-single/broker-details-single.component';

@NgModule({
  declarations: [CustomerTableComponent, BrokerCardComponent, BrokerDetailsComponent, BrokerCardViewComponent, BrokerDetailsSingleComponent],
  imports: [
    CommonModule,
    TruckassistTableModule,
    CustomerRoutingModule,
    ShipperDetailsModule,
    AngularSvgIconModule,
    SharedModule
  ],
})
export class CustomerModule {}
