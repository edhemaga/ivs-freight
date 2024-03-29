// Modules
import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { AccountRoutingModule } from './account-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// directives
import { TextToggleDirective } from 'src/app/core/directives/show-hide-pass.directive';

// components
import { AccountTableComponent } from './pages/account-table/account-table.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { AccountCardComponent } from './pages/account-card/account-card.component';
import { TaInputDropdownLabelComponent } from 'src/app/core/components/shared/ta-input-dropdown-label/ta-input-dropdown-label.component';
import { TableCardDropdownActionsComponent } from 'src/app/core/components/standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';

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
        AppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaInputDropdownLabelComponent,
        TableCardDropdownActionsComponent,
        TaNoteComponent,
    ],
})
export class AccountModule {}
