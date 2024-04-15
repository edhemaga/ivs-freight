import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { ViolationRoutingModule } from '@pages/safety/violation/violation-routing.module';

// components
import { ViolationTableComponent } from '@pages/safety/violation/pages/violation-table/violation-table.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

@NgModule({
    declarations: [ViolationTableComponent],
    imports: [
        CommonModule,
        ViolationRoutingModule,
        TaAppTooltipV2Component,
        TaTableToolbarComponent,
        TaTableHeadComponent,
        TaTableBodyComponent,
        NgbModule,
        FormatDatePipe,
    ],
})
export class ViolationModule {}
