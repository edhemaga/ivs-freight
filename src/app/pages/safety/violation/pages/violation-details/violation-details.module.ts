import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { ViolationDetailsRoutingModule } from '@pages/safety/violation/pages/violation-details/violation-details-routing.module';
import { SharedModule } from '@shared/shared.module';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// components
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaDetailsHeaderComponent } from '@shared/components/ta-details-header/ta-details-header.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaDetailsHeaderCardComponent } from '@shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { ViolationDetailsComponent } from '@pages/safety/violation/pages/violation-details/violation-details.component';
import { ViolationDetailsItemComponent } from '@pages/safety/violation/pages/violation-details/components/violation-details-item/violation-details-item.component';
import { ViolationDetailsCardComponent } from '@pages/safety/violation/pages/violation-details/components/violation-details-card/violation-details-card.component';

@NgModule({
    declarations: [
        ViolationDetailsComponent,
        ViolationDetailsItemComponent,
        ViolationDetailsCardComponent,
    ],
    exports: [ViolationDetailsCardComponent, SharedModule],
    imports: [
        // modules

        // components
        CommonModule,
        ViolationDetailsRoutingModule,
        SharedModule,
        TaAppTooltipV2Component,
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        TaCopyComponent,
        TaInputNoteComponent,
        FormatDatePipe,
        TaCounterComponent,
        TaUploadFilesComponent,
        TaProgressExpirationComponent,
        TaCommonCardComponent,
        TaDetailsHeaderComponent,
    ],
})
export class ViolationDetailsModule {}
