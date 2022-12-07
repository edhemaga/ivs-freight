import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchRoutingModule } from './dispatch-routing.module';
import { DispatchComponent } from './dispatch/dispatch.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { DispatchTableComponent } from './dispatch-table/dispatch-table.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DispatchComponent,
    DispatchTableComponent
  ],
  imports: [
    AngularSvgIconModule,
    CommonModule,
    DispatchRoutingModule,
    TruckassistTableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DispatchModule { }
