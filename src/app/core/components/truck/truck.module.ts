import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckTableComponent } from './truck-table/truck-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { TruckRoutingModule } from './truck-routing.module';


@NgModule({
  declarations: [TruckTableComponent],
  imports: [CommonModule, TruckRoutingModule,  TruckassistTableModule],
})
export class TruckModule {}
