import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentRoutingModule } from './accident-routing.module';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';
import { AccidentTableComponent } from './accident-table/accident-table.component';

@NgModule({
  declarations: [AccidentTableComponent],
  imports: [CommonModule, AccidentRoutingModule, TruckassistTableModule],
})
export class AccidentModule {}
