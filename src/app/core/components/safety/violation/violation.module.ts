import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationRoutingModule } from './violation-routing.module';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';
import { ViolationTableComponent } from './violation-table/violation-table.component';
import { ViolationDetailsPageComponent } from './violation-details-page/violation-details-page.component';
import { ViolationDetailsSingleComponent } from './violation-details-page/violation-details-single/violation-details-single.component';
import { ViolationCardViewComponent } from './violation-card-view/violation-card-view.component';

@NgModule({
   declarations: [ViolationTableComponent],
   imports: [CommonModule, ViolationRoutingModule, TruckassistTableModule],
})
export class ViolationModule {}
