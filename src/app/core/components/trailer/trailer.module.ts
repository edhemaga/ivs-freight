//modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailerRoutingModule } from './trailer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { TrailerTableComponent } from './trailer-table/trailer-table.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistCardsComponent } from '../shared/truckassist-cards/truckassist-cards.component';

//pipes
import { TaThousandSeparatorPipe } from '../../pipes/taThousandSeparator.pipe';
import { formatDatePipe } from '../../pipes/formatDate.pipe';
@NgModule({
    declarations: [TrailerTableComponent],
    imports: [
        //modules
        CommonModule,
        TrailerRoutingModule,
        AngularSvgIconModule,
        NgbModule,

        //components
        AppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TruckassistCardsComponent,

        //pipes
        TaThousandSeparatorPipe,
        formatDatePipe,
    ],
})
export class TrailerModule {}
