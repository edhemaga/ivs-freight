import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

// modules
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../core/components/shared/shared.module';
// components
import { SettingsToolbarComponent } from './pages/settings-toolbar/settings-toolbar.component';
import { SettingsToollbarCardComponent } from './pages/settings-toolbar/components/settings-toollbar-card/settings-toollbar-card.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AppTooltipComponent } from '../../core/components/shared/app-tooltip/app-tooltip.component';
import { TaCustomCardComponent } from '../../core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../../core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaCounterComponent } from '../../core/components/shared/ta-counter/ta-counter.component';
import { TaUploadFilesNoSliderComponent } from '../../core/components/shared/ta-upload-files-no-slider/ta-upload-files-no-slider.component';

// pipe
import { FormatEinPipe } from '../../shared/pipes/format-ein.pipe';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        SharedModule,
        AppTooltipComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        AngularSvgIconModule,
        FormatEinPipe,
        RouterModule,
        TaCounterComponent,
        TaUploadFilesNoSliderComponent,
    ],
    declarations: [
        SettingsComponent,
        SettingsToolbarComponent,
        SettingsToollbarCardComponent,
    ],
})
export class SettingsModule {}
