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
import { SettingsParkingModalComponent } from './location-modals/settings-parking-modal/settings-parking-modal.component';
import { SettingsOfficeModalComponent } from './location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsRepairshopModalComponent } from './location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsTerminalModalComponent } from './location-modals/settings-terminal-modal/settings-terminal-modal.component';

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

    // Modals
    SettingsParkingModalComponent,
    SettingsOfficeModalComponent,
    SettingsRepairshopModalComponent,
    SettingsTerminalModalComponent
  ],
})
export class SettingsLocationModule {}
