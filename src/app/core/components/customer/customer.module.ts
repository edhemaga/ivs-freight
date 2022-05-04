import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { BrokerCardComponent } from './broker-card/broker-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [CustomerTableComponent, BrokerCardComponent],
  imports: [CommonModule, TruckassistTableModule, CustomerRoutingModule, AngularSvgIconModule],
})
export class CustomerModule {}
