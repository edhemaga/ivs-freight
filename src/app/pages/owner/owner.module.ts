// Module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerRoutingModule } from './owner-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Pipe
import { MaskNumberPipe } from 'src/app/core/pipes/maskNumber.pipe';

// Components
import { OwnerTableComponent } from './owner-table/owner-table.component';
import { OwnerCardComponent } from './owner-card/owner-card.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TaInputDropdownTableComponent } from 'src/app/core/components/standalone-components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TableCardDropdownActionsComponent } from 'src/app/core/components/standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';

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
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TableCardDropdownActionsComponent,
        AppTooltipComponent,
    ],
})
export class OwnerModule {}
