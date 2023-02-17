import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsCardComponent } from './settings-card/settings-card.component';
import { SettingsTabPlaceholderComponent } from './settings-tab-placeholder/settings-tab-placeholder.component';
import { SharedModule } from '../../shared/shared.module';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';

@NgModule({
    imports: [CommonModule, SharedModule, AppTooltipComponent],
    declarations: [SettingsCardComponent, SettingsTabPlaceholderComponent],
    exports: [SettingsCardComponent, SettingsTabPlaceholderComponent],
})
export class SettingsSharedModule {}
