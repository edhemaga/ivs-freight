import { TruckassistProgressExpirationModule } from './../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsCardComponent } from './settings-card/settings-card.component';
import { SharedModule } from 'src/app/core/shared/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TruckassistProgressExpirationModule
  ],
  declarations: [
    SettingsCardComponent
  ],
  exports: [
    SettingsCardComponent
  ]
})
export class SettingsSharedModule { }
