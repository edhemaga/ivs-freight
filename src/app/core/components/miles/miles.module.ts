import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MilesRoutingModule } from './miles-routing.module';
import { MilesComponent } from './miles/miles.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';


@NgModule({
  declarations: [
    MilesComponent
  ],
  imports: [
    CommonModule,
    MilesRoutingModule,
    TruckassistTableModule
  ]
})
export class MilesModule { }
