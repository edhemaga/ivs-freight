import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverTableComponent } from './driver-table/driver-table.component';
import { DriverRoutingModule } from './driver-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { DriverCardComponent } from './driver-card/driver-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DriverDetailsCardComponent } from './driver-details-card/driver-details-card.component';
import { DriverDetailsModule } from './driver-details/driver-details.module';

@NgModule({
  declarations: [DriverTableComponent, DriverCardComponent],
  imports: [
    CommonModule,
    DriverRoutingModule,
    DriverDetailsModule,
    TruckassistTableModule,
    AngularSvgIconModule,
    
  ],

})
export class DriverModule {}
