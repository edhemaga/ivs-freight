import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';

import { SharedModule } from '../../shared/shared.module';
import { LoadDetailsRoutes } from './load-details.routing';
import { LoadDetailsComponent } from './load-details.component';
import { LoadDetailsItemComponent } from './load-details-item/load-details-item.component';
import { LoadCardViewComponent } from '../load-card-view/load-card-view.component';

@NgModule({
    declarations: [
        LoadDetailsComponent,
        LoadDetailsItemComponent,
        LoadCardViewComponent,
    ],
    exports: [LoadCardViewComponent, SharedModule],

    imports: [
        CommonModule,
        LoadDetailsRoutes,
        SharedModule,
        TruckassistProgressExpirationModule,
    ],
})
export class LoadDetailsModule {}
