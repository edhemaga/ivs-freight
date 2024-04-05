// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { ContactsTableComponent } from './pages/contacts-table/contacts-table.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
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
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaInputDropdownTableComponent,
        TaInputDropdownLabelComponent,
    ],
})
export class ContactsModule {}
