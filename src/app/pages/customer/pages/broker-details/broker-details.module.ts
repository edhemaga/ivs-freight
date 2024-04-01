import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { BrokerDetailsRoutes } from './broker-details.routing';

// Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Components
import { BrokerDetailsSingleComponent } from '../../components/broker-details-single/broker-details-single.component';
import { BrokerCardViewComponent } from '../../components/broker-card-view/broker-card-view.component';
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
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { formatEinPipe } from 'src/app/core/pipes/formatEin.pipe';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

@NgModule({
    declarations: [
        BrokerDetailsComponent,
        BrokerCardViewComponent,
        BrokerDetailsSingleComponent,
    ],
    exports: [BrokerCardViewComponent, SharedModule],
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
        formatCurrency,
        formatEinPipe,
        formatDatePipe,
    ],
})
export class BrokerDetailsModule {}
