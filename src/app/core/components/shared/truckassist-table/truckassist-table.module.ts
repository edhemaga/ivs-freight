import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistTableBodyComponent } from './truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from './truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableToolbarComponent } from './truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistSearchComponent } from '../truckassist-search/truckassist-search.component';
import { TruckassistSearchModule } from '../truckassist-search/truckassist-search.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    TruckassistTableBodyComponent,
    TruckassistTableHeadComponent,
    TruckassistTableToolbarComponent,
  ],
  imports: [CommonModule, TruckassistSearchModule, AngularSvgIconModule],
  exports: [
    TruckassistTableBodyComponent,
    TruckassistTableHeadComponent,
    TruckassistTableToolbarComponent,
  ],
})
export class TruckassistTableModule {}
