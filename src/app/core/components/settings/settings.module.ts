import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../shared/shared/shared.module';

import { SettingsToolbarComponent } from './settings-toolbar/settings-toolbar.component';
import { SettingsToollbarCardComponent } from './settings-toolbar/settings-toollbar-card/settings-toollbar-card.component';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [CommonModule, SettingsRoutingModule, SharedModule],
  declarations: [
    SettingsComponent,

    SettingsToolbarComponent,
    SettingsToollbarCardComponent,
  ],
})
export class SettingsModule {}
