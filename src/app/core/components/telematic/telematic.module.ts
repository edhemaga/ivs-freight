import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelematicRoutingModule } from './telematic-routing.module';
import { TelematicMapComponent } from './telematic-map/telematic-map.component';

import { SharedModule } from '../shared/shared.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';


@NgModule({
  declarations: [
    TelematicMapComponent
  ],
  imports: [
    CommonModule,
    TelematicRoutingModule,
    SharedModule,
    TruckassistTableModule
  ]
})
export class TelematicModule { }
