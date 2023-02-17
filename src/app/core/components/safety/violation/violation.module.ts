import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationRoutingModule } from './violation-routing.module';
import { ViolationTableComponent } from './violation-table/violation-table.component';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from '../../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

@NgModule({
    declarations: [ViolationTableComponent],
    imports: [CommonModule, ViolationRoutingModule, AppTooltipComponent, TruckassistTableToolbarComponent, formatDatePipe],
})
export class ViolationModule {}
