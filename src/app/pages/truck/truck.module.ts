import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

//modules
import { TruckRoutingModule } from '@pages/truck/truck-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { TruckTableComponent } from '@pages/truck/pages/truck-table/truck-table.component';
import { TruckCardComponent } from '@pages/truck/pages/truck-card/truck-card.component';

import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaProgresBarComponent } from '@shared/components/ta-progres-bar/ta-progres-bar.component';

//pipes
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { CardValuePipe } from '@shared/pipes/card-value.pipe';

//store
import { StoreModule } from '@ngrx/store';
import { truckCardModalReducer } from '@pages/truck/pages/truck-card-modal/state/truck-card-modal.reducer';

@NgModule({
    declarations: [TruckTableComponent, TruckCardComponent],
    imports: [
        //modules
        CommonModule,
        TruckRoutingModule,
        AngularSvgIconModule,
        NgbModule,

        //components
        TaAppTooltipV2Component,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,

        //pipes
        ThousandSeparatorPipe,
        DatePipe,
        FlipCardsPipe,
        FormatDatePipe,
        CardValuePipe,

        StoreModule.forFeature('truckCardData', truckCardModalReducer),
    ],
})
export class TruckModule {}
