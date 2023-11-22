import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTableComponent } from './account-table/account-table.component';
import { AccountRoutingModule } from './account-routing.module';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
    declarations: [AccountTableComponent],
    imports: [
        CommonModule,
        AccountRoutingModule,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        ClipboardModule,
    ],
})
export class AccountModule {}
