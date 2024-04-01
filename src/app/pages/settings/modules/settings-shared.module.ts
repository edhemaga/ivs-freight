import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsCardComponent } from '../components/settings-card/settings-card.component';
import { SettingsTabPlaceholderComponent } from '../components/settings-tab-placeholder/settings-tab-placeholder.component';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';

@NgModule({
    imports: [CommonModule, SharedModule, AppTooltipComponent],
    declarations: [SettingsCardComponent, SettingsTabPlaceholderComponent],
    exports: [SettingsCardComponent, SettingsTabPlaceholderComponent],
})
export class SettingsSharedModule {}
