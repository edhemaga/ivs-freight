//modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DriverRoutingModule } from './driver-routing.module';
//components
import { DriverTableComponent } from './pages/driver-table/driver-table.component';
import { DriverCardComponent } from './pages/driver-card/driver-card.component';

import { AppTooltipComponent } from 'src/app/core/components/shared/app-tooltip/app-tooltip.component';

import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaTruckassistTableBodyComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-body/ta-truckassist-table-body.component';
import { TaTruckassistTableHeadComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-head/ta-truckassist-table-head.component';

import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';

import { TaProfileImagesComponent } from 'src/app/shared/components/ta-profile-images/ta-profile-images.component';

import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';

import { TaTruckassistProgressExpirationComponent } from 'src/app/shared/components/ta-truckassist-progress-expiration/ta-truckassist-progress-expiration.component';

import { TaNoteComponent } from 'src/app/shared/components/ta-note/ta-note.component';

import { TaTableCardDropdownActionsComponent } from 'src/app/shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';

import { TaProgresBarComponent } from 'src/app/shared/components/ta-progres-bar/ta-progres-bar.component';

//pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
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
        TaTruckassistTableToolbarComponent,
        TaTruckassistTableBodyComponent,
        TaTruckassistTableHeadComponent,
        TaDetailsHeaderCardComponent,
        TaProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaTruckassistProgressExpirationComponent,
        TaCounterComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,

        //pipes
        FormatDatePipe,
    ],
})
export class DriverModule {}
