import { SharedModule } from 'src/app/core/shared/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverDetailsComponent } from './driver-details.component';
import { DriverDetailsRoutes } from './driver-details.routing';
import { DriverDetailsItemComponent } from './driver-details-item/driver-details-item.component';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RenderMultipleItemsPipe } from './driver-details-item/renderMultipleItems.pipe';
import { DriverDetailsCardComponent } from './driver-details-card/driver-details-card.component';

@NgModule({
  declarations: [
    DriverDetailsComponent,
    DriverDetailsItemComponent,
    DriverDetailsCardComponent,
    RenderMultipleItemsPipe,
    
  ],
  imports: [
    CommonModule,
    DriverDetailsRoutes,
    SharedModule,
    TruckassistProgressExpirationModule,
    TextFieldModule,
    SharedModule
  ],
})
export class DriverDetailsModule {}
