import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { TrailerDetailsRoutingModule } from '@pages/trailer/pages/trailer-details/trailer-details-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '@shared/shared.module';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

// components
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TrailerDetailsCardComponent } from '@pages/trailer/pages/trailer-details/components/trailer-details-card/trailer-details-card.component';
import { TrailerDetailsItemComponent } from '@pages/trailer/pages/trailer-details/components/trailer-details-item/trailer-details-item.component';
import { TrailerDetailsComponent } from '@pages/trailer/pages/trailer-details/trailer-details.component';
import { CaChartComponent } from 'ca-components';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';

@NgModule({
    declarations: [
        TrailerDetailsItemComponent,
        TrailerDetailsCardComponent,
        TrailerDetailsComponent,
    ],
    exports: [TrailerDetailsCardComponent, SharedModule],
    imports: [
        // modules
        CommonModule,
        TrailerDetailsRoutingModule,

        // components
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
        TaProfileImagesComponent,
        ReactiveFormsModule,
        AngularSvgIconModule,
        CaChartComponent,
        TaTabSwitchComponent,

        // pipes
        ThousandSeparatorPipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrailerDetailsModule {}
