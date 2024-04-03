import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { LoadDetailsRoutes } from './load-details.routing';
import { LoadDetailsComponent } from './load-details.component';
import { LoadDetailsItemComponent } from './components/load-details-item/load-details-item.component';
import { LoadDetailsCardComponent } from './components/load-details-card/load-details-card.component';
import { ProfileImagesComponent } from 'src/app/core/components/shared/profile-images/profile-images.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/core/components/shared/ta-input-note/ta-input-note.component';
import { TaReCardComponent } from 'src/app/core/components/shared/ta-common-card/ta-re-card.component';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaCounterComponent } from 'src/app/core/components/shared/ta-counter/ta-counter.component';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { TaCommonHeaderComponent } from 'src/app/core/components/shared/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from 'src/app/core/components/shared/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from 'src/app/core/components/standalone-components/ta-chart/ta-chart.component';
import { FormatCurrency } from 'src/app/shared/pipes/format-currency.pipe';
import { MapsComponent } from 'src/app/core/components/shared/maps/maps.component';

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
        ProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaReCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        FormatDatePipe,
        TaCommonHeaderComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        FormatCurrency,
        MapsComponent,
    ],
})
export class LoadDetailsModule {}
