import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsUserComponent } from './settings-user.component';
import { SettingsUserRoutes } from './settings-user.routing';

@NgModule({
  imports: [
    CommonModule,
    SettingsUserRoutes
  ],
  declarations: [SettingsUserComponent]
})
export class SettingsUserModule { }
