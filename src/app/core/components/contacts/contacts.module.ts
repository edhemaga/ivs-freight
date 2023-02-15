import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsTableComponent } from './contacts-table/contacts-table.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

@NgModule({
    declarations: [ContactsTableComponent],
    imports: [
        CommonModule,
        ContactsRoutingModule,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent
    ],
})
export class ContactsModule {}
