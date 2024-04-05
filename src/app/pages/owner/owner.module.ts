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
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
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
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        AppTooltipComponent,
    ],
})
export class OwnerModule {}
