import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverTableComponent } from './driver-table/driver-table.component';
import { DriverRoutingModule } from './driver-routing.module';
import { DriverCardComponent } from './driver-card/driver-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { formatDatePipe } from '../../pipes/formatDate.pipe';
@NgModule({
    declarations: [DriverTableComponent, DriverCardComponent],

    imports: [
        CommonModule,
        DriverRoutingModule,
        AngularSvgIconModule,
        SharedModule,
        AppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent,
        formatDatePipe
    ],
})
export class DriverModule {}
