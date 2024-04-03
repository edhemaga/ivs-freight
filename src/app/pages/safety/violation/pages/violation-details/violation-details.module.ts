import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { ViolationDetailsRoutes } from './violation-details.routing';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

// components
import { TaCounterComponent } from 'src/app/core/components/shared/ta-counter/ta-counter.component';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaReCardComponent } from 'src/app/core/components/shared/ta-common-card/ta-re-card.component';
import { TaCommonHeaderComponent } from 'src/app/core/components/shared/ta-details-header/ta-details-header.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TaDetailsHeaderCardComponent } from 'src/app/core/components/shared/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaInputNoteComponent } from 'src/app/core/components/shared/ta-input-note/ta-input-note.component';
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
        AppTooltipComponent,
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        TaCopyComponent,
        TaInputNoteComponent,
        formatDatePipe,
        TaCounterComponent,
        TaUploadFilesComponent,
        TruckassistProgressExpirationComponent,
        TaReCardComponent,
        TaCommonHeaderComponent,
    ],
})
export class ViolationDetailsModule {}
