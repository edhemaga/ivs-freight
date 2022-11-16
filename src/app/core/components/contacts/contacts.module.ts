import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsTableComponent } from './contacts-table/contacts-table.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

@NgModule({
   declarations: [ContactsTableComponent],
   imports: [CommonModule, ContactsRoutingModule, TruckassistTableModule],
})
export class ContactsModule {}
