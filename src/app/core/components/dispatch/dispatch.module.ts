import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchRoutingModule } from './dispatch-routing.module';
import { DispatchComponent } from './dispatch/dispatch.component';
import { DispatchTableComponent } from './dispatch-table/dispatch-table.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorFinderPipe } from './pipes/color-finder.pipe';
import { HosFilterPipe } from './pipes/hos-filter.pipe';
import { TooltipWidthPipe } from './pipes/tooltip-width.pipe';
import { CdkIdPipe } from '../../pipes/cdkid.pipe';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { CdkConnectPipe } from '../../pipes/cdkconnect.pipe';
import { HosTimePipe } from '../../pipes/hostime';
import { TaInputDropdownComponent } from '../shared/ta-input-dropdown/ta-input-dropdown.component';
import { InputAddressDropdownComponent } from '../shared/input-address-dropdown/input-address-dropdown.component';
import { TaStatusSwitchComponent } from '../shared/ta-status-switch/ta-status-switch.component';
import { GpsProgressbarComponent } from '../shared/gps-progressbar/gps-progressbar.component';
import { TaNoteComponent } from '../shared/ta-note/ta-note.component';

@NgModule({
  declarations: [
    DispatchComponent,
    DispatchTableComponent,
    ColorFinderPipe,
    HosFilterPipe,
    TooltipWidthPipe
  ],
  imports: [
    AngularSvgIconModule,
    CommonModule,
    DispatchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CdkIdPipe,
    AppTooltipComponent,
    TruckassistTableToolbarComponent,
    CdkConnectPipe,
    HosTimePipe,
    TaInputDropdownComponent,
    InputAddressDropdownComponent,
    TaStatusSwitchComponent,
    GpsProgressbarComponent,
    TaNoteComponent
  ]
})
export class DispatchModule { }
