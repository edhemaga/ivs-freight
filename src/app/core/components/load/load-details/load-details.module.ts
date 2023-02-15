import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { LoadDetailsRoutes } from './load-details.routing';
import { LoadDetailsComponent } from './load-details.component';
import { LoadDetailsItemComponent } from './load-details-item/load-details-item.component';
import { LoadCardViewComponent } from '../load-card-view/load-card-view.component';
import { ProfileImagesComponent } from '../../shared/profile-images/profile-images.component';
import { TaCopyComponent } from '../../shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { TaReCardComponent } from '../../shared/ta-common-card/ta-re-card.component';
import { TruckassistProgressExpirationComponent } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaCounterComponent } from '../../shared/ta-counter/ta-counter.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TaCommonHeaderComponent } from '../../shared/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from '../../shared/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from '../../standalone-components/ta-chart/ta-chart.component';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';

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
        ProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaReCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        formatDatePipe,
        TaCommonHeaderComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        formatCurrency
    ],
})
export class LoadDetailsModule {}
