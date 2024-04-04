import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { ViolationRoutingModule } from './violation-routing.module';

// components
import { ViolationTableComponent } from './pages/violation-table/violation-table.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';

// pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

@NgModule({
    declarations: [ViolationTableComponent],
    imports: [
        CommonModule,
        ViolationRoutingModule,
        AppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableHeadComponent,
        TruckassistTableBodyComponent,
        NgbModule,
        FormatDatePipe,
    ],
})
export class ViolationModule {}
