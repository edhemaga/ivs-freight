import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutingRoutingModule } from './routing-routing.module';
import { RoutingMapComponent } from './routing-map/routing-map.component';

import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { FilterRoutesPipe } from './filter-routes.pipe';
import { MapToolbarComponent } from '../standalone-components/map-toolbar/map-toolbar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgmCoreModule } from '@agm/core';
@NgModule({
    declarations: [RoutingMapComponent, FilterRoutesPipe],
    imports: [
        CommonModule,
        RoutingRoutingModule,
        TruckassistTableModule,
        MapToolbarComponent,
        DragDropModule,
        AgmCoreModule
    ],
})
export class RoutingModule {}
