import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
//import { TelematicRoutingModule } from '@pages/telematic/telematic-routing.module';
// import { AgmCoreModule } from '@agm/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
// import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { TelematicMapComponent } from '@pages/telematic/pages/telematic-map/telematic-map.component';
import { TaGpsProgressbarComponent } from '@shared/components/ta-gps-progressbar/ta-gps-progressbar.component';
//import { TaMapMarkerDropdownComponent } from '@shared/components/ta-map-marker-dropdown/ta-map-marker-dropdown.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaMapToolbarComponent } from '@shared/components/ta-map-toolbar/ta-map-toolbar.component';

@NgModule({
    declarations: [TelematicMapComponent],
    imports: [
        // Modules
        CommonModule,
       // TelematicRoutingModule,
       // AgmCoreModule,
        NgbPopoverModule,
        AngularSvgIconModule,
        FormsModule,
        ReactiveFormsModule,
       // AgmSnazzyInfoWindowModule,

        // Components
        TaMapToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCheckboxComponent,
        //TaMapMarkerDropdownComponent,
        TaGpsProgressbarComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TelematicModule {}
