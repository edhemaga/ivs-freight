// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RepairRoutingModule } from './repair-routing.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../shared/shared.module';
import { AgmDirectionModule } from 'agm-direction';

// Components
import { RepairTableComponent } from './repair-table/repair-table.component';
import { RepairCardComponent } from './repair-card/repair-card.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { MapsComponent } from '../shared/maps/maps.component';
import { MapListCardComponent } from '../shared/map-list-card/map-list-card.component';
import { MapListComponent } from '../shared/map-list/map-list.component';

import { TaNoteComponent } from '../shared/ta-note/ta-note.component';
import { TableCardDropdownActionsComponent } from '../standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';

// Pipes
import { formatDatePipe } from '../../pipes/formatDate.pipe';

@NgModule({
    declarations: [RepairTableComponent, RepairCardComponent],
    imports: [
        // Modules
        CommonModule,
        RepairRoutingModule,
        AngularSvgIconModule,
        SharedModule,
        AgmCoreModule,
        AgmSnazzyInfoWindowModule,
        AgmDirectionModule,

        // Components
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        MapsComponent,
        MapListCardComponent,
        MapListComponent,
        TaNoteComponent,
        TableCardDropdownActionsComponent,
        AppTooltipComponent,

        // Pipes
        formatDatePipe,
    ],
})
export class RepairModule {}
