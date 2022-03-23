import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRoutingModule } from './load-routing.module';
import { LoadTableComponent } from './load-table/load-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

@NgModule({
  declarations: [LoadTableComponent],
  imports: [CommonModule, LoadRoutingModule, TruckassistTableModule],
})
export class LoadModule {}
