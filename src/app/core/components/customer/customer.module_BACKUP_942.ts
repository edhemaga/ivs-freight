import { ShipperDetailsModule } from './shipper-details/shipper-details.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
<<<<<<< HEAD
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [CustomerTableComponent, BrokerCardComponent],
  imports: [CommonModule, TruckassistTableModule, CustomerRoutingModule, AngularSvgIconModule, AgmCoreModule, AgmSnazzyInfoWindowModule, SharedModule],
=======
import { ShipperDetailsComponent } from './shipper-details/shipper-details.component';
import { ShipperDetailsSingleComponent } from './shipper-details/shipper-details-single/shipper-details-single.component';
import { ShipperCardViewComponent } from './shipper-card-view/shipper-card-view.component';

@NgModule({
  declarations: [CustomerTableComponent, BrokerCardComponent],
  imports: [
    CommonModule,
    TruckassistTableModule,
    CustomerRoutingModule,
    ShipperDetailsModule,
    AngularSvgIconModule,
    SharedModule
  ],
>>>>>>> develop
})
export class CustomerModule {}
