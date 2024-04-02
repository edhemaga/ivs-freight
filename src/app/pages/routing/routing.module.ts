import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { RoutingRoutingModule } from './routing-routing.module';
import { RoutingMapComponent } from './pages/routing-map/routing-map.component';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

//Pipes
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';

//Components
import { MapToolbarComponent } from 'src/app/core/components/standalone-components/map-toolbar/map-toolbar.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { InputAddressDropdownComponent } from 'src/app/core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { DetailsDropdownComponent } from 'src/app/core/components/shared/details-page-dropdown/details-dropdown';

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
        MapToolbarComponent,
        AppTooltipComponent,
        InputAddressDropdownComponent,
        DetailsDropdownComponent,

        // Pipes
        TaThousandSeparatorPipe,
    ],
})
export class RoutingModule {}
