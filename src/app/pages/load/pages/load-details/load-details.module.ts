import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { LoadDetailsRoutes } from './load-details.routing';
import { LoadDetailsComponent } from './load-details.component';
import { LoadDetailsItemComponent } from './components/load-details-item/load-details-item.component';
import { LoadDetailsCardComponent } from './components/load-details-card/load-details-card.component';
import { TaProfileImagesComponent } from 'src/app/shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaTruckassistProgressExpirationComponent } from 'src/app/shared/components/ta-truckassist-progress-expiration/ta-truckassist-progress-expiration.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { TaDetailsHeaderComponent } from 'src/app/shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from 'src/app/shared/components/ta-chart/ta-chart.component';
import { FormatCurrency } from 'src/app/shared/pipes/format-currency.pipe';
import { TaMapsComponent } from 'src/app/shared/components/ta-maps/ta-maps.component';

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
        TaTruckassistProgressExpirationComponent,
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
