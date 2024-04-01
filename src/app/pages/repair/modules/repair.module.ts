// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RepairRoutingModule } from '../routing/repair-routing.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Components
import { RepairTableComponent } from '../pages/repair-table/repair-table.component';
import { RepairCardComponent } from '../components/repair-card/repair-card.component';
import { MapListCardComponent } from 'src/app/core/components/shared/map-list-card/map-list-card.component';
import { MapListComponent } from 'src/app/core/components/shared/map-list/map-list.component';
import { MapsComponent } from 'src/app/core/components/shared/maps/maps.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TableCardDropdownActionsComponent } from 'src/app/core/components/standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';

// Pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

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
