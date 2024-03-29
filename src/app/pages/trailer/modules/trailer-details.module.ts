import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckDetailsRoutes } from '../routing/trailer-details.routing';
import { TrailerDetailsComponent } from '../pages/trailer-details/trailer-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';

// components
import { ProfileImagesComponent } from 'src/app/core/components/shared/profile-images/profile-images.component';
import { TaReCardComponent } from 'src/app/core/components/shared/ta-common-card/ta-re-card.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaCounterComponent } from 'src/app/core/components/shared/ta-counter/ta-counter.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaDetailsHeaderCardComponent } from 'src/app/core/components/shared/ta-details-header-card/ta-details-header-card.component';
import { TaCommonHeaderComponent } from 'src/app/core/components/shared/ta-details-header/ta-details-header.component';
import { TaInputNoteComponent } from 'src/app/core/components/shared/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaChartComponent } from 'src/app/core/components/standalone-components/ta-chart/ta-chart.component';
import { TrailerDetailsCardComponent } from '../components/trailer-details-card/trailer-details-card.component';
import { TrailerDetailsItemComponent } from '../components/trailer-details-item/trailer-details-item.component';

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
        TaReCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        formatDatePipe,
        TaCommonHeaderComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        ProfileImagesComponent,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // PIPES
        TaThousandSeparatorPipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrailerDetailsModule {}
