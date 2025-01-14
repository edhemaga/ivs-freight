import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { ContactsRoutingModule } from '@pages/contacts/contacts-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { ContactsTableComponent } from '@pages/contacts/pages/contacts-table/contacts-table.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { ContactsCardComponent } from '@pages/contacts/pages/contacts-card/contacts-card.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { CaDropdownMenuComponent } from 'ca-components';
import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaInputDropdownLabelComponent } from '@shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';

@NgModule({
    declarations: [ContactsTableComponent, ContactsCardComponent],
    imports: [
        // modules
        CommonModule,
        ContactsRoutingModule,
        AngularSvgIconModule,

        // components
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaNoteComponent,
        CaDropdownMenuComponent,
        TaInputDropdownTableComponent,
        TaInputDropdownLabelComponent,
    ],
})
export class ContactsModule {}
