import { FuelDetailsComponent } from './fuel-details.component';
import { FuelDetailsItemComponent } from './components/fuel-details-item/fuel-details-item.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuelDetailsRoutes } from './fuel-details.routing';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

@NgModule({
    declarations: [FuelDetailsComponent, FuelDetailsItemComponent],
    exports: [SharedModule],

    imports: [
        CommonModule,
        SharedModule,
        FuelDetailsRoutes,
        TaTableBodyComponent,
        TaTableHeadComponent,
        FormatDatePipe,
    ],
})
export class FuelDetailsModule {}
