import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { FuelRoutingModule } from '@pages/fuel/fuel-routing.module';
import { SharedModule } from '@shared/shared.module';

// Components
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaMapListComponent } from '@shared/components/ta-map-list/ta-map-list.component';
import { TaMapListCardComponent } from '@shared/components/ta-map-list-card/ta-map-list-card.component';
import { FuelTableComponent } from '@pages/fuel/pages/fuel-table/fuel-table.component';
import {
    CaChartComponent,
    CaProfileImageComponent,
    CaProgressRangeComponent,
} from 'ca-components';
import { FuelCardComponent } from '@pages/fuel/pages/fuel-card/fuel-card.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';

// Store
import { fuelCardModalReducer } from '@pages/fuel/pages/fuel-card-modal/state';
import { StoreModule } from '@ngrx/store';

// directives
import { DescriptionItemsTextCountDirective } from '@shared/directives';

// Pipes
import {
    ActivityTimePipe,
    CardValuePipe,
    FlipCardsPipe,
    FormatCurrencyPipe,
    FormatDatePipe,
} from '@shared/pipes';
import { TableDescriptionTextPipe } from '@shared/components/ta-table/ta-table-body/pipes/table-description-text.pipe';

@NgModule({
    declarations: [FuelTableComponent, FuelCardComponent],
    exports: [],
    imports: [
        // modules
        CommonModule,
        FuelRoutingModule,
        SharedModule,

        // components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaMapListComponent,
        TaMapListCardComponent,
        CaChartComponent,
        TaTableCardDropdownActionsComponent,
        TaNoteComponent,
        CaProfileImageComponent,
        CaProgressRangeComponent,

        // pipes
        FormatDatePipe,
        FormatCurrencyPipe,
        FlipCardsPipe,
        CardValuePipe,
        TableDescriptionTextPipe,
        ActivityTimePipe,

        // directives
        DescriptionItemsTextCountDirective,

        // store
        StoreModule.forFeature('fuelCardData', fuelCardModalReducer),
    ],
})
export class FuelModule {}
