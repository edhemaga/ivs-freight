//modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { TrailerRoutingModule } from '@pages/trailer/trailer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';
import { NgForLengthFilterPipe } from '@shared/pipes/ng-for-length-filter.pipe';
import { CardValuePipe } from '@shared/pipes/card-value.pipe';

// components
import { TrailerTableComponent } from '@pages/trailer/pages/trailer-table/trailer-table.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaProgresBarComponent } from '@shared/components/ta-progres-bar/ta-progres-bar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TrailerCardComponent } from '@pages/trailer/pages/trailer-card/trailer-card.component';
import { TaStateImageTextComponent } from '@shared/components/ta-state-image-text/ta-state-image-text.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { CaDropdownMenuComponent } from 'ca-components';

// store
import { StoreModule } from '@ngrx/store';
import { trailerCardModalReducer } from '@pages/trailer/pages/trailer-card-modal/state/trailer-card-modal.reducer';

@NgModule({
    declarations: [TrailerTableComponent, TrailerCardComponent],
    imports: [
        // mmodules
        CommonModule,
        TrailerRoutingModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaNoteComponent,
        TaProgresBarComponent,
        TaStateImageTextComponent,
        TaProfileImagesComponent,
        CaDropdownMenuComponent,

        // pipes
        ThousandSeparatorPipe,
        FormatDatePipe,
        FlipCardsPipe,
        NgForLengthFilterPipe,
        CardValuePipe,

        StoreModule.forFeature('trailerCardData', trailerCardModalReducer),
    ],
})
export class TrailerModule {}
