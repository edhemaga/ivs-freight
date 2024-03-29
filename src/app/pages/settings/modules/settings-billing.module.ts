import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsBillingComponent } from '../pages/settings-billing/settings-billing.component';
import { SettingsBillingRoutes } from '../routing/settings-billing.routing';

@NgModule({
    imports: [CommonModule, SettingsBillingRoutes],
    declarations: [SettingsBillingComponent],
})
export class SettingsBillingModule {}
