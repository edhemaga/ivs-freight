import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { LoadRoutingModule } from '@pages/load/load-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { LoadTableComponent } from '@pages/load/pages/load-table/load-table.component';
import { LoadCardComponent } from '@pages/load/pages/load-card/load-card.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { TrackByPropertyPipe } from '@shared/pipes/track-by-property.pipe';
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';
import { CardValuePipe } from '@shared/pipes/card-value.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';

// store
import { StoreModule } from '@ngrx/store';
import { loadCardModalReducer } from '@pages/load/pages/load-card-modal/state/load-card-modal.reducer';

@NgModule({
    declarations: [LoadTableComponent, LoadCardComponent],
    imports: [
        // modules
        CommonModule,
        LoadRoutingModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaAppTooltipV2Component,
        TaProfileImagesComponent,

        // pipes
        FormatDatePipe,
        TrackByPropertyPipe,
        FlipCardsPipe,
        CardValuePipe,
        FormatCurrencyPipe,
        LoadStatusColorPipe,

        StoreModule.forFeature('loadCardData', loadCardModalReducer),
    ],
})
export class LoadModule {}
