import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { OwnerRoutingModule } from '@pages/owner/owner-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// pipes
import { MaskNumberPipe } from '@pages/owner/pages/owner-card/pipes/mask-number.pipe';
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';

// components
import { OwnerTableComponent } from '@pages/owner/pages//owner-table/owner-table.component';
import { OwnerCardComponent } from '@pages/owner/pages//owner-card/owner-card.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { CaDropdownMenuComponent } from 'ca-components';

@NgModule({
    declarations: [OwnerTableComponent, OwnerCardComponent],
    imports: [
        // modules
        CommonModule,
        OwnerRoutingModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // pipes
        MaskNumberPipe,
        FlipCardsPipe,

        // components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TaAppTooltipV2Component,
        CaDropdownMenuComponent,
    ],
})
export class OwnerModule {}
