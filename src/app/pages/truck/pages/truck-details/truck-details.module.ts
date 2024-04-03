import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TruckDetailsRoutes } from './truck-details.routing';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TruckDetailsItemComponent } from './components/truck-details-item/truck-details-item.component';
import { TruckDetailsComponent } from './truck-details.component';
import { TruckDetailsCardComponent } from './components/truck-details-card/truck-details-card.component';
import { ProfileImagesComponent } from 'src/app/core/components/shared/profile-images/profile-images.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from 'src/app/shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from 'src/app/shared/components/ta-chart/ta-chart.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';

// pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';

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
        ReactiveFormsModule,
        formatDatePipe,
        ProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        formatDatePipe,
        TaDetailsHeaderComponent,
        TaDetailsHeaderCardComponent,
        TaChartComponent,
        TaTabSwitchComponent,
        AngularSvgIconModule,

        // PIPES
        TaThousandSeparatorPipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TruckDetailsModule {}
