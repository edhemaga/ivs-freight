//modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { TrailerRoutingModule } from './trailer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

// components
import { TrailerTableComponent } from './pages/trailer-table/trailer-table.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaProgresBarComponent } from 'src/app/shared/components/ta-progres-bar/ta-progres-bar.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
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
        AppTooltipComponent,
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,

        // pipes
        ThousandSeparatorPipe,
        FormatDatePipe,
    ],
})
export class TrailerModule {}
