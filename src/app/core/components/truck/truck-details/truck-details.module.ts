import { TruckDetailsItemComponent } from './truck-details-item/truck-details-item.component';
import { TruckDetailsComponent } from './truck-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckDetailsRoutes } from './truck-details.routing';
import { TruckDetailsCardComponent } from '../truck-details-card/truck-details-card.component';
import { SharedModule } from '../../shared/shared.module';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { ProfileImagesComponent } from '../../shared/profile-images/profile-images.component';
import { TaCopyComponent } from '../../shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { TaReCardComponent } from '../../shared/ta-common-card/ta-re-card.component';
import { TruckassistProgressExpirationComponent } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaCounterComponent } from '../../shared/ta-counter/ta-counter.component';
import { TaCommonHeaderComponent } from '../../shared/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from '../../shared/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from '../../standalone-components/ta-chart/ta-chart.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';

@NgModule({
    declarations: [
        TruckDetailsComponent,
        TruckDetailsItemComponent,
        TruckDetailsCardComponent,
    ],
    exports: [TruckDetailsCardComponent, SharedModule],
    imports: [
        CommonModule,
        TruckDetailsRoutes,
        SharedModule,
        formatDatePipe,
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
        TaTabSwitchComponent
    ],
})
export class TruckDetailsModule {}
