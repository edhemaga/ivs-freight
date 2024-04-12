//modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { TrailerRoutingModule } from './trailer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// components
import { TrailerTableComponent } from './pages/trailer-table/trailer-table.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaProgresBarComponent } from '@shared/components/ta-progres-bar/ta-progres-bar.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TrailerCardComponent } from './pages/trailer-card/trailer-card.component';
@NgModule({
    declarations: [TrailerTableComponent, TrailerCardComponent],
    imports: [
        // mmodules
        CommonModule,
        TrailerRoutingModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,

        // pipes
        ThousandSeparatorPipe,
        FormatDatePipe,
    ],
})
export class TrailerModule {}
