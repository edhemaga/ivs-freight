import { DriverDrugAlcoholModalComponent } from './driver-modals/driver-drugAlcohol-modal/driver-drugAlcohol-modal.component';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverDetailsComponent } from './driver-details.component';
import { DriverDetailsRoutes } from './driver-details.routing';
import { DriverDetailsItemComponent } from './driver-details-item/driver-details-item.component';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RenderMultipleItemsPipe } from './driver-details-item/renderMultipleItems.pipe';
import { DriverDetailsCardComponent } from './driver-details-card/driver-details-card.component';
import { DriverMvrModalComponent } from './driver-modals/driver-mvr-modal/driver-mvr-modal.component';
import { DriverMedicalModalComponent } from './driver-modals/driver-medical-modal/driver-medical-modal.component';
import { DriverCdlModalComponent } from './driver-modals/driver-cdl-modal/driver-cdl-modal.component';

@NgModule({
  declarations: [
    DriverDetailsComponent,
    DriverDetailsItemComponent,
    DriverDetailsCardComponent,
    RenderMultipleItemsPipe,

    // Modals
    DriverCdlModalComponent,
    DriverDrugAlcoholModalComponent,
    DriverMedicalModalComponent,
    DriverMvrModalComponent,
  ],
  imports: [
    CommonModule,
    DriverDetailsRoutes,
    SharedModule,
    TruckassistProgressExpirationModule,
    TextFieldModule,
    SharedModule,
  ],
})
export class DriverDetailsModule {}
