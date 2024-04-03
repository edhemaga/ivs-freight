import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { BrokerDetailsRoutes } from './broker-details.routing';

// Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Components
import { BrokerDetailsItemComponent } from './components/broker-details-item/broker-details-item.component';
import { BrokerDetailsCardComponent } from './components/broker-details-card/broker-details-card.component';
import { BrokerDetailsComponent } from './broker-details.component';
import { TaChartComponent } from 'src/app/core/components/standalone-components/ta-chart/ta-chart.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TaDetailsHeaderCardComponent } from 'src/app/core/components/shared/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from 'src/app/core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputNoteComponent } from 'src/app/core/components/shared/ta-input-note/ta-input-note.component';
import { TaCommonHeaderComponent } from 'src/app/core/components/shared/ta-details-header/ta-details-header.component';
import { DetailsDropdownComponent } from 'src/app/core/components/shared/details-page-dropdown/details-dropdown';

// Pipes
import { FormatCurrency } from 'src/app/shared/pipes/format-currency.pipe';
import { FormatEinPipe } from 'src/app/shared/pipes/format-ein.pipe';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

@NgModule({
    declarations: [
        BrokerDetailsComponent,
        BrokerDetailsCardComponent,
        BrokerDetailsItemComponent,
    ],
    exports: [BrokerDetailsCardComponent, SharedModule],
    imports: [
        // Routes
        BrokerDetailsRoutes,

        // Modules
        CommonModule,
        SharedModule,
        NgbModule,

        // Components
        TaChartComponent,
        AppTooltipComponent,
        TaDetailsHeaderCardComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaTabSwitchComponent,
        TaInputNoteComponent,
        TaCommonHeaderComponent,
        DetailsDropdownComponent,

        // Pipes
        FormatCurrency,
        FormatEinPipe,
        FormatDatePipe,
    ],
})
export class BrokerDetailsModule {}
