import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsIntegrationComponent } from './settings-integration.component';
import { SettingsIntegrationRoutes } from './settings-integration.routing';

@NgModule({
    imports: [CommonModule, SettingsIntegrationRoutes],
    declarations: [SettingsIntegrationComponent],
})
export class SettingsIntegrationModule {}
