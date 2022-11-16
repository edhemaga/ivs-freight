import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmTruckTrailerComponent } from './pm-truck-trailer.component';
import { PMRoutingModule } from './repair-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

@NgModule({
  declarations: [PmTruckTrailerComponent],
  imports: [CommonModule, PMRoutingModule, TruckassistTableModule],
})
export class PmTruckTrailerModule {}
