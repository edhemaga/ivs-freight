import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { ViolationDetailsRoutes } from './violation-details.routing';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// pipes
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

// components
import { TaCounterComponent } from 'src/app/shared/components/ta-counter/ta-counter.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaProgressExpirationComponent } from 'src/app/shared/components/ta-progress-expiration/ta-progress-expiration.component';
import { TaCommonCardComponent } from 'src/app/shared/components/ta-common-card/ta-common-card.component';
import { TaDetailsHeaderComponent } from 'src/app/shared/components/ta-details-header/ta-details-header.component';
import { TaAppTooltipV2Component } from 'src/app/shared/components/app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaDetailsHeaderCardComponent } from 'src/app/shared/components/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from 'src/app/shared/components/ta-copy/ta-copy.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { ViolationDetailsComponent } from './violation-details.component';
import { ViolationDetailsItemComponent } from './components/violation-details-item/violation-details-item.component';
import { ViolationDetailsCardComponent } from './components/violation-details-card/violation-details-card.component';

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
        ViolationDetailsRoutes,
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
