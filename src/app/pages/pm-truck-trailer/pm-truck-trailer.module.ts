import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { PMRoutingModule } from '@pages/pm-truck-trailer/pm-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { PmTableComponent } from '@pages/pm-truck-trailer/pages/pm-table/pm-table.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { PmCardComponent } from '@pages/pm-truck-trailer/pages/pm-card/pm-card.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaProgresBarComponent } from '@shared/components/ta-progres-bar/ta-progres-bar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaDropdownMenuComponent } from 'ca-components';

// pipes
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';
import { ValueByStringPathPipe } from '@shared/pipes/value-by-string-path.pipe';
import { CardValuePipe } from '@shared/pipes';

// store
import { StoreModule } from '@ngrx/store';
import { pmCardModalReducer } from '@pages/pm-truck-trailer/pages/pm-card-modal/state';

@NgModule({
    declarations: [PmTableComponent, PmCardComponent],
    imports: [
        // modules
        CommonModule,
        PMRoutingModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // compenents
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaNoteComponent,
        CaDropdownMenuComponent,
        TaProgresBarComponent,
        TaAppTooltipV2Component,

        // pipes
        FlipCardsPipe,
        ValueByStringPathPipe,
        FlipCardsPipe,
        CardValuePipe,

        // store
        StoreModule.forFeature('pmCardData', pmCardModalReducer),
    ],
})
export class PmTruckTrailerModule {}
