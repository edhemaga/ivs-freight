import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { FuelRoutingModule } from '@pages/fuel/fuel-routing.module';
// import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
// import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '@shared/shared.module';

// Components
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
//import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';
import { TaMapListComponent } from '@shared/components/ta-map-list/ta-map-list.component';
import { TaMapListCardComponent } from '@shared/components/ta-map-list-card/ta-map-list-card.component';
import { FuelTableComponent } from '@pages/fuel/pages/fuel-table/fuel-table.component';
import { CaChartComponent } from 'ca-components';
import { FuelCardComponent } from '@pages/fuel/pages/fuel-card/fuel-card.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';

// Store
import { fuelCardModalReducer } from '@pages/fuel/pages/fuel-card-modal/state';
import { StoreModule } from '@ngrx/store';

// Pipes
import {
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
        // Modules
        CommonModule,
        FuelRoutingModule,
        // AgmSnazzyInfoWindowModule,
        // AgmCoreModule,
        SharedModule,

        // Components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        // TaMapsComponent,
        TaMapListComponent,
        TaMapListCardComponent,
        CaChartComponent,
        TaTableCardDropdownActionsComponent,
        TaNoteComponent,

        // pipes
        FormatDatePipe,
        FormatCurrencyPipe,
        FlipCardsPipe,
        CardValuePipe,
        TableDescriptionTextPipe,

        // store
        StoreModule.forFeature('fuelCardData', fuelCardModalReducer),
    ],
})
export class FuelModule {}
