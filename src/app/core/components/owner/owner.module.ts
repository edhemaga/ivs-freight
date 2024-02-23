// Module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerRoutingModule } from './owner-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Pipe
import { MaskNumberPipe } from '../../pipes/maskNumber.pipe';

// Components
import { OwnerTableComponent } from './owner-table/owner-table.component';
import { OwnerCardComponent } from './owner-card/owner-card.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TaInputDropdownTableComponent } from '../standalone-components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from '../shared/ta-note/ta-note.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TableCardDropdownActionsComponent } from '../standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';

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
