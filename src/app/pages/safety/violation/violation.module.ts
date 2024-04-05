import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { ViolationRoutingModule } from './violation-routing.module';

// components
import { ViolationTableComponent } from './pages/violation-table/violation-table.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
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
        AppTooltipComponent,
        TaTableToolbarComponent,
        TaTableHeadComponent,
        TaTableBodyComponent,
        NgbModule,
        FormatDatePipe,
    ],
})
export class ViolationModule {}
