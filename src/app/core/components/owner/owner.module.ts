import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerTableComponent } from './owner-table/owner-table.component';
import { OwnerRoutingModule } from './owner-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { OwnerCardComponent } from './owner-card/owner-card.component';

@NgModule({
  declarations: [OwnerTableComponent, OwnerCardComponent],
  imports: [CommonModule, OwnerRoutingModule, TruckassistTableModule],
})
export class OwnerModule {}
