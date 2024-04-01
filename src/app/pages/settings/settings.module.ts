import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../core/components/shared/shared.module';

import { SettingsToolbarComponent } from './pages/settings-toolbar/settings-toolbar.component';
import { SettingsToollbarCardComponent } from './pages/settings-toolbar/components/settings-toollbar-card/settings-toollbar-card.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CustomAgreementComponent } from './pages/custom-agreement/custom-agreement.component';
import { AppTooltipComponent } from '../../core/components/shared/app-tooltip/app-tooltip.component';
import { TaCustomCardComponent } from '../../core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../../core/components/shared/ta-upload-files/ta-upload-files.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { formatEinPipe } from '../../core/pipes/formatEin.pipe';
import { RouterModule } from '@angular/router';
import { TaCounterComponent } from '../../core/components/shared/ta-counter/ta-counter.component';
import { TaUploadFilesNoSliderComponent } from '../../core/components/shared/ta-upload-files-no-slider/ta-upload-files-no-slider.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        SharedModule,
        AppTooltipComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        AngularSvgIconModule,
        formatEinPipe,
        RouterModule,
        TaCounterComponent,
        TaUploadFilesNoSliderComponent,
    ],
    declarations: [
        SettingsComponent,
        SettingsToolbarComponent,
        SettingsToollbarCardComponent,
        CustomAgreementComponent,
    ],
})
export class SettingsModule {}
