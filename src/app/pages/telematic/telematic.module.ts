import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TelematicRoutingModule } from './telematic-routing.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { TelematicMapComponent } from './pages/telematic-map/telematic-map.component';
import { TaGpsProgressbarComponent } from 'src/app/shared/components/ta-gps-progressbar/ta-gps-progressbar.component';
import { TaMapMarkerDropdownComponent } from 'src/app/shared/components/ta-map-marker-dropdown/ta-map-marker-dropdown.component';
import { TaCheckboxComponent } from 'src/app/shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputDropdownComponent } from 'src/app/shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
import { TaMapToolbarComponent } from 'src/app/shared/components/ta-map-toolbar/ta-map-toolbar.component';

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
        TaMapToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCheckboxComponent,
        TaMapMarkerDropdownComponent,
        TaGpsProgressbarComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TelematicModule {}
