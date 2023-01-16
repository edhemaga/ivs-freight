import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SettingsToolbarComponent } from './settings-toolbar/settings-toolbar.component';
import { SettingsToollbarCardComponent } from './settings-toolbar/settings-toollbar-card/settings-toollbar-card.component';
import { SettingsComponent } from './settings.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { TrainingMaterialComponent } from './training-material/training-material.component';
import { CustomAgreementComponent } from './custom-agreement/custom-agreement.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        SharedModule,
        TruckassistTableModule,
    ],
    declarations: [
        SettingsComponent,
        SettingsToolbarComponent,
        SettingsToollbarCardComponent,
        TrainingMaterialComponent,
        CustomAgreementComponent,
    ],
})
export class SettingsModule {}
