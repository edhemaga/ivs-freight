// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { ContactsTableComponent } from './pages/contacts-table/contacts-table.component';
import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';
import { ContactsCardComponent } from './pages/contacts-card/contacts-card.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaInputDropdownTableComponent } from 'src/app/shared/components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaInputDropdownLabelComponent } from 'src/app/shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';

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
        TaTableCardDropdownActionsComponent,
        TaInputDropdownTableComponent,
        TaInputDropdownLabelComponent,
    ],
})
export class ContactsModule {}
