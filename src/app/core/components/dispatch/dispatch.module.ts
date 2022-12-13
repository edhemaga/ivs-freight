import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchRoutingModule } from './dispatch-routing.module';
import { DispatchComponent } from './dispatch/dispatch.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { DispatchTableComponent } from './dispatch-table/dispatch-table.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorFinderPipe } from './pipes/color-finder.pipe';
import { HosFilterPipe } from './pipes/hos-filter.pipe';
import { TooltipWidthPipe } from './pipes/tooltip-width.pipe';
import { TaNoteModule } from '../shared/ta-note/ta-note.module';

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
    TruckassistTableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TaNoteModule
  ]
})
export class DispatchModule { }
