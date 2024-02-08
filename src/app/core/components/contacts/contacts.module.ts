// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';

// Components
import { ContactsTableComponent } from './contacts-table/contacts-table.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { TruckassistCardsComponent } from '../shared/truckassist-cards/truckassist-cards.component';

@NgModule({
    declarations: [ContactsTableComponent],
    imports: [
        // Modules
        CommonModule,
        ContactsRoutingModule,

        // Components
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TruckassistCardsComponent,
    ],
})
export class ContactsModule {}
