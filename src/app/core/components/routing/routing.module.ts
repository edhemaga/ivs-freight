import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutingRoutingModule } from './routing-routing.module';
import { RoutingMapComponent } from './routing-map/routing-map.component';

import { SharedModule } from '../shared/shared.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { FilterRoutesPipe } from './filter-routes.pipe';

@NgModule({
   declarations: [RoutingMapComponent, FilterRoutesPipe],
   imports: [
      CommonModule,
      RoutingRoutingModule,
      SharedModule,
      TruckassistTableModule,
   ],
})
export class RoutingModule {}
