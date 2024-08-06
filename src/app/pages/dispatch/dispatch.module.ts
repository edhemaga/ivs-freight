// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DispatchRoutingModule } from '@pages/dispatch/dispatch-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '@shared/shared.module';

// Components
import { DispatchComponent } from '@pages/dispatch/pages/dispatch/dispatch.component';
import { DispatchTableComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/dispatch-table.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaStatusSwitchComponent } from '@shared/components/ta-status-switch/ta-status-switch.component';
import { TaGpsProgressbarComponent } from '@shared/components/ta-gps-progressbar/ta-gps-progressbar.component';
import { TaCustomPeriodRangeComponent } from '@shared/components/ta-custom-period-range/ta-custom-period-range.component';
import { TaNoteComponent } from '@shared/components/ta-note/ta-note.component';
import { TaPickupDeliveryComponent } from '@shared/components/ta-pickup-delivery/ta-pickup-delivery.component';
import { DispatchTableDriverComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-driver/dispatch-table-driver.component';
import { DispatchTableParkingComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-parking/dispatch-table-parking.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { DispatchTableTruckTrailerComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-truck-trailer/dispatch-table-truck-trailer.component';
import { DispatchTableAddNewComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-add-new/dispatch-table-add-new.component';
import { DispatchTableAssignLoadComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-assign-load/dispatch-table-assign-load.component';
import { DispatchAssignLoadModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-assign-load-modal/dispatch-assign-load-modal.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';
import { LoadShortDetailsComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-assign-load-modal/components/load-short-details/load-short-details.component';
import { LoadDeatilsItemStopsMainComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-deatils-item-stops-main/load-deatils-item-stops-main.component';
//import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';
import { DispatchTableLastLocationComponentComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-last-location-component/dispatch-table-last-location.component';
import { LoadRequirementComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-stops/components/load-requirement/load-requirement.component';
import { DispatchHistoryModalComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-modals/dispatch-history-modal/dispatch-history-modal.component';
import { DispatchTablePreTripInspectionComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-pre-trip-inspection/dispatch-table-pre-trip-inspection.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaResizerComponent } from '@shared/components/ta-resizer/ta-resizer.component';
import { DispatchTableInfoComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-info/dispatch-table-info.component';

// Pipes
import { ColorFinderPipe } from '@shared/pipes/color-finder.pipe';
import { HosFilterPipe } from '@pages/dispatch/pipes/hos-filter.pipe';
import { TooltipWidthPipe } from '@pages/dispatch/pipes/tooltip-width.pipe';
import { CdkIdPipe } from '@pages/dispatch/pipes/cdk-id.pipe';
import { CdkConnectPipe } from '@pages/dispatch/pipes/cdk-connect.pipe';
import { HosTimePipe } from '@pages/dispatch/pipes/hos-time.pipe';
import { DispatchTableInfoTextPipe } from '@pages/dispatch/pages/dispatch/components/dispatch-table/pipes/dispatch-table-info-text.pipe';

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

        // pipes
        HosFilterPipe,
        TooltipWidthPipe,
        LoadShortDetailsComponent,
        DispatchHistoryModalComponent,
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
        ColorFinderPipe,
        DispatchTableInfoTextPipe,

        // components
        TaAppTooltipV2Component,
        TaTableToolbarComponent,
        TaInputDropdownComponent,
        TaInputAddressDropdownComponent,
        TaStatusSwitchComponent,
        TaGpsProgressbarComponent,
        TaNoteComponent,
        TaPickupDeliveryComponent,
        TaInputComponent,
        TaModalComponent,
        TaCustomCardComponent,
        TaResizerComponent,
        TaProfileImagesComponent,
        TaCustomPeriodRangeComponent,

        LoadDeatilsItemStopsMainComponent,
        LoadStatusStringComponent,
        LoadRequirementComponent,

        //  TaMapsComponent,
    ],
    exports: [ColorFinderPipe],
})
export class DispatchModule {}
