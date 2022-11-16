import { ShipperDetailsModule } from './shipper-details/shipper-details.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { BrokerDetailsModule } from './broker-details/broker-details.module';

@NgModule({
  declarations: [CustomerTableComponent, BrokerCardComponent],
  imports: [
    CommonModule,
    TruckassistTableModule,
    CustomerRoutingModule,
    ShipperDetailsModule,
    BrokerDetailsModule,
    AngularSvgIconModule,
    SharedModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
  ],
})
export class CustomerModule {}
