import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuelTableComponent } from './fuel-table/fuel-table.component';
import { FuelRoutingModule } from './fuel-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

@NgModule({
  declarations: [FuelTableComponent],
  exports:[TruckassistTableModule],
  imports: [
    CommonModule, 
    FuelRoutingModule, 
    TruckassistTableModule,
    AgmSnazzyInfoWindowModule,
    AgmCoreModule,
    SharedModule
  ],
})
export class FuelModule {}
