import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { ViolationDetailsRoutes } from './violation-details.routing';
import { ViolationDetailsPageComponent } from './violation-details-page.component';
import { ViolationDetailsSingleComponent } from './violation-details-single/violation-details-single.component';
import { ViolationCardViewComponent } from '../violation-card-view/violation-card-view.component';
import { TruckassistProgressExpirationModule } from '../../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { TruckassistTableModule } from '../../../shared/truckassist-table/truckassist-table.module';

@NgModule({
  declarations: [
    ViolationDetailsPageComponent,
    ViolationDetailsSingleComponent,
    ViolationCardViewComponent,
  ],
  exports: [ViolationCardViewComponent, SharedModule],
  imports: [
    CommonModule,
    ViolationDetailsRoutes,
    TruckassistProgressExpirationModule,
    SharedModule,
    TruckassistTableModule,
  ],
})
export class ViolationDetailsModule {}
