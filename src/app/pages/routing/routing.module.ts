import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

//routes
import { RoutingRoutingModule } from './routing-routing.module';
import { RoutingMapComponent } from './pages/routing-map/routing-map.component';

//bootstrap
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

//module
import { AngularSvgIconModule } from 'angular-svg-icon';

//Pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

//Components
import { TaMapToolbarComponent } from '@shared/components/ta-map-toolbar/ta-map-toolbar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';

@NgModule({
    declarations: [RoutingMapComponent],
    imports: [
        // Modules
        CommonModule,
        RoutingRoutingModule,
        DragDropModule,
        AgmCoreModule,
        NgbModule,
        NgbPopoverModule,
        FormsModule,
        ReactiveFormsModule,
        AgmSnazzyInfoWindowModule,
        AngularSvgIconModule,

        // Components
        TaMapToolbarComponent,
        TaAppTooltipV2Component,
        TaInputAddressDropdownComponent,
        TaDetailsDropdownComponent,

        // Pipes
        ThousandSeparatorPipe,
    ],
})
export class RoutingModule {}
