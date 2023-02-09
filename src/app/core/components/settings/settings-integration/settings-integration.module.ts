import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsIntegrationComponent } from './settings-integration.component';
import { SettingsIntegrationRoutes } from './settings-integration.routing';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';

@NgModule({
    imports: [CommonModule, SettingsIntegrationRoutes, TruckassistTableModule],
    declarations: [SettingsIntegrationComponent],
})
export class SettingsIntegrationModule {}
