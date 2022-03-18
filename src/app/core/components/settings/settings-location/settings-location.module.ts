import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsLocationComponent } from './settings-location.component';
import { SettingsLocationRoutes } from './settings-location.routing';

@NgModule({
  imports: [
    CommonModule,
    SettingsLocationRoutes
  ],
  declarations: [SettingsLocationComponent]
})
export class SettingsLocationModule { }
