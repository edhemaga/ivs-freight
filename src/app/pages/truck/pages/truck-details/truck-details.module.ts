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
import { TaProfileImagesComponent } from 'src/app/shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from 'src/app/shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from 'src/app/shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from 'src/app/shared/components/ta-chart/ta-chart.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';

// pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';

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
        FormatDatePipe,
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
        TaTabSwitchComponent,
        AngularSvgIconModule,

        // PIPES
        ThousandSeparatorPipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TruckDetailsModule {}
