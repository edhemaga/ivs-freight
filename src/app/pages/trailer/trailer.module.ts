//modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { TrailerRoutingModule } from './trailer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';

// components
import { TrailerTableComponent } from './pages/trailer-table/trailer-table.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaProgresBarComponent } from 'src/app/shared/components/ta-progres-bar/ta-progres-bar.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
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
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,

        // pipes
        TaThousandSeparatorPipe,
        formatDatePipe,
    ],
})
export class TrailerModule {}
