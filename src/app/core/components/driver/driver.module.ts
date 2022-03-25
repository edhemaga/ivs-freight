import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverTableComponent } from './driver-table/driver-table.component';
import { DriverRoutingModule } from './driver-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { DriverDetailsComponent } from './driver-details/driver-details.component';

@NgModule({
  declarations: [DriverTableComponent, DriverDetailsComponent],
  imports: [CommonModule, DriverRoutingModule, TruckassistTableModule],
})
export class DriverModule {}
