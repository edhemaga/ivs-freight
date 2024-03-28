//modules
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DriverRoutingModule } from './driver-routing.module';
//components
import { DriverTableComponent } from './driver-table/driver-table.component';
import { DriverCardComponent } from './driver-card/driver-card.component';

import { AppTooltipComponent } from '../standalone-components/app-tooltip/app-tooltip.component';

import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TruckassistTableBodyComponent } from '../shared/truckassist-table/truckassist-table-body/truckassist-table-body.component';
import { TruckassistTableHeadComponent } from '../shared/truckassist-table/truckassist-table-head/truckassist-table-head.component';

import { TaDetailsHeaderCardComponent } from '../shared/ta-details-header-card/ta-details-header-card.component';

import { ProfileImagesComponent } from '../shared/profile-images/profile-images.component';

import { TaCopyComponent } from '../shared/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '../shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../shared/ta-input-note/ta-input-note.component';
import { TaReCardComponent } from '../shared/ta-common-card/ta-re-card.component';
import { TaCounterComponent } from '../shared/ta-counter/ta-counter.component';

import { TruckassistProgressExpirationComponent } from '../shared/truckassist-progress-expiration/truckassist-progress-expiration.component';

import { TaNoteComponent } from '../shared/ta-note/ta-note.component';

import { TableCardDropdownActionsComponent } from '../standalone-components/table-card-dropdown-actions/table-card-dropdown-actions.component';

import { ProgresBarComponent } from '../standalone-components/progres-bar/progres-bar.component';

//pipes
import { formatDatePipe } from '../../pipes/formatDate.pipe';
@NgModule({
    declarations: [DriverTableComponent, DriverCardComponent],

    imports: [
        //modules
        CommonModule,
        DriverRoutingModule,
        AngularSvgIconModule,
        SharedModule,
        NgbModule,

        //components
        AppTooltipComponent,
        TruckassistTableToolbarComponent,
        TruckassistTableBodyComponent,
        TruckassistTableHeadComponent,
        TaDetailsHeaderCardComponent,
        ProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaReCardComponent,
        TruckassistProgressExpirationComponent,
        TaCounterComponent,
        TaNoteComponent,
        TableCardDropdownActionsComponent,
        ProgresBarComponent,

        //pipes
        formatDatePipe,
    ],
})
export class DriverModule {}
