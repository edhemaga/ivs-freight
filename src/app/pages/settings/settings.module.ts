import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

// modules
import { SettingsRoutingModule } from '@pages/settings/settings-routing.module';
import { SharedModule } from '@shared/shared.module';

// components
import { SettingsToolbarComponent } from '@pages/settings/pages/settings-toolbar/settings-toolbar.component';
import { SettingsToolbarCardComponent } from '@pages/settings/pages/settings-toolbar/components/settings-toolbar-card/settings-toolbar-card.component';
import { SettingsComponent } from '@pages/settings/pages/settings/settings.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaUploadFilesNoSliderComponent } from '@shared/components/ta-upload-files-no-slider/ta-upload-files-no-slider.component';

// pipe
import { FormatEinPipe } from '@shared/pipes/format-ein.pipe';
import { InputTestComponent } from 'ca-components';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        SharedModule,
        TaAppTooltipV2Component,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        AngularSvgIconModule,
        FormatEinPipe,
        RouterModule,
        TaCounterComponent,
        TaUploadFilesNoSliderComponent,
        InputTestComponent
    ],
    declarations: [
        SettingsComponent,
        SettingsToolbarComponent,
        SettingsToolbarCardComponent,
    ],
})
export class SettingsModule {}
