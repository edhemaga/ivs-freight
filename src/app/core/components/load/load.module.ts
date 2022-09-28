import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRoutingModule } from './load-routing.module';
import { LoadTableComponent } from './load-table/load-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { LoadCardComponent } from './load-card/load-card.component';
import { LoadDetailsModule } from './load-details/load-details.module';

@NgModule({
  declarations: [LoadTableComponent, LoadCardComponent],
  imports: [
    CommonModule,
    LoadRoutingModule,
    TruckassistTableModule,
    AngularSvgIconModule,
    LoadDetailsModule,
  ],
})
export class LoadModule {}
