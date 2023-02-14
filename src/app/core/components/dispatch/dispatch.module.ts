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
    HosTimePipe
  ]
})
export class DispatchModule { }
