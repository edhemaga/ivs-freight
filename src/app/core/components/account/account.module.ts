// Modules
import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';

// Directives
import { TextToggleDirective } from '../../directives/show-hide-pass.directive';

// Components
import { AccountTableComponent } from './account-table/account-table.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { AccountCardComponent } from './account-card/account-card.component';
import { TaInputDropdownLabelComponent } from '../shared/ta-input-dropdown-label/ta-input-dropdown-label.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableCardDropdownActionsComponent } from '../standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';
import { TaNoteComponent } from '../shared/ta-note/ta-note.component';

@NgModule({
    declarations: [AccountCardComponent, AccountTableComponent],
    imports: [
        // Modules
        CommonModule,
        AccountRoutingModule,
        ClipboardModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,

        // Directives
        TextToggleDirective,

        // Components
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaInputDropdownLabelComponent,
        TableCardDropdownActionsComponent,
        TaNoteComponent,
    ],
})
export class AccountModule {}
