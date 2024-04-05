// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RepairRoutingModule } from './repair-routing.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Components
import { RepairTableComponent } from './pages/repair-table/repair-table.component';
import { RepairCardComponent } from './pages/repair-card/repair-card.component';
import { TaMapListCardComponent } from 'src/app/shared/components/ta-map-list-card/ta-map-list-card.component';
import { TaMapListComponent } from 'src/app/shared/components/ta-map-list/ta-map-list.component';
import { TaMapsComponent } from 'src/app/shared/components/ta-maps/ta-maps.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

// Pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

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
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaMapsComponent,
        TaMapListCardComponent,
        TaMapListComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        AppTooltipComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class RepairModule {}
