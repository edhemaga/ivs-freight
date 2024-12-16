import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DriverRoutingModule } from '@pages/driver/driver-routing.module';

// components
import { DriverTableComponent } from '@pages/driver/pages/driver-table/driver-table.component';
import { DriverCardComponent } from '@pages/driver/pages/driver-card/driver-card.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaTableBodyComponent } from '@shared/components/ta-table/ta-table-body/ta-table-body.component';
import { TaTableHeadComponent } from '@shared/components/ta-table/ta-table-head/ta-table-head.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaTableCardDropdownActionsComponent } from '@shared/components/ta-table-card-dropdown-actions/ta-table-card-dropdown-actions.component';
import { TaProgresBarComponent } from '@shared/components/ta-progres-bar/ta-progres-bar.component';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FlipCardsPipe } from '@shared/pipes/flip-cards.pipe';
import { CardValuePipe } from '@shared/pipes/card-value.pipe';

// store
import { StoreModule } from '@ngrx/store';
import { driverCardModalReducer } from '@pages/driver/pages/driver-card-modal/state/driver-card-modal.reducer';

@NgModule({
    declarations: [DriverTableComponent, DriverCardComponent],

    imports: [
        // modules
        CommonModule,
        DriverRoutingModule,
        AngularSvgIconModule,
        SharedModule,
        NgbModule,

        // components
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

        // pipes
        FormatDatePipe,
        FlipCardsPipe,
        CardValuePipe,

        StoreModule.forFeature('driverCardData', driverCardModalReducer),
    ],
})
export class DriverModule { }
