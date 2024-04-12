import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { LoadDetailsRoutes } from './load-details.routing';
import { LoadDetailsComponent } from './load-details.component';
import { LoadDetailsItemComponent } from './components/load-details-item/load-details-item.component';
import { LoadDetailsCardComponent } from './components/load-details-card/load-details-card.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from '@shared/components/ta-chart/ta-chart.component';
import { FormatCurrency } from '@shared/pipes/format-currency.pipe';
import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';

@NgModule({
    declarations: [
        LoadDetailsComponent,
        LoadDetailsItemComponent,
        LoadDetailsCardComponent,
    ],
    exports: [LoadDetailsCardComponent, SharedModule],

    imports: [
        CommonModule,
        LoadDetailsRoutes,
        SharedModule,
        TaProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        FormatDatePipe,
        TaDetailsHeaderComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        FormatCurrency,
        TaMapsComponent,
    ],
})
export class LoadDetailsModule {}
