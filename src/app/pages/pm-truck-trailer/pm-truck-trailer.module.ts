// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PMRoutingModule } from './repair-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Compenents
import { PmTruckTrailerComponent } from './pm-truck-trailer.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { PmCardComponent } from './pm-card/pm-card.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { ProgresBarComponent } from 'src/app/core/components/standalone-components/progres-bar/progres-bar.component';
import { TableCardDropdownActionsComponent } from 'src/app/core/components/standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';

@NgModule({
    declarations: [PmTruckTrailerComponent, PmCardComponent],
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
        TableCardDropdownActionsComponent,
        ProgresBarComponent,
        AppTooltipComponent,
    ],
})
export class PmTruckTrailerModule {}
