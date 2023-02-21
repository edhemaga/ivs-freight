import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelematicRoutingModule } from './telematic-routing.module';
import { TelematicMapComponent } from './telematic-map/telematic-map.component';
import { AgmCoreModule } from '@agm/core';
import { MapToolbarComponent } from '../standalone-components/map-toolbar/map-toolbar.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TaInputComponent } from '../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../shared/ta-input-dropdown/ta-input-dropdown.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { TaCheckboxComponent } from '../shared/ta-checkbox/ta-checkbox.component';
import { MapMarkerDropdownComponent } from '../shared/map-marker-dropdown/map-marker-dropdown.component';
import { GpsProgressbarComponent } from '../shared/gps-progressbar/gps-progressbar.component';

@NgModule({
    declarations: [TelematicMapComponent],
    imports: [
        CommonModule,
        TelematicRoutingModule,
        AgmCoreModule,
        MapToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        NgbPopoverModule,
        TaInputComponent,
        TaInputDropdownComponent,
        AngularSvgIconModule,
        FormsModule,
        ReactiveFormsModule,
        AgmSnazzyInfoWindowModule,
        TaCheckboxComponent,
        MapMarkerDropdownComponent,
        GpsProgressbarComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TelematicModule {}
