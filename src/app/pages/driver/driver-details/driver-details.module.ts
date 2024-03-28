import { DriverDetailsCardComponent } from './../driver-details-card/driver-details-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverDetailsComponent } from './driver-details.component';
import { DriverDetailsRoutes } from './driver-details.routing';
import { DriverDetailsItemComponent } from './driver-details-item/driver-details-item.component';
import { SharedModule } from '../../shared/shared.module';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { ProfileImagesComponent } from '../../shared/profile-images/profile-images.component';
import { TaCopyComponent } from '../../shared/ta-copy/ta-copy.component';
import { TaReCardComponent } from '../../shared/ta-common-card/ta-re-card.component';
import { TruckassistProgressExpirationComponent } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaCounterComponent } from '../../shared/ta-counter/ta-counter.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TaCommonHeaderComponent } from '../../shared/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from '../../shared/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from '../../standalone-components/ta-chart/ta-chart.component';

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
        AppTooltipComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        ReactiveFormsModule,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
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
    ],
})
export class DriverDetailsModule {}
