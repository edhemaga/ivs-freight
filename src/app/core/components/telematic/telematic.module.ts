import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelematicRoutingModule } from './telematic-routing.module';
import { TelematicMapComponent } from './telematic-map/telematic-map.component';

import { SharedModule } from '../shared/shared.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { AgmCoreModule } from '@agm/core';
import { MapToolbarComponent } from '../standalone-components/map-toolbar/map-toolbar.component';


@NgModule({
  declarations: [
    TelematicMapComponent
  ],
  imports: [
    CommonModule,
    TelematicRoutingModule,
    TruckassistTableModule,
    AgmCoreModule,
    MapToolbarComponent
  ]
})
export class TelematicModule { }
