import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsUserComponent } from './settings-user.component';
import { SettingsUserRoutes } from './settings-user.routing';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';

@NgModule({
  imports: [
    CommonModule,
    SettingsUserRoutes,
    TruckassistTableModule
  ],
  declarations: [SettingsUserComponent]
})
export class SettingsUserModule { }
