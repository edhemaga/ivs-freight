import { TruckRoutingModule } from './truck-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckTableComponent } from './truck-table/truck-table.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

import { TruckCardComponent } from './truck-card/truck-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
    declarations: [TruckTableComponent, TruckCardComponent],
    imports: [
        CommonModule,
        TruckRoutingModule,
        TruckassistTableModule,
        AngularSvgIconModule,
    ],
})
export class TruckModule {}
