//modules
import { TruckRoutingModule } from './truck-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { TruckTableComponent } from './pages/truck-table/truck-table.component';
import { TruckCardComponent } from './pages/truck-card/truck-card.component';

import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaProgresBarComponent } from 'src/app/shared/components/ta-progres-bar/ta-progres-bar.component';

//pipes

@NgModule({
    declarations: [TruckTableComponent, TruckCardComponent],
    imports: [
        //modules
        CommonModule,
        TruckRoutingModule,
        AngularSvgIconModule,
        NgbModule,

        //components
        AppTooltipComponent,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,

        //pipes
        ThousandSeparatorPipe,
        DatePipe,
    ],
})
export class TruckModule {}
