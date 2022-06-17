import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuelTableComponent } from './fuel-table/fuel-table.component';
import { FuelRoutingModule } from './fuel-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

@NgModule({
  declarations: [FuelTableComponent],
  exports:[TruckassistTableModule],
  imports: [CommonModule, FuelRoutingModule, TruckassistTableModule],
})
export class FuelModule {}
