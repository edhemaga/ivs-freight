import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairTableComponent } from './repair-table/repair-table.component';
import { RepairRoutingModule } from './repair-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { RepairCardComponent } from './repair-card/repair-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [RepairTableComponent, RepairCardComponent],
  imports: [
    CommonModule,
    RepairRoutingModule,
    TruckassistTableModule,
    AngularSvgIconModule,
    SharedModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
  ],
})
export class RepairModule {}
