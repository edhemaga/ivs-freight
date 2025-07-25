import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { SharedModule } from '@shared/shared.module';
import { TruckDetailsRoutingModule } from '@pages/truck/pages/truck-details/truck-details-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Components
import { TruckDetailsItemComponent } from '@pages/truck/pages/truck-details/components/truck-details-item/truck-details-item.component';
import { TruckDetailsComponent } from '@pages/truck/pages/truck-details/truck-details.component';
import { TruckDetailsCardComponent } from '@pages/truck/pages/truck-details/components/truck-details-card/truck-details-card.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { CaChartComponent, CaTabSwitchComponent } from 'ca-components';

// Pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

@NgModule({
    declarations: [
        TruckDetailsComponent,
        TruckDetailsItemComponent,
        TruckDetailsCardComponent,
    ],
    exports: [TruckDetailsCardComponent, SharedModule],
    imports: [
        // modules
        CommonModule,
        TruckDetailsRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        AngularSvgIconModule,

        // components
        TaProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        TaDetailsHeaderComponent,
        TaDetailsHeaderCardComponent,
        CaTabSwitchComponent,
        CaChartComponent,

        // pipes
        ThousandSeparatorPipe,
        FormatDatePipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TruckDetailsModule {}
