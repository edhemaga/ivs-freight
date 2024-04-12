import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { FuelDetailsComponent } from '@pages/fuel/pages/fuel-details/fuel-details.component';
import { FuelDetailsItemComponent } from '@pages/fuel/pages/fuel-details/components/fuel-details-item/fuel-details-item.component';

// modules
import { FuelDetailsRoutingModule } from '@pages/fuel/pages/fuel-details/fuel-details-routing.module';
import { SharedModule } from '@shared/shared.module';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

@NgModule({
    declarations: [FuelDetailsComponent, FuelDetailsItemComponent],
    exports: [SharedModule],

    imports: [
        CommonModule,
        SharedModule,
        FuelDetailsRoutingModule,
        TaTableBodyComponent,
        TaTableHeadComponent,
        FormatDatePipe,
    ],
})
export class FuelDetailsModule {}
