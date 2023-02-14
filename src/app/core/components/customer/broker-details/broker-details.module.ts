import { BrokerDetailsSingleComponent } from './broker-details-single/broker-details-single.component';
import { BrokerCardViewComponent } from './../broker-card-view/broker-card-view.component';
import { BrokerDetailsComponent } from './broker-details.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { BrokerDetailsRoutes } from './broker-details.routing';
import { TaChartComponent } from '../../standalone-components/ta-chart/ta-chart.component';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaDetailsHeaderCardComponent } from '../../shared/ta-details-header-card/ta-details-header-card.component';
import { TaCopyComponent } from '../../shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
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
        CommonModule,
        BrokerDetailsRoutes,
        SharedModule,
        TaChartComponent,
        AppTooltipComponent,
        TaDetailsHeaderCardComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaTabSwitchComponent,
        TaInputNoteComponent,
        formatCurrency,
        formatEinPipe,
        formatDatePipe,
    ],
})
export class BrokerDetailsModule {}
