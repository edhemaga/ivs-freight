import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationRoutingModule } from './violation-routing.module';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';
import { ViolationTableComponent } from './violation-table/violation-table.component';

@NgModule({
    declarations: [ViolationTableComponent],
    imports: [CommonModule, ViolationRoutingModule, TruckassistTableModule],
})
export class ViolationModule {}
