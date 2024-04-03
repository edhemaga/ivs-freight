import { DriverDetailsCardComponent } from './components/driver-details-card/driver-details-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverDetailsComponent } from './driver-details.component';
import { DriverDetailsRoutes } from './driver-details.routing';
import { DriverDetailsItemComponent } from './components/driver-details-item/driver-details-item.component';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from 'src/app/core/components/shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from 'src/app/core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaInputComponent } from 'src/app/core/components/shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from 'src/app/core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/core/components/shared/ta-input-note/ta-input-note.component';
import { ProfileImagesComponent } from 'src/app/core/components/shared/profile-images/profile-images.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaReCardComponent } from 'src/app/core/components/shared/ta-common-card/ta-re-card.component';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaCounterComponent } from 'src/app/core/components/shared/ta-counter/ta-counter.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TaCommonHeaderComponent } from 'src/app/core/components/shared/ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from 'src/app/core/components/shared/ta-details-header-card/ta-details-header-card.component';
import { TaChartComponent } from 'src/app/core/components/standalone-components/ta-chart/ta-chart.component';

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
