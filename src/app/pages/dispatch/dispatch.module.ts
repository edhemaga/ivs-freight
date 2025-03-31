import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DispatchRoutingModule } from '@pages/dispatch/dispatch-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '@shared/shared.module';

// components
import { DispatchComponent } from '@pages/dispatch/pages/dispatch/dispatch.component';
import { DispatchTableComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/dispatch-table.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { DispatchHistoryModalNoGroupComponent } from './pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/components/dispatch-history-modal-no-group/dispatch-history-modal-no-group.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaGpsProgressbarComponent } from '@shared/components/ta-gps-progressbar/ta-gps-progressbar.component';
import { TaCustomPeriodRangeComponent } from '@shared/components/ta-custom-period-range/ta-custom-period-range.component';
import { DispatchHistoryModalNoContentComponent } from './pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/components/dispatch-history-modal-no-content/dispatch-history-modal-no-content.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaPickupDeliveryComponent } from '@shared/components/ta-pickup-delivery/ta-pickup-delivery.component';
import { DispatchTableDriverComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-driver/dispatch-table-driver.component';
import { DispatchTableNoteComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-note/dispatch-table-note.component';
import { DispatchTableParkingComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-parking/dispatch-table-parking.component';
import { TaStatusComponentComponent } from '@shared/components/ta-status-component/ta-status-component.component';
import { DispatchTableTruckTrailerComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-truck-trailer/dispatch-table-truck-trailer.component';
import { DispatchTableAddNewComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-add-new/dispatch-table-add-new.component';
import { DispatchTableAssignLoadComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-assign-load/dispatch-table-assign-load.component';
import { DispatchAssignLoadModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-assign-load-modal/dispatch-assign-load-modal.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';
import { LoadShortDetailsComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-assign-load-modal/components/load-short-details/load-short-details.component';
import { LoadDetailsItemStopsMainComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-details-item-stops-main/load-details-item-stops-main.component';
import { DispatchTableLastLocationComponentComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-last-location-component/dispatch-table-last-location.component';
import { LoadRequirementComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-requirement/load-requirement.component';
import { DispatchHistoryModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/dispatch-history-modal.component';
import { DispatchTablePreTripInspectionComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-pre-trip-inspection/dispatch-table-pre-trip-inspection.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaResizerComponent } from '@shared/components/ta-resizer/ta-resizer.component';
import { DispatchTableInfoComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-info/dispatch-table-info.component';
import { DispatchTableStatusComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-status/dispatch-table-status.component';
import { DispatchTablePickupDeliveryComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-pickup-delivery/dispatch-table-pickup-delivery.component';
import {
    CaInputAddressDropdownComponent,
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalComponent,
    PickupDeliveryBlockComponent,
    ProgressBarComponent,
    TruckTrailerColorFinderPipe,
} from 'ca-components';

// pipes
import { HosFilterPipe } from '@pages/dispatch/pipes/hos-filter.pipe';
import { TooltipWidthPipe } from '@pages/dispatch/pipes/tooltip-width.pipe';
import { CdkIdPipe } from '@pages/dispatch/pipes/cdk-id.pipe';
import { CdkConnectPipe } from '@pages/dispatch/pipes/cdk-connect.pipe';
import { HosTimePipe } from '@pages/dispatch/pipes/hos-time.pipe';
import { DispatchTableInfoTextPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-table-info-text.pipe';
import { DispatchTableHeaderShowPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-table-header-show.pipe';
import { DispatchHistoryModalGroupComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/components/dispatch-history-modal-group/dispatch-history-modal-group.component';
import { DriverEndorsementsPipe } from '@pages/dispatch/pipes/driver-endorsements.pipe';
import { DispatchAllowedTruckTrailerPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-allowed-truck-trailer.pipe';
import { DispatchHiddenAddTrailerPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-hidden-add-trailer.pipe';
import { DispatchTableFooterWidthsPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-table-footer-widths.pipe';
import { DispatchTableColumnWidthsPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-table-column-widths.pipe';
import { DispatchConfigPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-config.pipe';

// directives
import { ResizableDirective } from '@pages/dispatch/pages/dispatch/components/dispatch-table/directives';

@NgModule({
    declarations: [
        // components
        DispatchComponent,
        DispatchTableComponent,
        DispatchTableDriverComponent,
        DispatchTableParkingComponent,
        DispatchTableTruckTrailerComponent,
        DispatchTableAddNewComponent,
        DispatchTableAssignLoadComponent,
        DispatchAssignLoadModalComponent,
        DispatchTableInfoComponent,
        DispatchTableLastLocationComponentComponent,
        DispatchTablePreTripInspectionComponent,
        DispatchHistoryModalComponent,
        DispatchHistoryModalNoContentComponent,
        DispatchHistoryModalNoGroupComponent,
        DispatchHistoryModalGroupComponent,
        DispatchTableStatusComponent,
        DispatchTableNoteComponent,
        DispatchTablePickupDeliveryComponent,
        LoadShortDetailsComponent,

        // pipes
        HosFilterPipe,
        TooltipWidthPipe,
        DispatchAllowedTruckTrailerPipe,
        DispatchHiddenAddTrailerPipe,
        DispatchTableFooterWidthsPipe,
        DispatchTableColumnWidthsPipe,
    ],
    imports: [
        // modules
        AngularSvgIconModule,
        CommonModule,
        DispatchRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgbModule,

        // pipes
        CdkIdPipe,
        CdkConnectPipe,
        HosTimePipe,
        DispatchTableInfoTextPipe,
        DispatchTableHeaderShowPipe,
        DriverEndorsementsPipe,
        TruckTrailerColorFinderPipe,
        DispatchConfigPipe,

        //directives
        ResizableDirective,

        // components
        TaAppTooltipV2Component,
        TaTableToolbarComponent,
        CaInputAddressDropdownComponent,
        TaGpsProgressbarComponent,
        TaNoteComponent,
        TaPickupDeliveryComponent,
        TaModalComponent,
        TaCustomCardComponent,
        TaResizerComponent,
        TaProfileImagesComponent,
        TaCustomPeriodRangeComponent,
        TaStatusComponentComponent,

        CaInputComponent,
        CaInputDropdownComponent,
        CaModalComponent,

        LoadDetailsItemStopsMainComponent,
        LoadStatusStringComponent,
        LoadRequirementComponent,
        PickupDeliveryBlockComponent,
        ProgressBarComponent,

        //  TaMapsComponent,
    ],
})
export class DispatchModule {}
