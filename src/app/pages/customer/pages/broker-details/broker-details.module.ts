import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { BrokerDetailsRoutingModule } from '@pages/customer/pages/broker-details/broker-details-routing.module';

// Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';

// Components
import { BrokerDetailsItemComponent } from '@pages/customer/pages/broker-details/components/broker-details-item/broker-details-item.component';
import { BrokerDetailsCardComponent } from '@pages/customer/pages/broker-details/components/broker-details-card/broker-details-card.component';
import { BrokerDetailsComponent } from '@pages/customer/pages/broker-details/broker-details.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsDropdownComponent } from '@shared/components/ta-details-dropdown/ta-details-dropdown.component';
import { TaProgressInvoicesComponent } from '@shared/components/ta-progress-invoices/ta-progress-invoices.component';
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaContactsCardComponent } from '@shared/components/ta-contacts-card/ta-contacts-card.component';
import { CaChartComponent } from 'ca-components';

// Pipes
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { FormatEinPipe } from '@shared/pipes/format-ein.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';
import { ProgressBarColors } from '@shared/pipes/progress-bar-colors.pipe';
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';

@NgModule({
    declarations: [
        BrokerDetailsComponent,
        BrokerDetailsCardComponent,
        BrokerDetailsItemComponent,
    ],
    exports: [BrokerDetailsCardComponent, SharedModule],
    imports: [
        // Routes
        BrokerDetailsRoutingModule,

        // Modules
        CommonModule,
        SharedModule,
        NgbModule,

        // Components
        TaAppTooltipV2Component,
        TaDetailsHeaderCardComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaTabSwitchComponent,
        TaInputNoteComponent,
        TaDetailsHeaderComponent,
        TaDetailsDropdownComponent,
        TaProgressInvoicesComponent,
        TaUserReviewComponent,
        TaCounterComponent,
        TaContactsCardComponent,
        CaChartComponent,

        // Pipes
        FormatCurrencyPipe,
        FormatEinPipe,
        FormatDatePipe,
        FormatPhonePipe,
        ProgressBarColors,
        LoadStatusColorPipe,
    ],
})
export class BrokerDetailsModule {}
