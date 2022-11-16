import { TruckassistProgressExpirationModule } from './../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsCardComponent } from './settings-card/settings-card.component';
import { SettingsTabPlaceholderComponent } from './settings-tab-placeholder/settings-tab-placeholder.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [CommonModule, SharedModule, TruckassistProgressExpirationModule],
    declarations: [SettingsCardComponent, SettingsTabPlaceholderComponent],
    exports: [SettingsCardComponent, SettingsTabPlaceholderComponent],
})
export class SettingsSharedModule {}
