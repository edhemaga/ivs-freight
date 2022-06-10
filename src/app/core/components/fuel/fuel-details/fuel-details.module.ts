import { FuelDetailsComponent } from './fuel-details.component';
import { FuelDetailsItemComponent } from './fuel-details-item/fuel-details-item.component';

import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { FuelDetailsRoutes } from './fuel-details.routing';

@NgModule({
  declarations: [
    FuelDetailsComponent,
    FuelDetailsItemComponent,
   
  ],
  exports:[SharedModule],

  imports: [
    CommonModule,
    SharedModule,
    FuelDetailsRoutes,
    TruckassistProgressExpirationModule,
  ]
})
export class FuelDetailsModule {}
