import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckDetailsRoutes } from './trailer-details.routing';
import { TrailerDetailsComponent } from './trailer-details.component';
import { TrailerDetailsItemComponent } from './trailer-details-item/trailer-details-item.component';
import { TrailerDetailsCardComponent } from '../trailer-details-card/trailer-details-card.component';
import { SharedModule } from '../../shared/shared.module';
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
import { ProfileImagesComponent } from '../../shared/profile-images/profile-images.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
@NgModule({
    declarations: [
        TrailerDetailsComponent,
        TrailerDetailsItemComponent,
        TrailerDetailsCardComponent,
    ],
    exports: [TrailerDetailsCardComponent, SharedModule],
    imports: [
        CommonModule,
        TruckDetailsRoutes,
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
        ProfileImagesComponent,
        ReactiveFormsModule,
        AngularSvgIconModule
    ],
})
export class TrailerDetailsModule {}
