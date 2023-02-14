import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SettingsToolbarComponent } from './settings-toolbar/settings-toolbar.component';
import { SettingsToollbarCardComponent } from './settings-toolbar/settings-toollbar-card/settings-toollbar-card.component';
import { SettingsComponent } from './settings.component';
import { TrainingMaterialComponent } from './training-material/training-material.component';
import { CustomAgreementComponent } from './custom-agreement/custom-agreement.component';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TaCustomCardComponent } from '../shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../shared/ta-upload-files/ta-upload-files.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { formatEinPipe } from '../../pipes/formatEin.pipe';
import { RouterModule } from '@angular/router';

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
        RouterModule
    ],
    declarations: [
        SettingsComponent,
        SettingsToolbarComponent,
        SettingsToollbarCardComponent,
        TrainingMaterialComponent,
        CustomAgreementComponent
    ],
})
export class SettingsModule {}
