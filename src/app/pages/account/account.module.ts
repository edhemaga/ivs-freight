// Modules
import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { AccountRoutingModule } from '@pages/account/account-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// directives
import { TextToggleDirective } from '@pages/account/pages/account-card/directives/show-hide-pass.directive';

// components
import { AccountTableComponent } from '@pages/account/pages/account-table/account-table.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { AccountCardComponent } from '@pages/account/pages/account-card/account-card.component';
import { TaInputDropdownLabelComponent } from '@shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaAppTooltipComponent } from '@shared/components/ta-app-tooltip/ta-app-tooltip.component';
import { CaDropdownMenuComponent } from 'ca-components';

// pipes
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';

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
        AngularSvgIconModule,

        // directives
        TextToggleDirective,

        // components
        TaAppTooltipComponent,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaInputDropdownLabelComponent,
        TaNoteComponent,
        CaDropdownMenuComponent,

        // pipes
        FlipCardsPipe,
    ],
})
export class AccountModule {}
