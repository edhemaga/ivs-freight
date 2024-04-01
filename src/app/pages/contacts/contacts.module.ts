// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { ContactsTableComponent } from './pages/contacts-table/contacts-table.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { ContactsCardComponent } from './pages/contacts-card/contacts-card.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { TableCardDropdownActionsComponent } from 'src/app/core/components/standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';
import { TaInputDropdownTableComponent } from 'src/app/core/components/standalone-components/ta-input-dropdown-table/ta-input-dropdown-table.component';
import { TaInputDropdownLabelComponent } from 'src/app/core/components/shared/ta-input-dropdown-label/ta-input-dropdown-label.component';

@NgModule({
    declarations: [ContactsTableComponent, ContactsCardComponent],
    imports: [
        // modules
        CommonModule,
        ContactsRoutingModule,
        AngularSvgIconModule,

        // components
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaNoteComponent,
        TableCardDropdownActionsComponent,
        TaInputDropdownTableComponent,
        TaInputDropdownLabelComponent,
    ],
})
export class ContactsModule {}
