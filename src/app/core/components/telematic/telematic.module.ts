import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelematicRoutingModule } from './telematic-routing.module';
import { TelematicMapComponent } from './telematic-map/telematic-map.component';
import { AgmCoreModule } from '@agm/core';
import { MapToolbarComponent } from '../standalone-components/map-toolbar/map-toolbar.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';

@NgModule({
    declarations: [TelematicMapComponent],
    imports: [
        CommonModule,
        TelematicRoutingModule,
        AgmCoreModule,
        MapToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
    ],
})
export class TelematicModule {}
