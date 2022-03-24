import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailerTableComponent } from './trailer-table/trailer-table.component';
import { TrailerRoutingModule } from './trailer-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

@NgModule({
  declarations: [TrailerTableComponent],
  imports: [CommonModule, TrailerRoutingModule, TruckassistTableModule],
})
export class TrailerModule {}
