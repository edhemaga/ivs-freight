import { DriverDetailsCardComponent } from './components/driver-details-card/driver-details-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverDetailsComponent } from './driver-details.component';
import { DriverDetailsRoutes } from './driver-details.routing';
import { DriverDetailsItemComponent } from './components/driver-details-item/driver-details-item.component';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TaAppTooltipV2Component } from 'src/app/shared/components/app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from 'src/app/shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from 'src/app/shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaProfileImagesComponent } from 'src/app/shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaProgressExpirationComponent } from 'src/app/shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { TaDetailsHeaderComponent } from 'src/app/shared/components/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from 'src/app/shared/components/ta-chart/ta-chart.component';

@NgModule({
    declarations: [
        DriverDetailsComponent,
        DriverDetailsItemComponent,
        DriverDetailsCardComponent,
    ],
    exports: [DriverDetailsCardComponent, SharedModule],

    imports: [
        CommonModule,
        DriverDetailsRoutes,
        SharedModule,
        TaAppTooltipV2Component,
        TaModalComponent,
        TaTabSwitchComponent,
        ReactiveFormsModule,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
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
    ],
})
export class DriverDetailsModule {}
