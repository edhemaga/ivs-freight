import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverTableComponent } from './driver-table/driver-table.component';
import { DriverRoutingModule } from './driver-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { DriverCardComponent } from './driver-card/driver-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [DriverTableComponent, DriverCardComponent],
  imports: [
    CommonModule,
    DriverRoutingModule,
    TruckassistTableModule,
    AngularSvgIconModule
  ],
})
export class DriverModule {}
