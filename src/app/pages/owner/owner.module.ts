import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { OwnerRoutingModule } from '@pages/owner/owner-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Pipe
import { MaskNumberPipe } from '@pages/owner/pages/owner-card/pipes/mask-number.pipe';

// Components
import { OwnerTableComponent } from '@pages/owner/pages//owner-table/owner-table.component';
import { OwnerCardComponent } from '@pages/owner/pages//owner-card/owner-card.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

@NgModule({
    declarations: [OwnerTableComponent, OwnerCardComponent],
    imports: [
        // Module
        CommonModule,
        OwnerRoutingModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // Pipe
        MaskNumberPipe,

        // Components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaAppTooltipV2Component,
    ],
})
export class OwnerModule {}
