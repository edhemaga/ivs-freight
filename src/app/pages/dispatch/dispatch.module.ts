// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DispatchRoutingModule } from './dispatch-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Components
import { DispatchComponent } from './dispatch/dispatch.component';
import { DispatchTableComponent } from './dispatch-table/dispatch-table.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TaInputDropdownComponent } from 'src/app/core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { InputAddressDropdownComponent } from 'src/app/core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { TaStatusSwitchComponent } from 'src/app/core/components/shared/ta-status-switch/ta-status-switch.component';
import { GpsProgressbarComponent } from 'src/app/core/components/shared/gps-progressbar/gps-progressbar.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { TaPickupDeliveryComponent } from 'src/app/core/components/shared/ta-pickup-delivery/ta-pickup-delivery.component';

// Pipes
import { ColorFinderPipe } from './pipes/color-finder.pipe';
import { HosFilterPipe } from './pipes/hos-filter.pipe';
import { TooltipWidthPipe } from './pipes/tooltip-width.pipe';
import { CdkIdPipe } from 'src/app/core/pipes/cdkid.pipe';
import { CdkConnectPipe } from 'src/app/core/pipes/cdkconnect.pipe';
import { HosTimePipe } from 'src/app/core/pipes/hostime';

@NgModule({
  declarations: [
    // Components
    DispatchComponent,
    DispatchTableComponent,

    // Pipes
    ColorFinderPipe,
    HosFilterPipe,
    TooltipWidthPipe
  ],
  imports: [
    // Modules
    AngularSvgIconModule,
    CommonModule,
    DispatchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,

    // Pipes
    CdkIdPipe,
    CdkConnectPipe,
    HosTimePipe,

    // Components
    AppTooltipComponent,
    TruckassistTableToolbarComponent,
    TaInputDropdownComponent,
    InputAddressDropdownComponent,
    TaStatusSwitchComponent,
    GpsProgressbarComponent,
    TaNoteComponent,
    TaPickupDeliveryComponent
  ]
})
export class DispatchModule { }
