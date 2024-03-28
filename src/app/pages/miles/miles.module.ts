import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MilesRoutingModule } from './miles-routing.module';
import { MilesComponent } from './miles/miles.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

@NgModule({
    declarations: [MilesComponent],
    imports: [
        CommonModule,
        MilesRoutingModule,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
    ],
})
export class MilesModule {}
