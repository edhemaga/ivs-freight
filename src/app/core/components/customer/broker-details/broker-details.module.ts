import { BrokerDetailsSingleComponent } from './broker-details-single/broker-details-single.component';
import { BrokerCardViewComponent } from './../broker-card-view/broker-card-view.component';
import { BrokerDetailsComponent } from './broker-details.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { BrokerDetailsRoutes } from './broker-details.routing';

@NgModule({
    declarations: [
        BrokerDetailsComponent,
        BrokerCardViewComponent,
        BrokerDetailsSingleComponent,
    ],
    exports: [BrokerCardViewComponent, SharedModule],
    imports: [CommonModule, BrokerDetailsRoutes, SharedModule],
})
export class BrokerDetailsModule {}
