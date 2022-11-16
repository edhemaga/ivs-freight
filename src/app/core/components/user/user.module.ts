import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { UserRoutes } from './user.routing';
import { UserTableComponent } from './user-table/user-table.component';

@NgModule({
    imports: [CommonModule, UserRoutes, TruckassistTableModule],
    declarations: [UserTableComponent],
})
export class UserModule {}
