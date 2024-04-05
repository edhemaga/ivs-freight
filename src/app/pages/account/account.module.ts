// Modules
import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { AccountRoutingModule } from './account-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// directives
import { TextToggleDirective } from 'src/app/pages/account/pages/account-card/directives/show-hide-pass.directive';

// components
import { AccountTableComponent } from './pages/account-table/account-table.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';
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
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaInputDropdownLabelComponent,
        TaTableCardDropdownActionsComponent,
        TaNoteComponent,
    ],
})
export class AccountModule {}
