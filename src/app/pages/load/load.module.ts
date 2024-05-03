//modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRoutingModule } from '@pages/load/load-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { LoadTableComponent } from '@pages/load/pages/load-table/load-table.component';
import { LoadCardsContainerComponent } from './pages/load-cards-container/load-cards-container.component';
import { LoadDetailsModule } from '@pages/load/pages/load-details/load-details.module';
import { LoadCardComponent } from '@pages/load/pages/load-cards-container/components/load-card/load-card.component';

import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';

import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';

import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

//pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { TrackByPropertyPipe } from '@shared/pipes/track-by-property.pipe';

@NgModule({
    declarations: [LoadTableComponent, LoadCardsContainerComponent],
    imports: [
        //modules
        CommonModule,
        LoadRoutingModule,
        AngularSvgIconModule,
        LoadDetailsModule,
        NgbTooltipModule,

        //components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaAppTooltipV2Component,
        LoadCardComponent,

        //pipes
        FormatDatePipe,
        TrackByPropertyPipe,
    ],
})
export class LoadModule {}
