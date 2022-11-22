import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTableComponent } from './account-table/account-table.component';
import { AccountRoutingModule } from './account-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

@NgModule({
    declarations: [AccountTableComponent],
    imports: [CommonModule, AccountRoutingModule, TruckassistTableModule],
})
export class AccountModule {}
