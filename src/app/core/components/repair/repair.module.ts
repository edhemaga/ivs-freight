import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairTableComponent } from './repair-table/repair-table.component';
import { RepairRoutingModule } from './repair-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

@NgModule({
  declarations: [RepairTableComponent],
  imports: [CommonModule, RepairRoutingModule, TruckassistTableModule],
})
export class RepairModule {}
