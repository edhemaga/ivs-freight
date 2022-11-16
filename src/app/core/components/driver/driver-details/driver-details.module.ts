import { DriverDetailsCardComponent } from './../driver-details-card/driver-details-card.component';
import { DriverDrugAlcoholModalComponent } from '../../modals/driver-modal/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverDetailsComponent } from './driver-details.component';
import { DriverDetailsRoutes } from './driver-details.routing';
import { DriverDetailsItemComponent } from './driver-details-item/driver-details-item.component';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { DriverMvrModalComponent } from '../../modals/driver-modal/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from '../../modals/driver-modal/driver-medical-modal/driver-medical-modal.component';
import { DriverCdlModalComponent } from '../../modals/driver-modal/driver-cdl-modal/driver-cdl-modal.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    DriverDetailsComponent,
    DriverDetailsItemComponent,
    DriverDetailsCardComponent,
    // ModalsA
    DriverCdlModalComponent,
    DriverDrugAlcoholModalComponent,
    DriverMedicalModalComponent,
    DriverMvrModalComponent,
  ],
  exports: [DriverDetailsCardComponent, SharedModule],

  imports: [
    CommonModule,
    DriverDetailsRoutes,
    SharedModule,
    TruckassistProgressExpirationModule,
  ],
})
export class DriverDetailsModule {}
