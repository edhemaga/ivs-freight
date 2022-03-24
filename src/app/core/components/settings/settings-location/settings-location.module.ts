import { SettingsRepairShopComponent } from './settings-repair-shop/settings-repair-shop.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsLocationComponent } from './settings-location.component';
import { SettingsLocationRoutes } from './settings-location.routing';
import { SettingsParkingComponent } from './settings-parking/settings-parking.component';
import { SettingsOfficeComponent } from './settings-office/settings-office.component';
import { SettingsTerminalComponent } from './settings-terminal/settings-terminal.component';
import { SharedModule } from 'src/app/core/shared/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsCardModule } from '../settings-card/settings-card.module';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsLocationRoutes,
    SharedModule,
    SettingsCardModule,
    TruckassistProgressExpirationModule
  ],
  declarations: [
    SettingsLocationComponent,
    SettingsParkingComponent,
    SettingsOfficeComponent,
    SettingsRepairShopComponent,
    SettingsTerminalComponent,
  ],
})
export class SettingsLocationModule {}
