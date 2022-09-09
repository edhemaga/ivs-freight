import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsUserRoutes } from './settings-user.routing';
import { TruckassistTableModule } from '../../shared/truckassist-table/truckassist-table.module';
import { UserTableComponent } from './user-table/user-table.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsUserRoutes,
    TruckassistTableModule
  ],
  declarations: [UserTableComponent]
})
export class SettingsUserModule { }
