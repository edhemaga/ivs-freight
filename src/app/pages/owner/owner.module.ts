// Module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerRoutingModule } from './owner-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Pipe
import { MaskNumberPipe } from 'src/app/pages/owner/pages/owner-card/pipes/mask-number.pipe';

// Components
import { OwnerTableComponent } from './pages/owner-table/owner-table.component';
import { OwnerCardComponent } from './pages/owner-card/owner-card.component';
import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaInputDropdownTableComponent } from 'src/app/shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

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
        AppTooltipComponent,
    ],
})
export class OwnerModule {}
