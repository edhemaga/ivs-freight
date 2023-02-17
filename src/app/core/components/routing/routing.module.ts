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
import { InputAddressDropdownComponent } from '../shared/input-address-dropdown/input-address-dropdown.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DetailsDropdownComponent } from '../shared/details-page-dropdown/details-dropdown';
@NgModule({
    declarations: [RoutingMapComponent, FilterRoutesPipe],
    imports: [
        CommonModule,
        RoutingRoutingModule,
        MapToolbarComponent,
        DragDropModule,
        AgmCoreModule,
        AppTooltipComponent,
        TaThousandSeparatorPipe,
        InputAddressDropdownComponent,
        NgbPopoverModule,
        FormsModule,
        ReactiveFormsModule,
        AgmSnazzyInfoWindowModule,
        AngularSvgIconModule,
        DetailsDropdownComponent
    ],
})
export class RoutingModule {}
