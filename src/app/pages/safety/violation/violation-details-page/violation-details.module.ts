import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViolationDetailsRoutes } from './violation-details.routing';
import { ViolationDetailsPageComponent } from './violation-details-page.component';
import { ViolationDetailsSingleComponent } from './violation-details-single/violation-details-single.component';
import { ViolationCardViewComponent } from '../violation-card-view/violation-card-view.component';
import { SharedModule } from '../../../shared/shared.module';
import { AppTooltipComponent } from '../../../standalone-components/app-tooltip/app-tooltip.component';
import { TaDetailsHeaderCardComponent } from '../../../shared/ta-details-header-card/ta-details-header-card.component';
import { TaCustomCardComponent } from '../../../shared/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '../../../shared/ta-copy/ta-copy.component';
import { TaInputNoteComponent } from '../../../shared/ta-input-note/ta-input-note.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { TaCounterComponent } from '../../../shared/ta-counter/ta-counter.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';
import { TruckassistProgressExpirationComponent } from '../../../shared/truckassist-progress-expiration/truckassist-progress-expiration.component';
import { TaReCardComponent } from '../../../shared/ta-common-card/ta-re-card.component';
import { TaCommonHeaderComponent } from '../../../shared/ta-details-header/ta-details-header.component';

@NgModule({
    declarations: [
        ViolationDetailsPageComponent,
        ViolationDetailsSingleComponent,
        ViolationCardViewComponent,
    ],
    exports: [ViolationCardViewComponent, SharedModule],
    imports: [
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
        TaCommonHeaderComponent
    ],
})
export class ViolationDetailsModule {}
