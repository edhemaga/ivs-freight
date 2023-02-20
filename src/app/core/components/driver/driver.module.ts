import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverTableComponent } from './driver-table/driver-table.component';
import { DriverRoutingModule } from './driver-routing.module';
import { DriverCardComponent } from './driver-card/driver-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';
import { formatDatePipe } from '../../pipes/formatDate.pipe';
import { TaDetailsHeaderCardComponent } from '../shared/ta-details-header-card/ta-details-header-card.component';
import { ProfileImagesComponent } from '../shared/profile-images/profile-images.component';
import { TaCopyComponent } from '../shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '../shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../shared/ta-input-note/ta-input-note.component';
import { TaReCardComponent } from '../shared/ta-common-card/ta-re-card.component';
import { TruckassistProgressExpirationComponent } from '../shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaCounterComponent } from '../shared/ta-counter/ta-counter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
    declarations: [DriverTableComponent, DriverCardComponent],

    imports: [
        CommonModule,
        DriverRoutingModule,
        AngularSvgIconModule,
        SharedModule,
        NgbModule,
        AppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent, 
        TruckassistTableHeadComponent,
        formatDatePipe,
        TaDetailsHeaderCardComponent,
        ProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaReCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,

    ],
})
export class DriverModule {}
