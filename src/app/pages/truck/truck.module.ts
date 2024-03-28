//modules
import { TruckRoutingModule } from './truck-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { TruckTableComponent } from './truck-table/truck-table.component';
import { TruckCardComponent } from './truck-card/truck-card.component';

import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

import { TableCardDropdownActionsComponent } from '../standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';
import { TaNoteComponent } from '../shared/ta-note/ta-note.component';
import { ProgresBarComponent } from '../standalone-components/progres-bar/progres-bar.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';

//pipes
import { TaThousandSeparatorPipe } from '../../pipes/taThousandSeparator.pipe';
@NgModule({
    declarations: [TruckTableComponent, TruckCardComponent],
    imports: [
        //modules
        CommonModule,
        TruckRoutingModule,
        AngularSvgIconModule,
        NgbModule,

        //components
        AppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaNoteComponent,
        TableCardDropdownActionsComponent,
        ProgresBarComponent,

        //pipes
        TaThousandSeparatorPipe,
        DatePipe,
    ],
})
export class TruckModule {}
