import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailerTableComponent } from './trailer-table/trailer-table.component';
import { TrailerRoutingModule } from './trailer-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TaThousandSeparatorPipe } from '../../pipes/taThousandSeparator.pipe';
import { formatDatePipe } from '../../pipes/formatDate.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
    declarations: [TrailerTableComponent],
    imports: [
        CommonModule,
        TrailerRoutingModule,
        AppTooltipComponent,
        AngularSvgIconModule,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        NgbModule,
        TaThousandSeparatorPipe,
        formatDatePipe
    ],
})
export class TrailerModule {}
