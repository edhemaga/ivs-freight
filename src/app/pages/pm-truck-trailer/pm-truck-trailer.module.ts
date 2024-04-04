// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PMRoutingModule } from './pm-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Compenents
import { PmTableComponent } from './pages/pm-table/pm-table.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { PmCardComponent } from './pages/pm-card/pm-card.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaProgresBarComponent } from 'src/app/shared/components/ta-progres-bar/ta-progres-bar.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';

@NgModule({
    declarations: [PmTableComponent, PmCardComponent],
    imports: [
        // Modules
        CommonModule,
        PMRoutingModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // Compenents
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,
        AppTooltipComponent,
    ],
})
export class PmTruckTrailerModule {}
