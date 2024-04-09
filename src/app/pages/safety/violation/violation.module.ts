import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { ViolationRoutingModule } from './violation-routing.module';

// components
import { ViolationTableComponent } from './pages/violation-table/violation-table.component';
import { TaAppTooltipV2Component } from 'src/app/shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';

// pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

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
