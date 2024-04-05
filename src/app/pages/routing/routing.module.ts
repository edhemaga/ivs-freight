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
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

//Components
import { TaMapToolbarComponent } from 'src/app/shared/components/ta-map-toolbar/ta-map-toolbar.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TaInputAddressDropdownComponent } from 'src/app/shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaDetailsDropdownComponent } from 'src/app/shared/components/ta-details-dropdown/ta-details-dropdown';

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
        AppTooltipComponent,
        TaInputAddressDropdownComponent,
        TaDetailsDropdownComponent,

        // Pipes
        ThousandSeparatorPipe,
    ],
})
export class RoutingModule {}
