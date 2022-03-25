import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentComponent } from './accident.component';
import { AccidentRoutingModule } from './accident-routing.module';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';

@NgModule({
  declarations: [AccidentComponent],
  imports: [CommonModule, AccidentRoutingModule, TruckassistTableModule],
})
export class AccidentModule {}
