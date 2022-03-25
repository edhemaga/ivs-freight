import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationComponent } from './violation.component';
import { ViolationRoutingModule } from './violation-routing.module';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';



@NgModule({
  declarations: [ViolationComponent],
  imports: [
    CommonModule, ViolationRoutingModule, TruckassistTableModule
  ]
})
export class ViolationModule { }
