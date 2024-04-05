import { FuelDetailsComponent } from './fuel-details.component';
import { FuelDetailsItemComponent } from './components/fuel-details-item/fuel-details-item.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuelDetailsRoutes } from './fuel-details.routing';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

@NgModule({
    declarations: [FuelDetailsComponent, FuelDetailsItemComponent],
    exports: [SharedModule],

    imports: [
        CommonModule,
        SharedModule,
        FuelDetailsRoutes,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        FormatDatePipe,
    ],
})
export class FuelDetailsModule {}
