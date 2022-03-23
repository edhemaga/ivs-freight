import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { CustomerRoutingModule } from './customer-routing.module';

@NgModule({
  declarations: [CustomerTableComponent],
  imports: [CommonModule, TruckassistTableModule, CustomerRoutingModule],
})
export class CustomerModule {}
