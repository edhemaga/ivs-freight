import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelematicRoutingModule } from './telematic-routing.module';
import { TelematicMapComponent } from './telematic-map/telematic-map.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { GpsProgressbarComponent } from 'src/app/core/components/shared/gps-progressbar/gps-progressbar.component';
import { MapMarkerDropdownComponent } from 'src/app/core/components/shared/map-marker-dropdown/map-marker-dropdown.component';
import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';
import { TaInputDropdownComponent } from 'src/app/core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from 'src/app/core/components/shared/ta-input/ta-input.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { MapToolbarComponent } from 'src/app/core/components/standalone-components/map-toolbar/map-toolbar.component';

@NgModule({
    declarations: [TelematicMapComponent],
    imports: [
        // Modules
        CommonModule,
        TelematicRoutingModule,
        AgmCoreModule,
        NgbPopoverModule,
        AngularSvgIconModule,
        FormsModule,
        ReactiveFormsModule,
        AgmSnazzyInfoWindowModule,

        // Components
        MapToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCheckboxComponent,
        MapMarkerDropdownComponent,
        GpsProgressbarComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TelematicModule {}
