import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { TruckDetailsRoutes } from './trailer-details.routing';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

// components
import { ProfileImagesComponent } from 'src/app/core/components/shared/profile-images/profile-images.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaDetailsHeaderComponent } from 'src/app/shared/components/ta-details-header/ta-details-header.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaChartComponent } from 'src/app/shared/components/ta-chart/ta-chart.component';
import { TrailerDetailsCardComponent } from './components/trailer-details-card/trailer-details-card.component';
import { TrailerDetailsItemComponent } from './components/trailer-details-item/trailer-details-item.component';
import { TrailerDetailsComponent } from './trailer-details.component';

@NgModule({
    declarations: [
        TrailerDetailsItemComponent,
        TrailerDetailsCardComponent,
        TrailerDetailsComponent,
    ],
    exports: [TrailerDetailsCardComponent, SharedModule],
    imports: [
        CommonModule,
        TruckDetailsRoutes,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        FormatDatePipe,
        TaDetailsHeaderComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        ProfileImagesComponent,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // PIPES
        ThousandSeparatorPipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrailerDetailsModule {}
