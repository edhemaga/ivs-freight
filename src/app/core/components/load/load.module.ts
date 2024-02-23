//modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRoutingModule } from './load-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { LoadTableComponent } from './load-table/load-table.component';
import { LoadCardComponent } from './load-card/load-card.component';
import { LoadDetailsModule } from './load-details/load-details.module';

import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistCardsComponent } from '../shared/truckassist-cards/truckassist-cards.component';

import { TaInputDropdownTableComponent } from '../standalone-components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from '../shared/ta-note/ta-note.component';

import { TableCardDropdownActionsComponent } from '../standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';

import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';

//pipes
import { formatDatePipe } from '../../pipes/formatDate.pipe';

@NgModule({
    declarations: [LoadTableComponent, LoadCardComponent],
    imports: [
        //modules
        CommonModule,
        LoadRoutingModule,
        AngularSvgIconModule,
        LoadDetailsModule,
        NgbTooltipModule,

        //components
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TruckassistCardsComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TableCardDropdownActionsComponent,
        AppTooltipComponent,

        //pipes
        formatDatePipe,
    ],
})
export class LoadModule {}
