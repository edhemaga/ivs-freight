import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsBillingComponent } from './settings-billing.component';
import { SettingsBillingRoutes } from './settings-billing.routing';

@NgModule({
    imports: [CommonModule, SettingsBillingRoutes],
    declarations: [SettingsBillingComponent],
})
export class SettingsBillingModule {}
