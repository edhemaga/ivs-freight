//modules
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DriverRoutingModule } from './driver-routing.module';
//components
import { DriverTableComponent } from './pages/driver-table/driver-table.component';
import { DriverCardComponent } from './pages/driver-card/driver-card.component';

import { TaAppTooltipV2Component } from 'src/app/shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

import { TaTableToolbarComponent } from 'src/app/shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from 'src/app/shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from 'src/app/shared/components/ta-table/ta-table-head/ta-table-head.component';

import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';

import { TaProfileImagesComponent } from 'src/app/shared/components/ta-profile-images/ta-profile-images.component';

import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';

import { TaProgressExpirationComponent } from 'src/app/shared/components/ta-progress-expiration/ta-progress-expiration.component';

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
        TaAppTooltipV2Component,
        TaTableToolbarComponent,
        TaTableBodyComponent,
        TaTableHeadComponent,
        TaDetailsHeaderCardComponent,
        TaProfileImagesComponent,
        TaCopyComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCommonCardComponent,
        TaProgressExpirationComponent,
        TaCounterComponent,
        TaNoteComponent,
        TaTableCardDropdownActionsComponent,
        TaProgresBarComponent,

        //pipes
        FormatDatePipe,
    ],
})
export class DriverModule {}
