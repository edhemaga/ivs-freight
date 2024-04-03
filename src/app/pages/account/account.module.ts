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
import { TaInputDropdownLabelComponent } from 'src/app/shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';
import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';
import { TaAppTooltipComponent } from 'src/app/shared/components/ta-app-tooltip/ta-app-tooltip.component';

@NgModule({
    declarations: [AccountCardComponent, AccountTableComponent],
    imports: [
        // modules
        CommonModule,
        AccountRoutingModule,
        ClipboardModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,

        // directives
        TextToggleDirective,

        // components
        TaAppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaInputDropdownLabelComponent,
        TaTableCardDropdownActionsComponent,
        TaNoteComponent,
    ],
})
export class AccountModule {}
