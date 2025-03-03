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
import { TaInputDropdownTableComponent } from '@shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaInputDropdownLabelComponent } from '@shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';
import { CaDropdownMenuComponent } from 'ca-components';

// store
import { StoreModule } from '@ngrx/store';
import { contactReducer } from './state/reducers/contacts.reducer';

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
        TaInputDropdownTableComponent,
        TaInputDropdownLabelComponent,
        CaDropdownMenuComponent,

        // store
        StoreModule.forFeature('contact', contactReducer),
    ],
})
export class ContactsModule {}
