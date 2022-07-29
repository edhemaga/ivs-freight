import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentRoutingModule } from './accident-routing.module';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';
import { AccidentTableComponent } from './accident-table/accident-table.component';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

@NgModule({
  declarations: [AccidentTableComponent],
  imports: [
    CommonModule, 
    AccidentRoutingModule, 
    TruckassistTableModule,
    AgmSnazzyInfoWindowModule,
    AgmCoreModule,
    SharedModule
  ],
})
export class AccidentModule {}
