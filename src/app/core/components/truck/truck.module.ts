import { TruckRoutingModule } from './truck-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckTableComponent } from './truck-table/truck-table.component';

import { TruckCardComponent } from './truck-card/truck-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TaThousandSeparatorPipe } from '../../pipes/taThousandSeparator.pipe';

@NgModule({
    declarations: [TruckTableComponent, TruckCardComponent],
    imports: [
        CommonModule,
        TruckRoutingModule,
        AngularSvgIconModule,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent,
        TaThousandSeparatorPipe
    ],
})
export class TruckModule {}
