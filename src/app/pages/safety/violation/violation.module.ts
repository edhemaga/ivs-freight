import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationRoutingModule } from './violation-routing.module';
import { ViolationTableComponent } from './violation-table/violation-table.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';

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
        formatDatePipe,
    ],
})
export class ViolationModule {}
