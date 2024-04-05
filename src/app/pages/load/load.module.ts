//modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadRoutingModule } from './load-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { LoadTableComponent } from './pages/load-table/load-table.component';
import { LoadCardComponent } from './pages/load-card/load-card.component';
import { LoadDetailsModule } from './pages/load-details/load-details.module';

import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';

import { TaInputDropdownTableComponent } from 'src/app/shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';

import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';

//pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

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
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaInputDropdownTableComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        AppTooltipComponent,

        //pipes
        FormatDatePipe,
    ],
})
export class LoadModule {}
