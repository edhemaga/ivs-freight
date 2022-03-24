import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsCardComponent } from './settings-card.component';
import { SharedModule } from 'src/app/core/shared/shared/shared.module';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TruckassistProgressExpirationModule,
  ],
  declarations: [SettingsCardComponent],
  exports: [
    SettingsCardComponent
  ]
})
export class SettingsCardModule { }
