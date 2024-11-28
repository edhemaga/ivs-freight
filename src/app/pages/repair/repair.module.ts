import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RepairRoutingModule } from '@pages/repair/repair-routing.module';
import { SharedModule } from '@shared/shared.module';

// components
import { RepairTableComponent } from '@pages/repair/pages/repair-table/repair-table.component';
import { RepairCardComponent } from '@pages/repair/pages/repair-card/repair-card.component';
import { TaMapListCardComponent } from '@shared/components/ta-map-list-card/ta-map-list-card.component';
import { TaMapListComponent } from '@shared/components/ta-map-list/ta-map-list.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { CaMapComponent } from 'ca-components';
import { TaInputDropdownContactsComponent } from '@shared/components/ta-input-dropdown-contacts/ta-input-dropdown-contacts.component';
import { TaOpenHoursDropdownComponent } from '@shared/components/ta-open-hours-dropdown/ta-open-hours-dropdown.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';
import { NFormatterPipe } from '@shared/pipes/n-formatter.pipe';
import { NgForLengthFilterPipe } from '@shared/pipes/ng-for-length-filter.pipe';
import { CardValuePipe } from '@shared/pipes/card-value.pipe';

// components
import { RepairShopDetailsComponent } from '@pages/repair/pages/repair-shop-details/repair-shop-details.component';

// store
import { StoreModule } from '@ngrx/store';
import { repairCardModalReducer } from '@pages/repair/pages/repair-card-modal/state/repair-card-modal.reducer';

@NgModule({
    declarations: [RepairTableComponent, RepairCardComponent],
    imports: [
        // modules
        CommonModule,
        RepairRoutingModule,
        AngularSvgIconModule,
        SharedModule,

        // components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaMapListCardComponent,
        TaMapListComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaAppTooltipV2Component,
        RepairShopDetailsComponent,
        CaMapComponent,
        TaInputDropdownContactsComponent,
        TaOpenHoursDropdownComponent,

        // Pipes
        FormatDatePipe,
        FlipCardsPipe,
        NFormatterPipe,
        NgForLengthFilterPipe,
        CardValuePipe,

        // store
        StoreModule.forFeature('repairCardData', repairCardModalReducer),
    ],
})
export class RepairModule {}
