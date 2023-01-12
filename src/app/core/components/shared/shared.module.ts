import { RepairOrderModalComponent } from '../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { AccidentModalComponent } from '../modals/accident-modal/accident-modal.component';
import { RouterModule } from '@angular/router';
import { TaModalComponent } from './ta-modal/ta-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HistoryDataComponent } from './history-data/history-data.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TabSwitcherComponent } from '../switchers/tab-switcher/tab-switcher.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { StatusSwitcherComponent } from '../switchers/status-switcher/status-switcher.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxMaskModule } from 'ngx-mask';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { TaStatusSelectComponent } from './ta-status-select/ta-status-select.component';
import { TaStatusSwitchComponent } from './ta-status-switch/ta-status-switch.component';
import { Ng5SliderModule } from 'ng5-slider';
import { EditProfileImageComponent } from './edit-profile-image/edit-profile-image.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CroppieModule } from 'angular-croppie-module';

import { TaCounterComponent } from './ta-counter/ta-counter.component';
import { TaNgxSliderComponent } from './ta-ngx-slider/ta-ngx-slider.component';
import { TaLogoChangeComponent } from './ta-logo-change/ta-logo-change.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { TaInputComponent } from './ta-input/ta-input.component';
import { AccountModalComponent } from '../modals/account-modal/account-modal.component';
import { TaInputNoteComponent } from './ta-input-note/ta-input-note.component';
import { TaInputDropdownComponent } from './ta-input-dropdown/ta-input-dropdown.component';
import { CustomDatetimePickersComponent } from './custom-datetime-pickers/custom-datetime-pickers.component';
import { CalendarDatesMainComponent } from './custom-datetime-pickers/calendar-dates-main/calendar-dates-main.component';
import { CalendarDaysComponent } from './custom-datetime-pickers/calendar-days/calendar-days.component';
import { CalendarLeftComponent } from './custom-datetime-pickers/calendar-left/calendar-left.component';
import { DateCalendarsComponent } from './custom-datetime-pickers/date-calendars/date-calendars.component';
import { DriverModalComponent } from '../modals/driver-modal/driver-modal.component';
import { TaCheckboxComponent } from './ta-checkbox/ta-checkbox.component';
import { DirectivesModule } from '../../directives/directives.module';

import { TruckModalComponent } from '../modals/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '../modals/trailer-modal/trailer-modal.component';
import { TaCustomCardComponent } from './ta-custom-card/ta-custom-card.component';
import { ContactModalComponent } from '../modals/contact-modal/contact-modal.component';
import { BrokerModalComponent } from '../modals/broker-modal/broker-modal.component';
import { TaInputRadiobuttonsComponent } from './ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaLikeDislikeComponent } from './ta-like-dislike/ta-like-dislike.component';
import { TaUserReviewComponent } from './ta-user-review/ta-user-review.component';
import { TaCommonHeaderComponent } from './ta-details-header/ta-details-header.component';
import { TaDetailsHeaderCardComponent } from './ta-details-header-card/ta-details-header-card.component';
import { TaReCardComponent } from './ta-common-card/ta-re-card.component';
import { ShipperModalComponent } from '../modals/shipper-modal/shipper-modal.component';
import { OwnerModalComponent } from '../modals/owner-modal/owner-modal.component';
import { TaCurrencyProgressBarComponent } from './ta-currency-progress-bar/ta-currency-progress-bar.component';
import { UserModalComponent } from '../modals/user-modal/user-modal.component';
import { TaUploadFileComponent } from './ta-upload-files/ta-upload-file/ta-upload-file.component';
import { TaUploadFilesCarouselComponent } from './ta-upload-files/ta-upload-files-carousel/ta-upload-files-carousel.component';
import { TaskModalComponent } from '../modals/task-modal/task-modal.component';
import { TaUploadDropzoneComponent } from './ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';

import { AppTooltipeModule } from './app-tooltip/app-tooltip.module';

import { FilterComponent } from './filter/filter.component';
import { FuelPurchaseModalComponent } from '../modals/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { FuelStopModalComponent } from '../modals/fuel-modals/fuel-stop-modal/fuel-stop-modal.component';
import { ViolationModalComponent } from '../modals/violation-modal/violation-modal.component';
import { TtRegistrationModalComponent } from '../modals/common-truck-trailer-modals/tt-registration-modal/tt-registration-modal.component';
import { TtFhwaInspectionModalComponent } from '../modals/common-truck-trailer-modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { PipesModule } from '../../pipes/pipes.module';
import { RepairShopModalComponent } from '../modals/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { TaChartComponent } from './ta-chart/ta-chart.component';
import { ChartsModule } from 'ng2-charts';
import { RepairPmModalComponent } from '../modals/repair-modals/repair-pm-modal/repair-pm-modal.component';
import { ProfileImagesModule } from './profile-images/profile-images.module';
import { TaTabSwitchComponent } from './ta-tab-switch/ta-tab-switch.component';
import { MapListComponent } from './map-list/map-list.component';
import { MapListCardComponent } from './map-list-card/map-list-card.component';
import { MapMarkerDropdownComponent } from './map-marker-dropdown/map-marker-dropdown.component';
import { TaInputDropdownLabelComponent } from './ta-input-dropdown-label/ta-input-dropdown-label.component';
import { LoadModalComponent } from '../modals/load-modal/load-modal.component';
import { TaInputArrowsComponent } from './ta-input-arrows/ta-input-arrows.component';
import { TaNoteModule } from './ta-note/ta-note.module';
import { TaSpinnerModule } from './ta-spinner/ta-spinner.module';
import { CustomScrollbarComponent } from './custom-scrollbar/custom-scrollbar.component';
import { TaUploadFilesComponent } from './ta-upload-files/ta-upload-files.component';
import { DetailsDropdownComponent } from './details-page-dropdown/details-dropdown';
import { MapsComponent } from './maps/maps.component';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { ProgressInvoicesComponent } from './progress-invoices/progress-invoices.component';
import { TaCopyComponent } from './ta-copy/ta-copy.component';
import { LottieModule } from 'ngx-lottie';
import { TaTimePeriodComponent } from './ta-time-period/ta-time-period.component';
import { ProfileUpdateModalComponent } from '../modals/profile-update-modal/profile-update-modal.component';
import { MapToolbarComponent } from './map-toolbar/map-toolbar.component';
import { AutoclosePopoverComponent } from './autoclose-popover/autoclose-popover.component';
import { ApplicantModalComponent } from '../modals/applicant-modal/applicant-modal.component';
import { TtTitleModalComponent } from '../modals/common-truck-trailer-modals/tt-title-modal/tt-title-modal.component';
import { ConfirmationModalComponent } from '../modals/confirmation-modal/confirmation-modal.component';
import { CustomToastMessagesComponent } from './custom-toast-messages/custom-toast-messages.component';
import { SvgDefinitionsComponent } from '../../../svg-definitions/svg-definitions.component';
import { TaCustomCardV2Component } from './ta-custom-card-v2/ta-custom-card-v2.component';
import { InputAddressDropdownComponent } from './input-address-dropdown/input-address-dropdown.component';
import { ApplicantReviewFeedbackComponent } from './applicant-review-feedback/applicant-review-feedback.component';
import { LoadModalHazardousComponent } from '../modals/load-modal/load-modal-hazardous/load-modal-hazardous.component';
import { LoadModalStatusesComponent } from '../modals/load-modal/load-modal-statuses/load-modal-statuses.component';
import { MapSettingsModalComponent } from '../modals/map-settings-modal/map-settings-modal.component';
import { MapRouteModalComponent } from '../modals/map-route-modal/map-route-modal.component';
import { ObserversModule } from '@angular/cdk/observers';
import { PayrollStatusesComponent } from './payroll-statuses/payroll-statuses.component';
import { TaCheckboxCardComponent } from './ta-checkbox-card/ta-checkbox-card.component';
import { LoadModalProgressBarComponent } from '../modals/load-modal/load-modal-progress-bar/load-modal-progress-bar.component';
import { LoadStopComponent } from '../modals/load-modal/load-stop/load-stop.component';
import { GpsProgressbarComponent } from './gps-progressbar/gps-progressbar.component';
import { LoadFinancialComponent } from '../modals/load-modal/load-financial/load-financial.component';
import { TableModalComponent } from './table-modal/table-modal.component';
import { TaPickupDeliveryComponent } from './ta-pickup-delivery/ta-pickup-delivery.component';
import { PayrollBonusModalComponent } from '../modals/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollCreditBonusComponent } from '../modals/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { PayrollDeducationModalComponent } from '../modals/payroll-modals/payroll-deducation-modal/payroll-deducation-modal.component';

export function playerFactory() {
    return import('lottie-web');
}

@NgModule({
    declarations: [
        HistoryDataComponent,
        TabSwitcherComponent,
        DetailsDropdownComponent,
        StatusSwitcherComponent,
        //TaNoteContainerComponent,
        TaStatusSwitchComponent,
        TaStatusSelectComponent,
        DeleteDialogComponent,
        EditProfileImageComponent,
        EditProfileImageComponent,
        EditProfileImageComponent,
        SvgDefinitionsComponent,
        CustomDatetimePickersComponent,
        CalendarDatesMainComponent,
        CalendarDaysComponent,
        CalendarLeftComponent,
        DateCalendarsComponent,
        TaCheckboxComponent,
        TaCommonHeaderComponent,
        TaCustomCardComponent,
        TaReCardComponent,
        TaDetailsHeaderCardComponent,
        TaInputDropdownComponent,
        TaInputNoteComponent,
        TaInputComponent,
        TaCounterComponent,
        TaNgxSliderComponent,
        TaLogoChangeComponent,
        TaInputRadiobuttonsComponent,
        TaLikeDislikeComponent,
        TaUserReviewComponent,
        TaCurrencyProgressBarComponent,
        TaUploadFilesCarouselComponent,
        TaUploadDropzoneComponent,
        FilterComponent,
        TaChartComponent,
        TaInputArrowsComponent,
        TaTimePeriodComponent,
        TaUploadFileComponent,
        TaInputDropdownLabelComponent,
        TaUploadFilesComponent,
        ApplicantReviewFeedbackComponent,
        TaTimePeriodComponent,
        AutoclosePopoverComponent,

        // Modals Components
        ApplicantModalComponent,
        TaModalComponent,
        DriverModalComponent,
        TruckModalComponent,
        TrailerModalComponent,
        ContactModalComponent,
        AccountModalComponent,
        BrokerModalComponent,
        ShipperModalComponent,
        OwnerModalComponent,
        UserModalComponent,
        TaskModalComponent,
        TtRegistrationModalComponent,
        TtFhwaInspectionModalComponent,
        FuelPurchaseModalComponent,
        FuelStopModalComponent,
        ViolationModalComponent,
        AccidentModalComponent,
        RepairShopModalComponent,
        RepairPmModalComponent,
        RepairOrderModalComponent,
        ProfileUpdateModalComponent,
        // Load Modal
        LoadModalComponent,
        LoadModalHazardousComponent,
        LoadModalProgressBarComponent,
        LoadStopComponent,
        LoadModalStatusesComponent,
        LoadFinancialComponent,
        //-------------
        // Payroll Modals
        PayrollBonusModalComponent,
        PayrollCreditBonusComponent,
        PayrollDeducationModalComponent,
        //-------------
        TtTitleModalComponent,
        ConfirmationModalComponent,
        MapSettingsModalComponent,
        MapRouteModalComponent,

        //----------------------------
        MapListComponent,
        MapListCardComponent,
        MapMarkerDropdownComponent,
        TaTabSwitchComponent,
        CustomScrollbarComponent,
        MapsComponent,
        ProgressInvoicesComponent,
        TaUploadFilesComponent,
        TaCopyComponent,
        AutoclosePopoverComponent,
        CustomToastMessagesComponent,
        MapToolbarComponent,
        AutoclosePopoverComponent,
        InputAddressDropdownComponent,
        TaCustomCardV2Component,
        PayrollStatusesComponent,
        TaCheckboxCardComponent,
        GpsProgressbarComponent,
        TableModalComponent,
        TaPickupDeliveryComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule.withConfig({
            warnOnNgModelWithFormControl: 'never',
        }),
        NgSelectModule,
        NgbModule,
        RouterModule,
        PipesModule,
        ProfileImagesModule,
        AngularSvgIconModule.forRoot(),
        AngularSvgIconPreloaderModule.forRoot({
            configUrl: '../../assets/preload-svg/preload-svg.json',
        }),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCw4WQw1T4N6TjFWdS731mM09x88SGW81I',
            libraries: ['geometry', 'places'],
        }),
        AgmDirectionModule,
        LottieModule.forRoot({ player: playerFactory }),
        NgxSliderModule,
        GooglePlaceModule,
        DragDropModule,
        ScrollingModule,
        NgxMaskModule.forRoot(),
        Ng5SliderModule,
        NgxDropzoneModule,
        CroppieModule,
        PdfViewerModule,
        DirectivesModule,
        /* TruckassistTableModule, */
        AppTooltipeModule,
        ChartsModule,
        TaNoteModule,
        AgmSnazzyInfoWindowModule,
        TaSpinnerModule,
        ObserversModule,
    ],
    exports: [
        // Modules
        FormsModule,
        AppTooltipeModule,
        ReactiveFormsModule,
        NgSelectModule,
        AngularSvgIconModule,
        AgmCoreModule,
        NgbModule,
        GooglePlaceModule,
        PipesModule,
        DragDropModule,
        ScrollingModule,
        NgxMaskModule,
        Ng5SliderModule,
        NgxDropzoneModule,
        CroppieModule,
        NgxSliderModule,
        PdfViewerModule,
        AppTooltipeModule,
        ProfileImagesModule,
        AgmSnazzyInfoWindowModule,
        AgmDirectionModule,
        ApplicantReviewFeedbackComponent,

        // Components
        TabSwitcherComponent,
        //TaNoteContainerComponent,
        TaStatusSwitchComponent,
        TaStatusSelectComponent,
        DeleteDialogComponent,
        SvgDefinitionsComponent,
        CustomDatetimePickersComponent,
        CalendarDatesMainComponent,
        CalendarDaysComponent,
        CalendarLeftComponent,
        DateCalendarsComponent,
        TaInputRadiobuttonsComponent,
        TaUserReviewComponent,
        TaUploadFileComponent,
        TaUploadFilesCarouselComponent,
        TaUploadDropzoneComponent,
        TaInputArrowsComponent,
        CustomScrollbarComponent,
        GpsProgressbarComponent,

        DetailsDropdownComponent,
        TaReCardComponent,
        TaDetailsHeaderCardComponent,
        TaCustomCardComponent,
        TaCustomCardV2Component,
        TaCheckboxComponent,
        TaCommonHeaderComponent,
        TaReCardComponent,
        TaInputDropdownComponent,
        TaInputNoteComponent,
        TaInputComponent,
        TaCounterComponent,
        TaNgxSliderComponent,
        TaLogoChangeComponent,
        TaLikeDislikeComponent,
        TaCurrencyProgressBarComponent,
        TaChartComponent,
        FilterComponent,
        TaTabSwitchComponent,
        MapListComponent,
        MapListCardComponent,
        MapMarkerDropdownComponent,
        MapsComponent,
        MapToolbarComponent,

        ProgressInvoicesComponent,

        TaCopyComponent,
        TaInputDropdownLabelComponent,
        DirectivesModule,
        TaUploadFilesComponent,

        InputAddressDropdownComponent,

        // Modals Components
        ApplicantModalComponent,
        TaModalComponent,
        DriverModalComponent,
        TruckModalComponent,
        TrailerModalComponent,
        ContactModalComponent,
        AccountModalComponent,
        BrokerModalComponent,
        ShipperModalComponent,
        OwnerModalComponent,
        UserModalComponent,
        TaskModalComponent,
        TtRegistrationModalComponent,
        TtFhwaInspectionModalComponent,
        FuelPurchaseModalComponent,
        FuelStopModalComponent,
        ViolationModalComponent,
        AccidentModalComponent,
        RepairShopModalComponent,
        RepairPmModalComponent,
        RepairOrderModalComponent,
        ProfileUpdateModalComponent,
        // Load Modal
        LoadModalComponent,
        LoadModalHazardousComponent,
        LoadModalProgressBarComponent,
        LoadStopComponent,
        LoadModalStatusesComponent,
        LoadFinancialComponent,
        //-------------
        // Payroll Modals
        PayrollBonusModalComponent,
        PayrollCreditBonusComponent,
        PayrollDeducationModalComponent,
        //-------------
        TtTitleModalComponent,
        ConfirmationModalComponent,
        MapSettingsModalComponent,
        MapRouteModalComponent,
        PayrollStatusesComponent,

        TaCheckboxCardComponent,
        TaPickupDeliveryComponent,
        TableModalComponent
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
