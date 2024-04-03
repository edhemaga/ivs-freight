import { FuelDetailsComponent } from './fuel-details.component';
import { FuelDetailsItemComponent } from '../../components/fuel-details-item/fuel-details-item.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuelDetailsRoutes } from './fuel-details.routing';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

@NgModule({
    declarations: [FuelDetailsComponent, FuelDetailsItemComponent],
    exports: [SharedModule],

    imports: [
        CommonModule,
        SharedModule,
        FuelDetailsRoutes,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        FormatDatePipe,
    ],
})
export class FuelDetailsModule {}
