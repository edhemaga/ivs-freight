import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutingRoutingModule } from './routing-routing.module';
import { RoutingMapComponent } from './routing-map/routing-map.component';

import { FilterRoutesPipe } from './filter-routes.pipe';
import { MapToolbarComponent } from '../standalone-components/map-toolbar/map-toolbar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgmCoreModule } from '@agm/core';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TaThousandSeparatorPipe } from '../../pipes/taThousandSeparator.pipe';
@NgModule({
    declarations: [RoutingMapComponent, FilterRoutesPipe],
    imports: [
        CommonModule,
        RoutingRoutingModule,
        MapToolbarComponent,
        DragDropModule,
        AgmCoreModule,
        AppTooltipComponent,
        TaThousandSeparatorPipe
    ],
})
export class RoutingModule {}
