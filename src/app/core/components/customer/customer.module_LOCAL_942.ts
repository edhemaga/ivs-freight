import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [CustomerTableComponent, BrokerCardComponent],
  imports: [CommonModule, TruckassistTableModule, CustomerRoutingModule, AngularSvgIconModule, AgmCoreModule, AgmSnazzyInfoWindowModule, SharedModule],
})
export class CustomerModule {}
