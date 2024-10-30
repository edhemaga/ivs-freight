import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    AbstractControl,
    ReactiveFormsModule,
    FormControl,
} from '@angular/forms';

import { debounceTime, Subject, takeUntil } from 'rxjs';

// moment
import moment from 'moment';

// bootstrap
import {
    NgbActiveModal,
    NgbModule,
    NgbPopover,
} from '@ng-bootstrap/ng-bootstrap';

import {
    CDK_DRAG_CONFIG,
    CdkDragDrop,
    DragDropModule,
    moveItemInArray,
} from '@angular/cdk/drag-drop';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { LoadModalFinancialComponent } from '@pages/load/pages/load-modal/components/load-modal-financial/load-modal-financial.component';
import { LoadModalStopComponent } from '@pages/load/pages/load-modal/components/load-modal-stop/load-modal-stop.component';
import { BrokerModalComponent } from '@pages/customer/pages/broker-modal/broker-modal.component';
import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
//import { TaMapsComponent } from '@shared/components/ta-maps/ta-maps.component';
import { TaCommentComponent } from '@shared/components/ta-comment/ta-comment.component';
import { LoadModalHazardousComponent } from '@pages/load/pages/load-modal/components/load-modal-hazardous/load-modal-hazardous.component';
import { LoadModalWaitTimeComponent } from '@pages/load/pages/load-modal/components/load-modal-wait-time/load-modal-wait-time.component';
import { LoadDetailsItemCommentsComponent } from '@pages/load/pages/load-details/components/load-details-item/components/load-details-item-comments/load-details-item-comments.component';
import { TaInputDropdownStatusComponent } from '@shared/components/ta-input-dropdown-status/ta-input-dropdown-status.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { LoadService } from '@shared/services/load.service';

// animations
import { fadeInAnimation } from '@pages/load/pages/load-modal/utils/animations/fade-in.animation';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// pipes
import {
    FinancialCalculationPipe,
    LoadDatetimeRangePipe,
    LoadTimeTypePipe,
} from '@pages/load/pages/load-modal/pipes';

// constants
import {
    LoadModalConfig,
    LoadModalConstants,
    LoadModalDragAndDrop,
    LoadStopItemsConfig,
} from '@pages/load/pages/load-modal/utils/constants';

// enums
import {
    LoadModalStringEnum,
    LoadModalPaymentEnum,
} from '@pages/load/pages/load-modal/enums';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';
import { LoadStatusEnum } from '@shared/enums/load-status.enum';

// models
import {
    SignInResponse,
    LoadModalResponse,
    RoutingResponse,
    LoadStopCommand,
    LoadType,
    LoadResponse,
    EnumValue,
    LoadStatus,
    ShipperContactGroupResponse,
    BrokerContactGroupResponse,
    TruckTypeResponse,
    TrailerTypeResponse,
    TagResponse,
    LoadStopItemResponse,
    DispatchLoadModalResponse,
    LoadStatusHistoryResponse,
    LoadStopResponse,
    CommentResponse,
    FileResponse,
    CreateLoadTemplateCommand,
    LoadPaymentPayResponse,
    ShipperLoadModalResponse,
    LoadShortResponse,
    LoadStatusResponse,
    LoadBillingAdditionalResponse,
    ShipperShortResponse,
} from 'appcoretruckassist';
import { LoadStopItemCommand } from 'appcoretruckassist/model/loadStopItemCommand';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { MapRoute } from '@shared/models/map-route.model';
import { Load } from '@pages/load/models/load.model';
import { EditData } from '@shared/models/edit-data.model';
import { FileEvent } from '@shared/models/file-event.model';
import { TaProgresBarComponent } from '@shared/components/ta-progres-bar/ta-progres-bar.component';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import {
    LoadModalTab,
    SelectedStatus,
    LoadYearDropdown,
    LoadStopItemDropdownLists,
    LoadItemStop,
    LoadAdditionalBilling,
    LoadBilling,
    LoadPayment,
    LoadModalInvoiceProgress,
    LoadAdditionalPayment,
    LoadModalWaitTimeFormField,
    LoadStopRoutes,
    LoadStop,
    LoadShipper,
} from './models';

// Svg Routes
import { LoadModalSvgRoutes } from '@pages/load/pages/load-modal/utils/svg-routes/load-modal-svg-routes';
import {
    CaMapComponent,
    ICaMapProps,
    CaInputDropdownComponent,
    CaInputComponent,
} from 'ca-components';

@Component({
    selector: 'app-load-modal',
    templateUrl: './load-modal.component.html',
    styleUrls: ['./load-modal.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,
        DragDropModule,

        // components
        TaAppTooltipV2Component,
        TaModalComponent,
        TaTabSwitchComponent,
        TaCustomCardComponent,
        TaCheckboxComponent,
        LoadModalStopComponent,
        LoadModalFinancialComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        //TaMapsComponent,
        TaCommentComponent,
        LoadModalHazardousComponent,
        TaProgresBarComponent,
        LoadModalWaitTimeComponent,
        LoadDetailsItemCommentsComponent,
        TaInputDropdownStatusComponent,
        TaModalTableComponent,
        CaMapComponent,
        CaInputDropdownComponent,
        CaInputComponent,

        // pipes
        FinancialCalculationPipe,
        LoadDatetimeRangePipe,
        LoadTimeTypePipe,
    ],
    animations: [fadeInAnimation],
    providers: [
        FinancialCalculationPipe,
        { provide: CDK_DRAG_CONFIG, useValue: LoadModalDragAndDrop.Config },
    ],
})
export class LoadModalComponent implements OnInit, OnDestroy, DoCheck {
    @ViewChild('originElement') originElement: ElementRef;
    @ViewChild('popover') popover: NgbPopover;
    @ViewChild('trailerInputDropdown')
    trailerInputDropdown: TaInputDropdownComponent;
    @ViewChild('truckInputDropdown')
    truckInputDropdown: TaInputDropdownComponent;

    @Input() editData: EditData;

    data /* : ICaMapProps  */ = {
        center: {
            lat: 41.860119,
            lng: -87.660156,
        },
        mapZoom: 1,
        markers: [],
        clustermarkers: [],
        routingMarkers: [],
        mapOptions: {
            fullscreenControl: false,
            disableDefaultUI: true,
            restriction: {
                latLngBounds: {
                    north: 75,
                    south: 9,
                    west: -170,
                    east: -50,
                },
                strictBounds: true,
            },
            streetViewControl: false,
            styles: [
                {
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#f5f5f5',
                        },
                    ],
                },
                {
                    elementType: 'labels.icon',
                    stylers: [
                        {
                            visibility: 'on',
                        },
                    ],
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'transit',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'administrative.country',
                    stylers: [
                        {
                            color: '#616161',
                        },
                        {
                            visibility: 'on',
                        },
                        {
                            weight: 1,
                        },
                    ],
                },
                {
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#616161',
                        },
                    ],
                },
                {
                    elementType: 'labels.text.stroke',
                    stylers: [
                        {
                            color: '#f5f5f5',
                        },
                    ],
                },
                {
                    featureType: 'administrative.land_parcel',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#bdbdbd',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#eeeeee',
                        },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#757575',
                        },
                    ],
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#e5e5e5',
                        },
                    ],
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
                {
                    featureType: 'landscape',
                    elementType: 'labels',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#ffffff',
                        },
                    ],
                },
                {
                    featureType: 'road',
                    stylers: [
                        {
                            saturation: -100,
                        },
                        {
                            lightness: 30,
                        },
                    ],
                },
                {
                    featureType: 'road.arterial',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#757575',
                        },
                    ],
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#dadada',
                        },
                    ],
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#616161',
                        },
                    ],
                },
                {
                    featureType: 'road.local',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
                {
                    featureType: 'transit.line',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#e5e5e5',
                        },
                    ],
                },
                {
                    featureType: 'transit.station',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#eeeeee',
                        },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [
                        {
                            color: '#c9c9c9',
                        },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [
                        {
                            color: '#9e9e9e',
                        },
                    ],
                },
            ],
            keyboardShortcuts: false,
            panControl: true,
            gestureHandling: 'greedy',
        },
    };

    private destroy$ = new Subject<void>();

    public companyUser: SignInResponse = null;

    // form
    public loadForm: UntypedFormGroup;
    public isFormDirty: boolean = false;
    public loadModalSvgRoutes = LoadModalSvgRoutes;
    // modal
    public originHeight: number;
    public loadModalSize: string = LoadModalStringEnum.MODAL_SIZE;
    public isConvertedToTemplate: boolean = false;
    public isTemplateSelected: boolean = false;

    public loadNumber: string;

    // tabs
    public tabs: LoadModalTab[] = [];
    public selectedTab: number = 1;

    public selectExtraStopType: number[] = [];
    public typeOfExtraStops: LoadModalTab[][] = [];

    public selectedStopTimePickup: number = 5;
    public stopTimeTabsPickup: LoadModalTab[] = [];

    public selectedStopTimeDelivery: number = 7;
    public stopTimeTabsDelivery: LoadModalTab[] = [];

    public stopTimeTabsExtraStops: LoadModalTab[][] = [];

    // labels
    public labelsTemplate: EnumValue[] = [];
    public labelsDispatcher: any[] = [];
    public labelsCompanies: any[] = [];
    public labelsDispatches: any[] = [];
    public originLabelsDispatches: any[] = [];
    public labelsGeneralCommodity: EnumValue[] = [];

    // broker labels
    public labelsBroker: any[] = [];
    public labelsBrokerContacts: any[] = [];
    public originBrokerContacts: BrokerContactGroupResponse[] = [];

    // shipper labels
    public labelsShipperContacts: any[] = [];
    public originShipperContacts: ShipperContactGroupResponse[] = [];

    // requirement labels
    public labelsTruckReq: TruckTypeResponse[] = [];
    public labelsTrailerReq: TrailerTypeResponse[] = [];
    public labelsDoorType: EnumValue[] = [];
    public labelsSuspension: EnumValue[] = [];
    public labelsTrailerLength: EnumValue[] = [];
    public labelsYear: any[] = [];
    public labelsShippers: any[] = [];

    public selectedTemplate: any = null;
    public selectedDispatcher: any = null;
    public selectedCompany: any = null;
    public selectedDispatches: any = null;
    public selectedGeneralCommodity: EnumValue = null;
    public selectedStatus: SelectedStatus = null;

    // broker
    public selectedBroker: any = null;
    public selectedBrokerContact: any = null;

    // pickup Shipper
    public selectedPickupShipper: any = null;
    public selectedPickupShipperContact: any = null;

    // delivery Shipper
    public selectedDeliveryShipper: any = null;
    public selectedDeliveryShipperContact: any = null;

    // requirements
    public selectedTruckReq: TruckTypeResponse = null;
    public selectedTrailerReq: TrailerTypeResponse = null;
    public selectedDoorType: EnumValue = null;
    public selectedSuspension: EnumValue = null;
    public selectedTrailerLength: EnumValue = null;
    public selectedYear: LoadYearDropdown = null;

    // load stop item labels
    public stopItemDropdownLists: LoadStopItemDropdownLists;
    public statusDropDownList: SelectedStatus[];
    public previousStatus: SelectedStatus;
    public savedPickupStopItems: LoadStopItemCommand[] = [];
    public isPickupItemsVisible: boolean = false;
    public savedDeliveryStopItems: LoadStopItemCommand[] = [];
    public isDeliveryItemsVisible: boolean = false;
    public savedExtraStopItems: LoadStopItemCommand[][] = [];
    public isExtraStopItemsVisible: boolean[] = [];
    public isPickupStopValid: boolean = true;
    public isDeliveryStopValid: boolean = true;
    public stopItemsValid: boolean[] = [];

    // input configurations
    public loadDispatchesTTDInputConfig: ITaInput;
    public loadBrokerInputConfig: ITaInput;
    public loadBrokerContactsInputConfig: ITaInput;
    public loadPickupShipperInputConfig: ITaInput;
    public loadPickupShipperContactsInputConfig: ITaInput;
    public loadDeliveryShipperInputConfig: ITaInput;
    public loadDeliveryShipperContactsInputConfig: ITaInput;
    public loadCompanyInputConfig = LoadModalConfig.LOAD_COMPANY_INPUT_CONFIG;
    public loadCommodityInputConfig = LoadModalConfig.LOAD_COMMODITY_CONFIG;
    public loadWeightInputConfig = LoadModalConfig.LOAD_WEIGHT_CONFIG;
    public loadTrailerLengthInputConfig =
        LoadModalConfig.LOAD_TRAILER_LENGTH_CONFIG;
    public loadDoorTypeInputConfig = LoadModalConfig.LOAD_DOOR_TYPE_CONFIG;
    public loadSuspensionInputConfig = LoadModalConfig.LOAD_SUSPENSION_CONFIG;
    public loadYearInputConfig = LoadModalConfig.LOAD_YEAR_CONFIG;
    public loadTemplateInputConfig = LoadModalConfig.LOAD_TEMPLATE_CONFIG;
    public loadMainCompanyInputConfig =
        LoadModalConfig.LOAD_MAIN_COMPANY_CONFIG;
    public loadPickupEndDateInputConfig = LoadModalConfig.LOAD_PICKUP_END_DATE;
    public loadExtraStopsToDateInputConfig =
        LoadModalConfig.LOAD_EXTRA_STOPS_TO_DATE;
    public loadDeliveryDateToInputConfig =
        LoadModalConfig.LOAD_DELIVERY_DATE_TO;
    public loadBaseRateInputConfig = LoadModalConfig.LOAD_BASE_RATE;
    public loadBillingDropdownInputConfig =
        LoadModalConfig.LOAD_BILLING_DROPDOWN;
    public loadPaymentTypeInputConfig = LoadModalConfig.LOAD_PAYMENT_TYPE;
    public loadPaydateInputConfig = LoadModalConfig.LOAD_PAYDATE;
    public loadPaymentDropdownInputConfig =
        LoadModalConfig.LOAD_PAYMENT_DROPDOWN;
    public loadReferenceInputConfig = LoadModalConfig.LOAD_REFERENCE_NUMBER;
    public getStatusInputConfig = LoadModalConfig.STATUS_INPUT_CONFIG;
    public getDriverRateInputConfig = LoadModalConfig.DRIVE_RATE_INPUT_CONFIG;
    public getAdjustedRateInputConfig =
        LoadModalConfig.ADJUSTED_RATE_INPUT_CONFIG;
    public getRevisedRateInputConfig =
        LoadModalConfig.REVISED_RATE_INPUT_CONFIG;
    public getTonuRateInputConfig = LoadModalConfig.TONU_RATE_INPUT_CONFIG;
    // extra Stop configuration
    public selectedExtraStopShipper: any[] = [];
    public selectedExtraStopShipperContact: any[] = [];
    public loadExtraStopsShipperInputConfig: ITaInput[] = [];
    public loadExtraStopsShipperContactsInputConfig: ITaInput[] = [];
    public loadExtraStopsDateRange: EnumValue[] | boolean[] = [];
    public selectedExtraStopTime: any[] = [];
    public previousDeliveryStopOrder: number;
    public extraStopNumbers: number[] = [];

    // stop items
    public pickupStopItems: LoadStopItemResponse[] = [];
    public deliveryStopItems: LoadStopItemResponse[] = [];
    public extraStopItems: LoadStopItemCommand[] = [];

    public isCreatedNewStopItemsRow: LoadItemStop;
    public isEachStopItemsRowValid: boolean = true;

    // billing & payment
    public originalAdditionalBillingTypes: LoadAdditionalBilling[] = [];
    public additionalBillingTypes: LoadAdditionalBilling[] = [];
    public loadModalBill: LoadBilling;
    public loadModalPayment: LoadPayment;
    public selectedAdditionalBillings: LoadAdditionalBilling[] = [];
    public isAvailableAdjustedRate: boolean = false;
    public isAvailableAdvanceRate: boolean = false;
    public isVisibleBillDropdown: boolean = false;
    public isVisiblePayment: boolean = false;
    public showPaymentArray: boolean = false;

    // documents
    public documents: UploadFile[] | FileResponse[] = [];
    public filesForDelete: number[] = [];
    public tags: TagResponse[] = [];

    // comments
    public comments: CommentResponse[] = [];

    public isCommenting: boolean = false;

    // map routes
    public loadStopRoutes: MapRoute[] = [];

    // hazardous dropdown
    public isHazardousPicked: boolean = false;
    public isHazardousVisible: boolean = false;

    // stops date range
    public pickupDateRange: boolean = false;
    public deliveryDateRange: boolean = false;

    public isActivePickupStop: boolean = false;
    public isActiveDeliveryStop: boolean = false;

    // leg
    public totalLegMiles: number = null;
    public totalLegHours: number = null;
    public totalLegMinutes: number = null;
    public totalLegCost: number = null;
    public paymentMethodsDropdownList: EnumValue[];
    public paymentTypesDropdownList: EnumValue[] = [];
    public orginalPaymentTypesDropdownList: EnumValue[];
    public showRevisedRate: boolean;
    public showTonuRate: boolean;
    public pickupStatusHistory: LoadStatusHistoryResponse[] = [];
    public deliveryStatusHistory: LoadStatusHistoryResponse[] = [];
    public extraStopStatusHistory: LoadStatusHistoryResponse[][] = [];
    public isDragAndDropActive: boolean = false;
    public reorderingStarted: boolean;
    public reorderingSaveError: boolean = false;
    private originalStatus: string;
    private stops: LoadStopResponse[];
    public isCommentsVisible: boolean = false;
    private lastCallTimeout: any;
    private debounceDelay: number = 1000;
    private isPreviousStatus: boolean = false;
    private statusHistory: LoadStatusHistoryResponse[];
    private initialinvoicedDate: string;
    public modalTableTypeEnum = ModalTableTypeEnum;

    public isButtonDisabled: boolean = false;
    private emptyMiles: number;
    private originalShippers: ShipperLoadModalResponse[];
    private originalLoadStatus: LoadStatusResponse;
    private isEditingMode: boolean = false;
    public previuosStatusModel: SelectedStatus;
    public modalTitle: string;
    public isActiveLoad: boolean;
    public editName: string;
    public isMilesLoading: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private loadService: LoadService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        public financialCalculationPipe: FinancialCalculationPipe,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getCompanyUser();

        this.createForm();

        this.getConstantData();

        this.getLoadDropdowns();

        this.trackBillingPayment();
    }

    ngDoCheck(): void {
        if (this.originElement) {
            this.originHeight =
                this.originElement.nativeElement.getBoundingClientRect().height;

            this.cdRef.detectChanges();
        }
    }

    public get billingCount(): number {
        // plus 1 from base
        return (
            this.additionalBillings().length +
            1 +
            +!!this.showDriverRate +
            +!!this.showAdjustedRate +
            +!!this.showTonuRate +
            +!!this.showRevisedRate
        );
    }

    public get showAdjustedRate(): boolean {
        const selectedDispatcher: DispatchLoadModalResponse =
            this.selectedDispatches;

        if (selectedDispatcher) {
            return !!selectedDispatcher.driver.owner;
        }

        return false;
    }

    public get showDriverRate(): boolean {
        return (
            this.selectedDispatches &&
            this.selectedDispatches.payType === LoadModalStringEnum.FLAT_RATE
        );
    }

    public get getPickupTimeToInputConfig(): ITaInput {
        return LoadModalConfig.getPickupTimeToInputConfig(
            this.selectedStopTimePickup
        );
    }

    public get getPickupDateFromInputConfig(): ITaInput {
        return LoadModalConfig.getPickupDateFromInputConfig(
            this.pickupDateRange
        );
    }

    public get getPickupTimeFromInputConfig(): ITaInput {
        return LoadModalConfig.getPickupTimeFromInputConfig(
            this.selectedStopTimePickup
        );
    }

    public get getDeliveryDateFromInputConfig(): ITaInput {
        return LoadModalConfig.getDeliveryDateFromInputConfig(
            this.deliveryDateRange
        );
    }

    public get getDeliveryTimeFromInputConfig(): ITaInput {
        return LoadModalConfig.getDeliveryTimeFromInputConfig(
            this.selectedStopTimeDelivery
        );
    }

    public get getDeliveryTimeToInputConfig(): ITaInput {
        return LoadModalConfig.getDeliveryTimeToInputConfig(
            this.selectedStopTimeDelivery
        );
    }

    public getExtraStopsDateFromInputConfig(label: boolean): ITaInput {
        return LoadModalConfig.getExtraStopsDateFromInputConfig(label);
    }

    public getExtraStopsDateFromTimeFromInputConfig(label: string): ITaInput {
        return LoadModalConfig.getExtraStopsDateFromTimeFromInputConfig(label);
    }

    public getDispatcherInputConfig(): ITaInput {
        return LoadModalConfig.getDispatcherInputConfig(
            this.selectedDispatcher?.logoName ||
                this.selectedDispatcher?.avatarFile?.url,
            this.selectedDispatcher?.name
        );
    }

    public get getTruckTypeIdInputConfig(): ITaInput {
        return LoadModalConfig.getTruckTypeIdInputConfig(this.selectedTruckReq);
    }

    public get getTrailerInputConfig(): ITaInput {
        return LoadModalConfig.getTrailerInputConfig(
            this.selectedTrailerReq,
            this.selectedTruckReq
        );
    }

    public getExtraStopsDateToTimeToInputConfig(label: string): ITaInput {
        return LoadModalConfig.getExtraStopsDateToTimeToInputConfig(label);
    }

    public getBillingValueInputConfig(additional: FormControl): ITaInput {
        return LoadModalConfig.getBillingValueInputConfig(additional);
    }

    public getPaymentInputConfig(additional: FormControl): ITaInput {
        return LoadModalConfig.getPaymentInputConfig(additional);
    }

    public loadInvoiceDateInputConfig(): ITaInput {
        const loadWasInvoiced =
            !!this.statusHistory?.find((status) => status.status.id === 8) ||
            this.selectedStatus?.id === 8;
        return LoadModalConfig.getInvoiceDate(
            loadWasInvoiced,
            !loadWasInvoiced &&
                !this.loadForm.get(LoadModalStringEnum.INVOICED_DATE).value
        );
    }

    public get invoicePercent(): LoadModalInvoiceProgress {
        if (this.loadForm.value) {
            const daysLeft = Math.abs(
                this.loadForm.get(LoadModalStringEnum.AGE_UNPAID).value
            );
            const daysToPay = this.loadForm.get(
                LoadModalStringEnum.DAYS_TO_PAY
            ).value;
            return {
                daysLeft: daysLeft,
                daysToPay,
                percent: (daysLeft / daysToPay) * 100,
            };
        }
    }

    public get adjustedRate(): string | null {
        return this.loadForm.get(LoadModalStringEnum.ADJUSTED_RATE).value;
    }

    public get isTemplateLoad(): boolean {
        return (
            this.editData?.selectedTab === TableStringEnum.TEMPLATE &&
            this.editData.loadAction !== TableStringEnum.CONVERT_TO_TEMPLATE
        );
    }

    private isLoadActive(statusType: string): boolean {
        return (
            statusType === TableStringEnum.PENDING_2 ||
            statusType === TableStringEnum.ACTIVE_2 ||
            statusType === TableStringEnum.CLOSED_2
        );
    }

    public checkIfLoadIsActive(): boolean {
        const statusType = this.loadForm.get(
            LoadModalStringEnum.STATUS_TYPE
        ).value;

        return !this.isConvertedToTemplate && this.isLoadActive(statusType);
    }

    private generateModalText(): void {
        this.modalTitle = this.generateModalTitle();
        this.editName = this.isConvertedToTemplate ? null : this.loadNumber;
    }

    public generateModalTitle(): string {
        const statusType = this.loadForm.get(
            LoadModalStringEnum.STATUS_TYPE
        ).value;

        if (this.isTemplateLoad) {
            return 'Edit Load Template';
        }

        if (this.isConvertedToTemplate) {
            return 'Create Load Template';
        }

        if (statusType === TableStringEnum.PENDING_2) {
            return 'Edit Pending Load';
        }

        if (statusType === TableStringEnum.ACTIVE_2) {
            return 'Edit Active Load';
        }

        if (statusType === TableStringEnum.CLOSED_2) {
            return 'Edit Closed Load';
        }

        return 'Create Load';
    }

    public get getLoadStatus(): string {
        return (this.editData?.data as LoadResponse)?.status.statusString;
    }

    public get isInvoicedStatus(): boolean {
        return this.getLoadStatus === LoadModalStringEnum.STATUS_INVOICED;
    }

    public get isLoadClosed(): boolean {
        return this.selectedStatus?.name === LoadModalStringEnum.STATUS_CLOSED;
    }

    public get isRequirementVisible(): boolean {
        return !!(this.selectedTrailerReq || this.selectedTruckReq);
    }

    public trackByIdentity(_, index: number): number {
        return index;
    }

    public handleTonuRateVisiblity(): void {
        const show =
            this.selectedStatus &&
            (this.selectedStatus.name ===
                LoadModalStringEnum.STATUS_CANCELLED ||
                this.selectedStatus.name === LoadModalStringEnum.STATUS_TONU);

        this.inputService.changeValidators(
            this.loadForm.get(LoadModalStringEnum.TONU),
            show
        );
        if (!show) {
            this.loadForm.get(LoadModalStringEnum.TONU).patchValue(null);
        }

        this.showTonuRate = show;
    }

    private handleRevisedRateVisiblity(): void {
        const show = this.isLoadClosed;
        this.inputService.changeValidators(
            this.loadForm.get(LoadModalStringEnum.REVISED),
            show
        );

        if (!show) {
            this.loadForm.get(LoadModalStringEnum.REVISED).patchValue(null);
        }
        this.showRevisedRate = !!show;
    }

    private createForm(): void {
        this.loadForm = this.formBuilder.group({
            templateName: [
                null,
                this.isConvertedToTemplate && Validators.required,
            ],
            name: [null],
            loadTemplateId: [null],
            dispatcherId: [null],
            status: [null],
            companyId: [this.companyUser.companyName, Validators.required],
            brokerId: [null, Validators.required],
            brokerContactId: [null],
            referenceNumber: [null, Validators.required],
            generalCommodity: [null],
            weight: [null],
            dispatchId: [null],

            // requirement
            truckTypeId: [null],
            trailerTypeId: [null],
            trailerLengthId: [null],
            doorType: [null],
            suspension: [null],
            year: [null],
            liftgate: [false],

            // driver message
            driverMessage: [null],

            // pickup stop
            pickupStop: [LoadModalStringEnum.PICKUP_2],
            pickupStopOrder: [1],
            pickupShipper: [null, Validators.required],
            pickupAddress: [null],
            pickupShipperContactId: [null],
            pickupDateFrom: [null, Validators.required],
            pickupDateTo: [null],
            pickupTimeFrom: [null, Validators.required],
            pickupTimeTo: [null, Validators.required],
            pickuplegMiles: [null],
            pickuplegHours: [null],
            pickuplegMinutes: [null],
            pickuplegCost: [null],
            pickupInvolveDriver: [null],
            pickupStatusHistory: [null],
            pickupWaitTime: [null],
            pickupShape: [null],
            // delivery stop
            deliveryStop: [LoadModalStringEnum.DELIVERY_2],
            deliveryStopOrder: [1],
            deliveryShipper: [null, Validators.required],
            deliveryShipperContactId: [null],
            deliveryDateFrom: [null, Validators.required],
            deliveryDateTo: [null],
            deliveryTimeFrom: [null, Validators.required],
            deliveryTimeTo: [null, Validators.required],
            deliverylegMiles: [null],
            deliverylegHours: [null],
            deliverylegMinutes: [null],
            deliverylegCost: [null],
            deliverWaitTime: [null],
            deliveryShape: [null],

            // extra stops
            extraStops: this.formBuilder.array([]),

            // billing
            baseRate: [null, Validators.required],
            adjustedRate: [null],
            driverRate: [null],
            advancePay: [null],
            additionalBillings: this.formBuilder.array([]),
            additionalPayments: this.formBuilder.array([]),
            paymentDropdown: [null],
            billingDropdown: [null],
            invoicedDate: [null],
            payType: [null],
            paymentDate: [null],
            ageUnpaid: [null],
            daysToPay: [null],
            revisedRate: [null],
            tonuRate: [null],

            // note, files
            note: [null],
            files: [null],
            tags: [null],

            // legs
            loadMiles: [0],
            totalMiles: [0],
            emptyMiles: [0],
            totalHours: [0],
            totalMinutes: [0],

            statusType: [null],
            loadRequirementsId: [null],
            arrive: [null],
            depart: [null],
            id: [null],
        });
    }

    private watchFormChanges() {
        setTimeout(() => {
            this.formService.checkFormChange(this.loadForm);

            if (
                this.editData?.loadAction ===
                    TableStringEnum.CONVERT_TO_TEMPLATE ||
                (this.editData?.loadAction ===
                    TableStringEnum.CONVERT_TO_LOAD &&
                    this.loadForm.valid)
            ) {
                this.isFormDirty = true;
            }

            if (
                this.editData?.loadAction ===
                TableStringEnum.CONVERT_TO_TEMPLATE
            ) {
                this.inputService.changeValidators(
                    this.loadForm.get(LoadModalStringEnum.TEMPLATE_NAME)
                );
            }

            this.formService.formValueChange$
                .pipe(takeUntil(this.destroy$))
                .subscribe((isFormChange: boolean) => {
                    this.isFormDirty = isFormChange;
                });
        }, 500);
    }

    private getCompanyUser(): void {
        this.companyUser = JSON.parse(
            localStorage.getItem(LoadModalStringEnum.USER)
        );
    }

    private getConstantData(): void {
        this.tabs = LoadModalConstants.LOAD_MODAL_TABS;

        // tabs
        this.typeOfExtraStops = JSON.parse(
            JSON.stringify(LoadModalConstants.TYPE_OF_EXTRA_STOPS)
        );
        this.stopTimeTabsPickup = JSON.parse(
            JSON.stringify(LoadModalConstants.STOP_TIME_TABS_PICKUP)
        );
        this.stopTimeTabsDelivery = JSON.parse(
            JSON.stringify(LoadModalConstants.STOP_TIME_TABS_DELIVERY)
        );
        this.stopTimeTabsExtraStops = JSON.parse(
            JSON.stringify(LoadModalConstants.STOP_TIME_TABS_EXTRA_STOPS)
        );

        // configurations
        this.loadDispatchesTTDInputConfig =
            LoadModalConfig.LOAD_DISPATCHES_TTD_INPUT_CONFIG;
        this.loadBrokerInputConfig = LoadModalConfig.LOAD_BROKER_INPUT_CONFIG;
        this.loadBrokerContactsInputConfig =
            LoadModalConfig.LOAD_BROKER_CONTACTS_INPUT_CONFIG;
        this.loadPickupShipperInputConfig =
            LoadModalConfig.LOAD_PICKUP_SHIPPER_INPUT_CONFIG;
        this.loadPickupShipperContactsInputConfig =
            LoadModalConfig.LOAD_PICKUP_SHIPPER_CONTACTS_INPUT_CONFIG;
        this.loadDeliveryShipperInputConfig =
            LoadModalConfig.LOAD_DELIVERY_SHIPPER_INPUT_CONFIG;
        this.loadDeliveryShipperContactsInputConfig =
            LoadModalConfig.LOAD_DELIVERY_SHIPPER_CONTACTS_INPUT_CONFIG;

        // billing & payment
        this.loadModalBill = LoadModalConstants.LOAD_MODAL_BILL;
        this.loadModalPayment = LoadModalConstants.LOAD_MODAL_PAYMENT;

        // stop items
        this.isCreatedNewStopItemsRow =
            LoadStopItemsConfig.IS_CREATED_NEW_STOP_ITEMS_ROW;
    }

    public validatePickupStops(
        loadForm: UntypedFormGroup
    ):
        | LoadModalStringEnum.INVALID_STATUS
        | LoadModalStringEnum.STEP_INVALID_STATUS
        | null
        | LoadModalStringEnum.VALID_STATUS {
        if (this.pickupStopItems.length && !this.isPickupStopValid) {
            return LoadModalStringEnum.STEP_INVALID_STATUS;
        }

        const pickupShipperControl = loadForm.get(
            LoadModalStringEnum.PICKUP_SHIPPER
        );
        const pickupDateFromControl = loadForm.get(
            LoadModalStringEnum.PICKUP_DATE_FROM
        );
        const pickupDateToControl = loadForm.get(
            LoadModalStringEnum.PICKUP_DATE_TO
        );
        const pickupTimeFromControl = loadForm.get(
            LoadModalStringEnum.PICKUP_TIME_FROM
        );
        const pickupTimeToControl = loadForm.get(
            LoadModalStringEnum.PICKUP_TIME_TO
        );

        const isFormDirty =
            pickupShipperControl.touched ||
            pickupDateFromControl.touched ||
            pickupDateToControl.touched ||
            pickupTimeFromControl.touched ||
            pickupTimeToControl.touched;

        let isFormInvalid = (
            pickupShipperControl.errors ||
            pickupDateFromControl.errors ||
            pickupDateToControl.errors ||
            pickupTimeFromControl.errors
        )?.required;

        if (this.selectedStopTimePickup === 5) {
            isFormInvalid =
                isFormInvalid || pickupTimeToControl.errors?.required;
        }

        if (isFormDirty && isFormInvalid) {
            return LoadModalStringEnum.INVALID_STATUS;
        }

        if (!isFormInvalid) {
            return LoadModalStringEnum.VALID_STATUS;
        }

        return null;
    }

    public get areOriginAndDestinationValid(): boolean {
        return (
            this.validatePickupStops(this.loadForm) ===
                LoadModalStringEnum.VALID_STATUS &&
            this.validateDeliveryStops(this.loadForm) ===
                LoadModalStringEnum.VALID_STATUS
        );
    }

    public validateExtraStops(
        loadFormArray: UntypedFormArray,
        indx: number
    ):
        | LoadModalStringEnum.STEP_INVALID_STATUS
        | LoadModalStringEnum.INVALID_STATUS
        | null
        | LoadModalStringEnum.VALID_STATUS {
        const stopForm = loadFormArray.at(indx);
        if (
            this.savedExtraStopItems[indx]?.length &&
            !this.stopItemsValid[indx]
        ) {
            return LoadModalStringEnum.STEP_INVALID_STATUS;
        }

        if (stopForm.dirty && !stopForm.valid) {
            return LoadModalStringEnum.INVALID_STATUS;
        }

        if (stopForm.valid) {
            return LoadModalStringEnum.VALID_STATUS;
        }
        return null;
    }

    public validateDeliveryStops(
        loadForm: UntypedFormGroup
    ):
        | LoadModalStringEnum.INVALID_STATUS
        | LoadModalStringEnum.STEP_INVALID_STATUS
        | null
        | LoadModalStringEnum.VALID_STATUS {
        if (this.deliveryStopItems.length && !this.isDeliveryStopValid) {
            return LoadModalStringEnum.STEP_INVALID_STATUS;
        }

        const deliveryShipperControl = loadForm.get(
            LoadModalStringEnum.DELIVERY_SHIPPER
        );
        const deliveryDateFromControl = loadForm.get(
            LoadModalStringEnum.DELIVERY_DATE_FROM
        );
        const deliveryDateToControl = loadForm.get(
            LoadModalStringEnum.DELIVERY_DATE_TO
        );
        const deliveryTimeFromControl = loadForm.get(
            LoadModalStringEnum.DELIVERY_TIME_FROM
        );
        const deliveryTimeToControl = loadForm.get(
            LoadModalStringEnum.DELIVERY_TIME_TO
        );

        const isFormDirty =
            deliveryShipperControl.touched ||
            deliveryDateFromControl.touched ||
            deliveryDateToControl.touched ||
            deliveryTimeFromControl.touched ||
            deliveryTimeToControl.touched;

        let isFormInvalid = (
            deliveryShipperControl.errors ||
            deliveryDateFromControl.errors ||
            deliveryDateToControl.errors ||
            deliveryTimeFromControl.errors
        )?.required;

        if (
            this.selectedStopTimeDelivery !== 8 &&
            this.selectedStopTimeDelivery !== 2
        ) {
            if (!isFormInvalid) {
                isFormInvalid =
                    isFormInvalid || deliveryTimeToControl?.errors?.required;
            }
        }

        if (isFormDirty && isFormInvalid) {
            return LoadModalStringEnum.INVALID_STATUS;
        }

        if (!isFormInvalid) {
            return LoadModalStringEnum.VALID_STATUS;
        }
        return null;
    }

    public markInputAsTouched(fieldName: string, clear?: boolean): void {
        const field = this.loadForm.get(fieldName);

        if (field) {
            field.markAsTouched();

            if (clear) {
                field.patchValue(null);
            }
        }
    }

    public onTabChange(event: EnumValue, action: string, indx?: number): void {
        switch (action) {
            case LoadModalStringEnum.FTL_LTL:
                this.selectedTab = event.id;

                this.tabs = this.tabs.map((tab) => {
                    return {
                        ...tab,
                        checked: tab.name === event.name,
                    };
                });

                break;
            case LoadModalStringEnum.STOP_TAB:
                const orderNumber =
                    event.id === 1 || (event.id >= 3000 && event.id < 4000)
                        ? 3000 + indx
                        : 4000 + indx;

                this.selectExtraStopType[indx] = orderNumber;

                this.typeOfExtraStops[indx] = this.typeOfExtraStops[indx].map(
                    (typeOfExtraStop) => {
                        return {
                            ...typeOfExtraStop,
                            checked: typeOfExtraStop.name === event.name,
                        };
                    }
                );

                this.loadExtraStops()
                    .at(indx)
                    .get(LoadModalStringEnum.STOP_TYPE)
                    .patchValue(
                        orderNumber
                            .toString()
                            .startsWith(LoadModalStringEnum.NUMBER_4)
                            ? LoadModalStringEnum.DELIVERY_2
                            : LoadModalStringEnum.PICKUP_2
                    );

                const obj = this.numberOfLoadExtraStops();

                if (!this.editData) {
                    if (
                        event.id
                            .toString()
                            .startsWith(LoadModalStringEnum.NUMBER_4)
                    ) {
                        this.previousDeliveryStopOrder = this.loadForm.get(
                            LoadModalStringEnum.DELIVERY_STOP_ORDER
                        ).value;

                        this.loadExtraStops()
                            .at(indx)
                            .get(LoadModalStringEnum.STOP_ORDER)
                            .patchValue(obj.numberOfDeliveries);

                        this.loadForm
                            .get(LoadModalStringEnum.DELIVERY_STOP_ORDER)
                            .patchValue(obj.numberOfDeliveries + 1);
                    } else {
                        this.loadExtraStops()
                            .at(indx)
                            .get(LoadModalStringEnum.STOP_ORDER)
                            .patchValue(obj.numberOfPickups);

                        if (this.previousDeliveryStopOrder)
                            this.loadForm
                                .get(LoadModalStringEnum.DELIVERY_STOP_ORDER)
                                .patchValue(this.previousDeliveryStopOrder);
                    }

                    this.calculateStopOrder();
                }

                this.getStopNumbers();

                if (this.selectedExtraStopShipper[indx]) this.drawStopOnMap();

                break;
            case LoadModalStringEnum.STOP_TIME_PICKUP:
                if (!event) return;
                this.selectedStopTimePickup = event.id;

                this.stopTimeTabsPickup = this.stopTimeTabsPickup.map((tab) => {
                    return {
                        ...tab,
                        checked:
                            tab.name?.toLowerCase() ===
                            event.name?.toLowerCase(),
                    };
                });

                if (
                    this.selectedStopTimePickup === 6 ||
                    this.selectedStopTimePickup === 2
                ) {
                    this.inputService.changeValidators(
                        this.loadForm.get(LoadModalStringEnum.PICKUP_TIME_TO),
                        false
                    );
                    this.loadForm
                        .get(LoadModalStringEnum.PICKUP_TIME_TO)
                        .markAsUntouched();

                    this.addDateRange(LoadModalStringEnum.PICKUP, false, indx);
                } else {
                    this.inputService.changeValidators(
                        this.loadForm.get(LoadModalStringEnum.PICKUP_TIME_TO)
                    );
                    this.loadForm
                        .get(LoadModalStringEnum.PICKUP_TIME_TO)
                        .markAsTouched();
                }

                break;
            case LoadModalStringEnum.STOP_TIME_DELIVERY:
                if (!event) return;
                this.selectedStopTimeDelivery = event.id;

                this.stopTimeTabsDelivery = this.stopTimeTabsDelivery.map(
                    (tab) => {
                        return {
                            ...tab,
                            checked:
                                tab.name?.toLowerCase() ===
                                event.name?.toLowerCase(),
                        };
                    }
                );

                if (
                    this.selectedStopTimeDelivery === 8 ||
                    this.selectedStopTimeDelivery === 2
                ) {
                    this.inputService.changeValidators(
                        this.loadForm.get(LoadModalStringEnum.DELIVERY_TIME_TO),
                        false
                    );
                    this.loadForm
                        .get(LoadModalStringEnum.DELIVERY_TIME_TO)
                        .markAsUntouched();

                    this.addDateRange(LoadModalStringEnum.DELIVERY, false);
                } else {
                    this.inputService.changeValidators(
                        this.loadForm.get(LoadModalStringEnum.DELIVERY_TIME_TO)
                    );
                    this.loadForm
                        .get(LoadModalStringEnum.DELIVERY_TIME_TO)
                        .markAsTouched();
                }

                break;
            case LoadModalStringEnum.EXTRA_STOPS_TIME:
                if (!event) return;
                this.selectedExtraStopTime[indx] = event?.id ? event.id : event;

                this.stopTimeTabsExtraStops[indx] = this.stopTimeTabsExtraStops[
                    indx
                ].map((tab) => {
                    return {
                        ...tab,
                        checked:
                            tab.name.toLowerCase() === event.name.toLowerCase(),
                    };
                });

                if (
                    this.selectedExtraStopTime[indx]
                        .toString()
                        .startsWith(LoadModalStringEnum.NUMBER_9) ||
                    this.selectedExtraStopTime[indx] === 2
                ) {
                    this.inputService.changeValidators(
                        this.loadExtraStops()
                            .at(indx)
                            .get(LoadModalStringEnum.TIME_TO),
                        false
                    );

                    this.addDateRange(
                        LoadModalStringEnum.EXTRA_STOP,
                        false,
                        indx
                    );
                } else {
                    this.inputService.changeValidators(
                        this.loadExtraStops()
                            .at(indx)
                            .get(LoadModalStringEnum.TIME_TO)
                    );
                }

                break;
            default:
                break;
        }
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        const addNew = data.action === TaModalActionEnums.SAVE_AND_ADD_NEW;
        switch (data.action) {
            case TaModalActionEnums.SAVE:
            case TaModalActionEnums.SAVE_AND_ADD_NEW:
                // Disable double click
                if (this.isButtonDisabled) {
                    return;
                }

                this.isButtonDisabled = true;

                if (this.loadForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.loadForm);
                    this.isButtonDisabled = false;
                    return;
                }

                if (
                    this.isEditingMode &&
                    this.editData?.selectedTab === TableStringEnum.TEMPLATE &&
                    this.editData.loadAction === TableStringEnum.CONVERT_TO_LOAD
                ) {
                    this.updateLoadTemplate(addNew);
                } else if (this.isConvertedToTemplate) {
                    this.saveLoadTemplate(addNew);
                } else {
                    this.isActiveLoad
                        ? this.updateLoad(addNew)
                        : this.createNewLoad(addNew);
                }
                break;
            case TaModalActionEnums.CONVERT_TO_TEMPLATE:
                this.isConvertedToTemplate = true;

                this.inputService.changeValidators(
                    this.loadForm.get(LoadModalStringEnum.TEMPLATE_NAME)
                );

                this.generateModalText();

                break;
            case TaModalActionEnums.CONVERT_TO_LOAD:
                this.isConvertedToTemplate = false;
                this.generateModalText();

                break;
            default:
                break;
        }
    }

    public onSelectDropdown(
        event: any,
        action: string,
        index?: number,
        isClick?: boolean
    ): void {
        switch (action) {
            case LoadModalStringEnum.STATUS:
                this.loadForm
                    .get(LoadModalStringEnum.STATUS)
                    .patchValue(event.status);
                this.isPreviousStatus = event.isPreviousStatus;
                this.selectedStatus = event.status;
                this.handleRevisedRateVisiblity();
                this.handleTonuRateVisiblity();
                break;
            case LoadModalStringEnum.PAYMENT_TYPE:
                const value = this.additionalPayments().at(index);
                if (event) {
                    value.patchValue({
                        ...value,
                        paymentMethod: event.id,
                    });
                }
                break;
            case LoadModalStringEnum.DISPATCHER:
                this.selectedDispatcher = event;

                if (this.selectedDispatcher) {
                    this.labelsDispatches = this.originLabelsDispatches.filter(
                        (item) =>
                            item.dispatcherId === this.selectedDispatcher.id
                    );

                    this.selectedDispatches = null;

                    this.loadForm
                        .get(LoadModalStringEnum.DISPATCH_ID)
                        .patchValue(null);
                } else {
                    this.labelsDispatches = this.originLabelsDispatches;
                }

                break;
            case LoadModalStringEnum.COMPANY:
                this.selectedCompany = event;

                break;
            case LoadModalStringEnum.GENERAL_COMMODITY:
                this.selectedGeneralCommodity = event;

                this.isHazardousPicked =
                    event?.name?.toLowerCase() ===
                    LoadModalStringEnum.HAZARDOUS;

                if (!this.isHazardousPicked) this.isHazardousVisible = false;

                break;
            case LoadModalStringEnum.DISPATCHES:
                this.onSelectDropdownDispatches(event);

                break;
            case LoadModalStringEnum.BROKER:
                this.onSelectDropdownBroker(event);

                break;
            case LoadModalStringEnum.BROKER_CONTACT:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: LoadModalStringEnum.OPEN,
                        payload: {
                            key: LoadModalStringEnum.LOAD_MODAL,
                            value: this.getPreviusModalValues(),
                            id: this.selectedBroker.id,
                            data: this.selectedBroker,
                            openedTab: TableStringEnum.CONTRACT,
                        },
                        type: TableStringEnum.EDIT,
                        component: BrokerModalComponent,
                        size: LoadModalStringEnum.SMALL,
                    });
                } else {
                    if (event) {
                        this.selectedBrokerContact = {
                            ...event,
                            name: event?.name?.concat(
                                LoadModalStringEnum.EMPTY_SPACE_STRING,
                                event?.phone
                            ),
                        };
                        this.loadBrokerContactsInputConfig = {
                            ...this.loadBrokerContactsInputConfig,
                            multipleInputValues: {
                                options: [
                                    {
                                        value: event.name,
                                        logoName: null,
                                    },
                                    {
                                        value: event.originalPhone,
                                        second_value: event.phoneExtension
                                            ? `#${event.phoneExtension}`
                                            : null,
                                        logoName: null,
                                    },
                                ],
                                customClass:
                                    LoadModalStringEnum.LOAD_BROKER_CONTACT,
                            },
                            isDisabled: false,
                        };
                    } else {
                        this.loadBrokerContactsInputConfig = {
                            ...this.loadBrokerContactsInputConfig,
                            multipleInputValues: null,
                        };
                    }
                }

                break;
            case LoadModalStringEnum.SHIPPER_PICKUP:
                this.onSelectDropdownShipperPickup(event, isClick);

                break;
            case LoadModalStringEnum.SHIPPER_CONTACT_PICKUP:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: LoadModalStringEnum.OPEN,
                        payload: {
                            key: LoadModalStringEnum.LOAD_MODAL,
                            value: this.getPreviusModalValues(),
                            id: this.selectedPickupShipper.id,
                        },
                        type: LoadModalStringEnum.EDIT_CONTACT,
                        component: ShipperModalComponent,
                        size: LoadModalStringEnum.SMALL,
                    });
                } else {
                    if (event) {
                        this.selectedPickupShipperContact = {
                            ...event,
                            name: event?.name?.concat(
                                LoadModalStringEnum.EMPTY_SPACE_STRING,
                                event?.phone
                            ),
                        };

                        this.loadPickupShipperContactsInputConfig = {
                            ...this.loadPickupShipperContactsInputConfig,
                            multipleInputValues: {
                                options: [
                                    {
                                        value: event.name,
                                        logoName: null,
                                    },
                                    {
                                        value: event.originalPhone,
                                        second_value: event.phoneExtension
                                            ? `#${event.phoneExtension}`
                                            : null,
                                        logoName: null,
                                    },
                                ],
                                customClass:
                                    LoadModalStringEnum.LOAD_SHIPPER_CONTACT,
                            },
                            isDisabled: false,
                        };
                    } else {
                        this.loadPickupShipperContactsInputConfig = {
                            ...this.loadPickupShipperContactsInputConfig,
                            multipleInputValues: null,
                        };
                    }
                }

                break;
            case LoadModalStringEnum.SHIPPER_DELIVERY:
                this.onSelectDropdownShipperDelivery(event, isClick);

                break;
            case LoadModalStringEnum.SHIPPER_CONTACT_DELIVERY:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: LoadModalStringEnum.OPEN,
                        payload: {
                            key: LoadModalStringEnum.LOAD_MODAL,
                            value: this.getPreviusModalValues(),
                            id: this.selectedDeliveryShipper.id,
                        },
                        type: LoadModalStringEnum.EDIT_CONTACT,
                        component: ShipperModalComponent,
                        size: LoadModalStringEnum.SMALL,
                    });
                } else {
                    if (event) {
                        this.selectedDeliveryShipperContact = {
                            ...event,
                            name: event?.name?.concat(
                                LoadModalStringEnum.EMPTY_SPACE_STRING,
                                event?.phone
                            ),
                        };

                        this.selectedDeliveryShipperContact = {
                            ...this.selectedDeliveryShipperContact,
                            multipleInputValues: {
                                options: [
                                    {
                                        value: event.name,
                                        logoName: null,
                                    },
                                    {
                                        value: event.originalPhone,
                                        second_value: event.phoneExtension
                                            ? `#${event.phoneExtension}`
                                            : null,
                                        logoName: null,
                                    },
                                ],
                                customClass:
                                    LoadModalStringEnum.LOAD_SHIPPER_CONTACT,
                            },
                            isDisabled: false,
                        };
                    } else {
                        this.selectedDeliveryShipperContact = {
                            ...this.selectedDeliveryShipperContact,
                            multipleInputValues: null,
                        };
                    }
                }

                break;
            case LoadModalStringEnum.SHIPPER_EXTRA_STOPS:
                this.onSelectDropdownShipperExtraStops(event, index, isClick);

                break;
            case LoadModalStringEnum.SHIPPER_CONTACT_EXTRA_STOPS:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: LoadModalStringEnum.OPEN,
                        payload: {
                            key: LoadModalStringEnum.LOAD_MODAL,
                            value: this.getPreviusModalValues(),
                            id: this.selectedExtraStopShipper[index].id,
                        },
                        type: LoadModalStringEnum.EDIT_CONTACT,
                        component: ShipperModalComponent,
                        size: LoadModalStringEnum.SMALL,
                    });
                } else {
                    if (event) {
                        this.selectedExtraStopShipperContact[index] = {
                            ...event,
                            name: event?.name?.concat(
                                LoadModalStringEnum.EMPTY_SPACE_STRING,
                                event?.phone
                            ),
                        };

                        this.selectedExtraStopShipperContact[index] = {
                            ...this.selectedExtraStopShipperContact[index],
                            multipleInputValues: {
                                options: [
                                    {
                                        value: event.name,
                                        logoName: null,
                                    },
                                    {
                                        value: event.originalPhone,
                                        second_value: event.phoneExtension
                                            ? `#${event.phoneExtension}`
                                            : null,
                                        logoName: null,
                                    },
                                ],
                                customClass:
                                    LoadModalStringEnum.LOAD_SHIPPER_CONTACT,
                            },
                            isDisabled: false,
                        };
                    } else {
                        this.selectedExtraStopShipperContact[index] = {
                            ...this.selectedExtraStopShipperContact[index],
                            multipleInputValues: null,
                        };
                    }
                }

                break;
            case LoadModalStringEnum.TRUCK_REQ:
                this.selectedTruckReq = event;

                this.labelsTrailerReq = this.labelsTrailerReq.map((trailer) => {
                    const disableTrailerOption =
                        trailer.id === 16 &&
                        this.selectedTruckReq &&
                        this.selectedTruckReq.id !== 10;

                    if (trailer.id === 16 && this.selectedTruckReq?.id === 10)
                        this.selectedTrailerReq = trailer;

                    return {
                        ...trailer,
                        disabled: disableTrailerOption,
                    };
                });

                if (
                    (this.selectedTruckReq?.id >= 3 &&
                        this.selectedTruckReq?.id <= 8) ||
                    (this.selectedTruckReq?.id !== 10 &&
                        this.selectedTrailerReq?.id === 16)
                ) {
                    this.selectedTrailerReq = null;
                    this.trailerInputDropdown?.superControl.reset();
                }

                break;
            case LoadModalStringEnum.TRAILER_REQ:
                this.selectedTrailerReq = event;

                this.labelsTruckReq = this.labelsTruckReq.map((truck) => {
                    const disableTruckOption =
                        truck.id === 10 &&
                        this.selectedTrailerReq &&
                        this.selectedTrailerReq.id !== 16;

                    if (truck.id === 10 && this.selectedTrailerReq?.id === 16)
                        this.selectedTruckReq = truck;

                    return {
                        ...truck,
                        disabled: disableTruckOption,
                    };
                });

                if (
                    this.selectedTruckReq?.id === 10 &&
                    this.selectedTrailerReq?.id !== 16
                ) {
                    this.selectedTruckReq = null;
                    this.truckInputDropdown?.superControl.reset();
                }

                break;
            case LoadModalStringEnum.DOOR_TYPE:
                this.selectedDoorType = event;

                break;
            case LoadModalStringEnum.SUSPENSION:
                this.selectedSuspension = event;

                break;
            case LoadModalStringEnum.LENGTH:
                this.selectedTrailerLength = event;

                break;
            case LoadModalStringEnum.YEAR:
                this.selectedYear = event;

                break;
            default:
                break;
        }
    }

    private onSelectDropdownDispatches(event): void {
        if (event) {
            this.selectedDispatches = {
                ...event,
                name: event?.truck?.name
                    ?.concat(
                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                        event?.trailer?.name
                    )
                    .concat(
                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                        event?.driver?.name
                    ),
            };

            // draw stop on map
            this.drawStopOnMap();
            this.loadDispatchesTTDInputConfig = {
                ...this.loadDispatchesTTDInputConfig,
                multipleLabel: {
                    labels: [
                        LoadModalStringEnum.TRUCK,
                        LoadModalStringEnum.TRAILER,
                        LoadModalStringEnum.DRIVER,
                        event?.payType ? LoadModalStringEnum.DRIVER_PAY : null,
                    ],
                    customClass: LoadModalStringEnum.LOAD_DISPATCHES_TTD,
                },
                multipleInputValues: {
                    options: [
                        {
                            id: event?.truck?.id,
                            value: event?.truck?.name,
                            logoName: event?.truck?.logoName,
                            isImg: false,
                            isSvg: true,
                            folder: LoadModalStringEnum.COMMON,
                            subFolder: LoadModalStringEnum.TRUCKS,
                            logoType: event?.truck?.logoType,
                        },
                        {
                            value: event?.trailer?.name,
                            logoName: event?.trailer?.logoName,
                            isImg: false,
                            isSvg: true,
                            folder: LoadModalStringEnum.COMMON,
                            subFolder: LoadModalStringEnum.TRAILERS,
                            logoType: event?.trailer?.logoType,
                        },
                        {
                            value: event?.driver?.name,
                            logoName: event?.driver?.logoName
                                ? event?.driver?.logoName
                                : LoadModalStringEnum.NO_URL,
                            isImg: true,
                            isSvg: false,
                            folder: null,
                            subFolder: null,
                            isOwner: event?.driver?.owner,
                            logoType: null,
                        },
                        {
                            value: event?.payType,
                            logoName: null,
                            isImg: false,
                            isSvg: false,
                            folder: null,
                            subFolder: null,
                            logoType: null,
                        },
                    ],
                    customClass: LoadModalStringEnum.LOAD_DISPATCHES_TTD,
                },
            };

            if (
                this.selectedDispatches.payType ===
                LoadModalStringEnum.FLAT_RATE
            ) {
                this.inputService.changeValidators(
                    this.loadForm.get(LoadModalStringEnum.DRIVER_RATE)
                );

                this.inputService.changeValidators(
                    this.loadForm.get(LoadModalStringEnum.ADJUSTED_RATE),
                    false
                );

                this.additionalBillingTypes =
                    this.additionalBillingTypes.filter((item) => item.id !== 6);
            } else {
                this.inputService.changeValidators(
                    this.loadForm.get(LoadModalStringEnum.DRIVER_RATE),
                    false
                );
            }
        } else {
            this.loadDispatchesTTDInputConfig = {
                ...this.loadDispatchesTTDInputConfig,
                multipleLabel: {
                    labels: [
                        LoadModalStringEnum.TRUCK,
                        LoadModalStringEnum.TRAILER,
                        LoadModalStringEnum.DRIVER,
                        LoadModalStringEnum.DRIVER_PAY,
                    ],
                    customClass: LoadModalStringEnum.LOAD_DISPATCHES_TTD,
                },
                multipleInputValues: null,
            };

            this.selectedDispatches = null;

            this.inputService.changeValidators(
                this.loadForm.get(LoadModalStringEnum.DRIVER_RATE),
                false
            );

            this.inputService.changeValidators(
                this.loadForm.get(LoadModalStringEnum.ADJUSTED_RATE),
                false
            );

            this.loadForm
                .get(LoadModalStringEnum.PICKUP_LEG_MILES)
                .patchValue(null);
        }

        const isAdjustedRate = !!this.selectedDispatches?.driver?.owner;

        this.inputService.changeValidators(
            this.loadForm.get(LoadModalStringEnum.ADJUSTED_RATE),
            isAdjustedRate
        );
    }

    private onSelectDropdownBroker(event): void {
        if (event?.canOpenModal) {
            this.ngbActiveModal.close();

            this.modalService.setProjectionModal({
                action: LoadModalStringEnum.OPEN,
                payload: {
                    key: LoadModalStringEnum.LOAD_MODAL,
                    value: this.getPreviusModalValues(),
                },
                type: LoadModalStringEnum.NEW,
                component: BrokerModalComponent,
                size: LoadModalStringEnum.SMALL,
            });
        } else {
            this.selectedBroker =
                event && Object.keys(event).length ? event : null;

            if (this.selectedBroker) {
                this.loadBrokerInputConfig = {
                    ...this.loadBrokerInputConfig,
                    multipleInputValues: {
                        options: [
                            {
                                value: this.selectedBroker.businessName,
                                logoName: null,
                            },
                            {
                                value: this.selectedBroker.availableCredit,
                                second_value: this.selectedBroker.creditLimit,
                                logoName: null,
                                isProgressBar:
                                    this.selectedBroker.availableCreditType
                                        ?.name !==
                                    LoadModalStringEnum.UNLIMITED,
                            },
                            {
                                value: this.selectedBroker.loadsCount,
                                logoName: null,
                                isCounter: true,
                            },
                        ],
                        customClass: LoadModalStringEnum.LOAD_BROKER,
                    },
                };

                this.labelsBrokerContacts = this.originBrokerContacts
                    .map((el) => {
                        return {
                            ...el,
                            contacts: el?.contacts?.filter(
                                (subEl) =>
                                    subEl.brokerId === this.selectedBroker.id
                            ),
                        };
                    })
                    .filter((item) => item.contacts?.length);

                this.labelsBrokerContacts.unshift({
                    id: 7655,
                    name: LoadModalStringEnum.ADD_NEW,
                });

                if (this.labelsBrokerContacts[1]?.contacts[0]) {
                    this.selectedBrokerContact =
                        this.labelsBrokerContacts[1].contacts[0];

                    if (this.selectedBrokerContact) {
                        this.loadForm
                            .get(LoadModalStringEnum.BROKER_CONTACT_ID)
                            .patchValue(this.selectedBrokerContact.fullName);

                        this.loadBrokerContactsInputConfig = {
                            ...this.loadBrokerContactsInputConfig,
                            multipleInputValues: {
                                options: [
                                    {
                                        value: this.selectedBrokerContact.name,
                                        logoName: null,
                                    },
                                    {
                                        value: this.selectedBrokerContact
                                            .originalPhone,
                                        second_value: this.selectedBrokerContact
                                            .phoneExtension
                                            ? `#${this.selectedBrokerContact.phoneExtension}`
                                            : null,
                                        logoName: null,
                                    },
                                ],
                                customClass:
                                    LoadModalStringEnum.LOAD_BROKER_CONTACT,
                            },
                            isDisabled: false,
                            blackInput: false,
                        };
                    }
                } else {
                    this.selectedBrokerContact = null;

                    this.labelsBrokerContacts = [
                        {
                            id: 7655,
                            name: LoadModalStringEnum.ADD_NEW,
                        },
                    ];

                    this.loadForm
                        .get(LoadModalStringEnum.BROKER_CONTACT_ID)
                        .patchValue(null);

                    this.loadBrokerContactsInputConfig = {
                        ...this.loadBrokerContactsInputConfig,
                        multipleInputValues: null,
                        isDisabled: false,
                    };
                }
            }
            // restart value if clear
            else {
                this.labelsBrokerContacts = this.originBrokerContacts;

                this.loadBrokerInputConfig = {
                    ...this.loadBrokerInputConfig,
                    multipleInputValues: null,
                };

                this.selectedBrokerContact = null;

                this.loadForm
                    .get(LoadModalStringEnum.BROKER_CONTACT_ID)
                    .patchValue(null);

                this.loadBrokerContactsInputConfig = {
                    ...this.loadBrokerContactsInputConfig,
                    multipleInputValues: null,
                    isDisabled: true,
                };
            }
        }
    }

    private onSelectDropdownShipperPickup(event, isClick: boolean): void {
        if (event?.canOpenModal) {
            this.ngbActiveModal.close();

            this.modalService.setProjectionModal({
                action: LoadModalStringEnum.OPEN,
                payload: {
                    key: LoadModalStringEnum.LOAD_MODAL,
                    value: this.getPreviusModalValues(),
                },
                type: LoadModalStringEnum.NEW,
                component: ShipperModalComponent,
                size: LoadModalStringEnum.SMALL,
            });
        } else {
            this.selectedPickupShipper = event;

            this.updateShipperWorkingTime(
                isClick,
                event,
                LoadModalStringEnum.PICKUP_TIME_FROM,
                LoadModalStringEnum.PICKUP_TIME_TO,
                this.selectedStopTimePickup === 6 ||
                    this.selectedStopTimePickup === 2
            );

            // draw stop on map
            this.drawStopOnMap();

            if (this.selectedPickupShipper) {
                this.loadPickupShipperInputConfig = {
                    ...this.loadPickupShipperInputConfig,
                    multipleInputValues: {
                        options: [
                            {
                                value: this.selectedPickupShipper.businessName,
                                logoName: null,
                            },
                            {
                                value: this.selectedPickupShipper.address,
                                logoName: null,
                            },
                        ],
                        customClass: LoadModalStringEnum.LOAD_SHIPPER,
                    },
                };

                this.labelsShipperContacts = this.originShipperContacts
                    .map((el) => {
                        return {
                            ...el,
                            contacts: el?.contacts?.filter(
                                (subEl) =>
                                    subEl.shipperId ===
                                    this.selectedPickupShipper.id
                            ),
                        };
                    })
                    .filter((item) => item.contacts?.length);

                this.labelsShipperContacts.unshift({
                    id: 7655,
                    name: LoadModalStringEnum.ADD_NEW,
                });

                if (this.labelsShipperContacts[1]?.contacts[0]) {
                    this.selectedPickupShipperContact =
                        this.labelsShipperContacts[1].contacts[0];

                    this.loadForm
                        .get(LoadModalStringEnum.PICKUP_SHIPPER_CONTACT_ID)
                        .patchValue(this.selectedPickupShipperContact.fullName);

                    this.loadPickupShipperContactsInputConfig = {
                        ...this.loadPickupShipperContactsInputConfig,
                        multipleInputValues: {
                            options: [
                                {
                                    value: this.selectedPickupShipperContact
                                        .name,
                                    logoName: null,
                                },
                                {
                                    value: this.selectedPickupShipperContact
                                        .originalPhone,
                                    second_value: this
                                        .selectedPickupShipperContact
                                        .phoneExtension
                                        ? `#${this.selectedPickupShipperContact.phoneExtension}`
                                        : null,
                                    logoName: null,
                                },
                            ],
                            customClass:
                                LoadModalStringEnum.LOAD_SHIPPER_CONTACT,
                        },
                        isDisabled: false,
                    };
                } else {
                    this.selectedPickupShipperContact = null;

                    this.labelsShipperContacts = [
                        {
                            id: 7655,
                            name: LoadModalStringEnum.ADD_NEW,
                        },
                    ];

                    this.loadForm
                        .get(LoadModalStringEnum.PICKUP_SHIPPER_CONTACT_ID)
                        .patchValue(null);

                    this.loadPickupShipperContactsInputConfig = {
                        ...this.loadPickupShipperContactsInputConfig,
                        multipleInputValues: null,
                        isDisabled: false,
                    };
                }
            }
            // restart value if clear
            else {
                this.labelsShipperContacts = this.originShipperContacts;

                this.loadPickupShipperInputConfig = {
                    ...this.loadPickupShipperInputConfig,
                    multipleInputValues: null,
                };

                this.selectedPickupShipperContact = null;

                this.loadForm
                    .get(LoadModalStringEnum.PICKUP_SHIPPER_CONTACT_ID)
                    .patchValue(null);

                this.loadPickupShipperContactsInputConfig = {
                    ...this.loadPickupShipperContactsInputConfig,
                    multipleInputValues: null,
                    isDisabled: true,
                };
            }
        }
    }

    private onSelectDropdownShipperDelivery(event, isClick: boolean): void {
        if (event?.canOpenModal) {
            this.ngbActiveModal.close();

            this.modalService.setProjectionModal({
                action: LoadModalStringEnum.OPEN,
                payload: {
                    key: LoadModalStringEnum.LOAD_MODAL,
                    value: this.getPreviusModalValues(),
                },
                type: LoadModalStringEnum.NEW,
                component: ShipperModalComponent,
                size: LoadModalStringEnum.SMALL,
            });
        } else {
            this.selectedDeliveryShipper = event;

            this.updateShipperWorkingTime(
                isClick,
                event,
                LoadModalStringEnum.DELIVERY_TIME_FROM,
                LoadModalStringEnum.DELIVERY_TIME_TO,
                this.selectedStopTimeDelivery === 2 ||
                    this.selectedStopTimeDelivery === 8
            );
            // draw stop on map
            this.drawStopOnMap();

            if (this.selectedDeliveryShipper) {
                this.loadDeliveryShipperInputConfig = {
                    ...this.loadDeliveryShipperInputConfig,
                    multipleInputValues: {
                        options: [
                            {
                                value: this.selectedDeliveryShipper
                                    .businessName,
                                logoName: null,
                            },
                            {
                                value: this.selectedDeliveryShipper.address,
                                logoName: null,
                            },
                        ],
                        customClass: LoadModalStringEnum.LOAD_SHIPPER,
                    },
                };

                this.labelsShipperContacts = this.originShipperContacts
                    .map((el) => {
                        return {
                            ...el,
                            contacts: el?.contacts?.filter(
                                (subEl) =>
                                    subEl.shipperId ===
                                    this.selectedDeliveryShipper.id
                            ),
                        };
                    })
                    .filter((item) => item.contacts?.length);

                this.labelsShipperContacts.unshift({
                    id: 7655,
                    name: LoadModalStringEnum.ADD_NEW,
                });

                if (this.labelsShipperContacts[1]?.contacts[0]) {
                    this.selectedDeliveryShipperContact =
                        this.labelsShipperContacts[1].contacts[0];

                    this.loadForm
                        .get(LoadModalStringEnum.DELIVERY_SHIPPER_CONTACT_ID)
                        .patchValue(
                            this.selectedDeliveryShipperContact.fullName
                        );

                    this.loadDeliveryShipperContactsInputConfig = {
                        ...this.loadDeliveryShipperContactsInputConfig,
                        multipleInputValues: {
                            options: [
                                {
                                    value: this.selectedDeliveryShipperContact
                                        .name,
                                    logoName: null,
                                },
                                {
                                    value: this.selectedDeliveryShipperContact
                                        .originalPhone,
                                    second_value: this
                                        .selectedDeliveryShipperContact
                                        .phoneExtension
                                        ? `#${this.selectedDeliveryShipperContact.phoneExtension}`
                                        : null,
                                    logoName: null,
                                },
                            ],
                            customClass:
                                LoadModalStringEnum.LOAD_SHIPPER_CONTACT,
                        },
                        isDisabled: false,
                    };
                } else {
                    this.selectedDeliveryShipperContact = null;

                    this.labelsShipperContacts = [
                        {
                            id: 7655,
                            name: LoadModalStringEnum.ADD_NEW,
                        },
                    ];

                    this.loadForm
                        .get(LoadModalStringEnum.DELIVERY_SHIPPER_CONTACT_ID)
                        .patchValue(null);

                    this.loadDeliveryShipperContactsInputConfig = {
                        ...this.loadDeliveryShipperContactsInputConfig,
                        multipleInputValues: null,
                        isDisabled: false,
                    };
                }
            }
            // restart value if clear
            else {
                this.labelsShipperContacts = this.originShipperContacts;

                this.loadPickupShipperInputConfig = {
                    ...this.loadPickupShipperInputConfig,
                    multipleInputValues: null,
                };

                this.selectedDeliveryShipperContact = null;

                this.loadForm
                    .get(LoadModalStringEnum.DELIVERY_SHIPPER_CONTACT_ID)
                    .patchValue(null);

                this.loadDeliveryShipperContactsInputConfig = {
                    ...this.loadDeliveryShipperContactsInputConfig,
                    multipleInputValues: null,
                    isDisabled: true,
                };
            }
        }
    }

    private updateShipperWorkingTime(
        isClick: boolean,
        shipper: ShipperLoadModalResponse,
        timeFromKey: LoadModalStringEnum,
        timeToKey: LoadModalStringEnum,
        isAppointment: boolean,
        field?: AbstractControl
    ) {
        if (!isClick) return;

        const timeFrom = field
            ? field.get(timeFromKey)
            : this.loadForm.get(timeFromKey);
        const timeTo = field
            ? field.get(timeToKey)
            : this.loadForm.get(timeToKey);

        if (shipper?.shippingOpenTwentyFourHours) {
            timeFrom?.patchValue('00:00');
            if (!isAppointment) {
                timeTo?.patchValue('00:00');
            }
        } else if (shipper?.receivingFrom) {
            timeFrom?.patchValue(shipper.receivingFrom);
            if (!isAppointment) {
                timeTo?.patchValue(shipper.receivingTo);
            }
        } else {
            timeFrom?.patchValue(null);
            timeFrom?.markAsTouched();

            timeTo?.patchValue(null);
            if (isAppointment) {
                timeTo?.markAsTouched();
            }
        }
    }

    private onSelectDropdownShipperExtraStops(
        event,
        index: number,
        isClick: boolean
    ): void {
        if (event?.canOpenModal) {
            this.ngbActiveModal.close();

            this.modalService.setProjectionModal({
                action: LoadModalStringEnum.OPEN,
                payload: {
                    key: LoadModalStringEnum.LOAD_MODAL,
                    value: this.getPreviusModalValues(),
                },
                type: LoadModalStringEnum.NEW,
                component: ShipperModalComponent,
                size: LoadModalStringEnum.SMALL,
            });
        } else {
            this.selectedExtraStopShipper[index] = event;
            const isAppointment =
                this.selectedExtraStopTime[index] === 2 ||
                this.selectedExtraStopTime[index]?.toString()?.startsWith('9');
            this.updateShipperWorkingTime(
                isClick,
                event,
                LoadModalStringEnum.TIME_FROM,
                LoadModalStringEnum.TIME_TO,
                isAppointment,
                this.loadExtraStops().at(index)
            );
            this.drawStopOnMap();

            // select extra stop shipper
            if (this.selectedExtraStopShipper[index]) {
                this.loadExtraStopsShipperInputConfig[index] = {
                    ...this.loadExtraStopsShipperInputConfig[index],
                    multipleInputValues: {
                        options: [
                            {
                                value: this.selectedExtraStopShipper[index]
                                    .businessName,
                                logoName: null,
                            },
                            {
                                value: this.selectedExtraStopShipper[index]
                                    .address,
                                logoName: null,
                            },
                            {
                                value: this.selectedExtraStopShipper[index]
                                    .loadsCount,
                                logoName: null,
                                isCounter: true,
                            },
                        ],
                        customClass: LoadModalStringEnum.LOAD_SHIPPER,
                    },
                };

                this.labelsShipperContacts = this.originShipperContacts
                    .map((el) => {
                        return {
                            ...el,
                            contacts: el?.contacts?.filter(
                                (subEl) =>
                                    subEl.shipperId ===
                                    this.selectedExtraStopShipper[index].id
                            ),
                        };
                    })
                    .filter((item) => item.contacts?.length);

                this.labelsShipperContacts.unshift({
                    id: 7655,
                    name: LoadModalStringEnum.ADD_NEW,
                });

                if (this.labelsShipperContacts[1]?.contacts[0]) {
                    this.selectedExtraStopShipperContact[index] =
                        this.labelsShipperContacts[1].contacts[0];

                    this.loadExtraStops()
                        .at(index)
                        .get(LoadModalStringEnum.SHIPPER_CONTACT_ID)
                        .patchValue(
                            this.selectedExtraStopShipperContact[index]
                                ?.fullName
                        );

                    this.loadExtraStopsShipperContactsInputConfig[index] = {
                        ...this.loadExtraStopsShipperContactsInputConfig[index],
                        multipleInputValues: {
                            options: [
                                {
                                    value: this.selectedExtraStopShipperContact[
                                        index
                                    ].name,
                                    logoName: null,
                                },
                                {
                                    value: this.selectedExtraStopShipperContact[
                                        index
                                    ].originalPhone,
                                    second_value: this
                                        .selectedExtraStopShipperContact[index]
                                        .phoneExtension
                                        ? `#${this.selectedExtraStopShipperContact[index].phoneExtension}`
                                        : null,
                                    logoName: null,
                                },
                            ],
                            customClass:
                                LoadModalStringEnum.LOAD_SHIPPER_CONTACT,
                        },
                        isDisabled: false,
                    };
                } else {
                    this.labelsShipperContacts = [
                        { id: 7655, name: LoadModalStringEnum.ADD_NEW },
                    ];

                    this.selectedExtraStopShipperContact[index] = null;

                    this.loadExtraStops()
                        .at(index)
                        .get(LoadModalStringEnum.SHIPPER_CONTACT_ID)
                        .patchValue(null);

                    this.loadExtraStopsShipperContactsInputConfig[index] = {
                        ...this.loadExtraStopsShipperContactsInputConfig[index],
                        multipleInputValues: null,
                        isDisabled: false,
                    };
                }
            }
            // restart value if clear
            else {
                this.labelsShipperContacts = this.originShipperContacts;

                this.loadExtraStopsShipperInputConfig[index] = {
                    ...this.loadExtraStopsShipperInputConfig[index],
                    multipleInputValues: null,
                };

                this.selectedExtraStopShipperContact[index] = null;

                this.loadExtraStops()
                    .at(index)
                    .get(LoadModalStringEnum.SHIPPER_CONTACT_ID)
                    .patchValue(null);

                this.loadExtraStopsShipperContactsInputConfig[index] = {
                    ...this.loadExtraStopsShipperContactsInputConfig[index],
                    multipleInputValues: null,
                    isDisabled: true,
                };
            }
        }
    }

    public onFilesEvent(event: FileEvent): void {
        switch (event.action) {
            case LoadModalStringEnum.ADD:
                this.documents = event.files;

                this.loadForm
                    .get(LoadModalStringEnum.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case LoadModalStringEnum.DELETE_2:
                this.documents = event.files;

                this.loadForm
                    .get(LoadModalStringEnum.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                if (event.deleteId) this.filesForDelete.push(event.deleteId);

                break;
            case LoadModalStringEnum.TAG:
                let changedTag = false;

                event.files.map((item) => {
                    if (item.tagChanged) {
                        changedTag = true;
                    }
                });

                this.loadForm
                    .get(LoadModalStringEnum.TAGS)
                    .patchValue(changedTag ? true : null);

                break;
            default:
                break;
        }
    }

    public toggleStopActivity(
        event: boolean,
        action: string,
        indx?: number
    ): void {
        if (this.isDragAndDropActive) return;
        switch (action) {
            case LoadModalStringEnum.FIRST_PICKUP:
                this.isActivePickupStop = event;

                this.isActiveDeliveryStop = false;
                this.isActivePickupStop = !this.isActivePickupStop;

                this.loadExtraStops().controls.filter((item) => {
                    item.get(LoadModalStringEnum.OPEN_CLOSE).patchValue(false);
                });

                break;
            case LoadModalStringEnum.FIRST_DELIVERY:
                if (!this.selectedPickupShipper) return;
                this.isActiveDeliveryStop = !this.isActiveDeliveryStop;

                this.isActivePickupStop = false;

                this.loadExtraStops().controls.filter((item) => {
                    item.get(LoadModalStringEnum.OPEN_CLOSE).patchValue(false);
                });

                break;
            case LoadModalStringEnum.EXTRA_STOPS:
                this.closeAllLoadExtraStopExceptActive(indx);

                break;
            default:
                break;
        }
    }

    public additionalPayments(): UntypedFormArray {
        return this.loadForm.get(
            LoadModalStringEnum.ADDITIONAL_PAYMENTS
        ) as UntypedFormArray;
    }

    public addPaymentBilling(event: any): void {
        if (event && this.paymentTypesDropdownList.length) {
            this.additionalPayments().push(
                this.createAdditionPaymentBilling({
                    id: null,
                    pay: null,
                    paymentType: null,
                    displayPaymentType: null,
                    payType: null,
                    payDate: event?.billingValue,
                    paymentMethod: event.id,
                    name: event.name,
                })
            );

            this.showPaymentArray = false;
            this.isVisiblePayment = true;
            this.loadForm
                .get(LoadModalStringEnum.PAYMENT_DROPDOWN)
                .patchValue(null);
            this.updatePaymentsList();
        }
    }

    public removePaymentBilling(index: number) {
        this.additionalPayments().removeAt(index);
        this.updatePaymentsList();
    }

    public createAdditionPaymentBilling(
        data: LoadAdditionalPayment
    ): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data.id ?? null],
            name: [data.name],
            pay: [data.pay ?? null],
            advancePay: [null],
            payType: [null],
            payDate: [data?.payDate ? data.payDate : null],
            paymentType: [data.payType?.id || data.paymentMethod || null],
            paymentMethod: [data.paymentMethod ?? null],
            displayPaymentType: [data.displayPaymentType],
        });
    }

    public additionalBillings(): UntypedFormArray {
        return this.loadForm.get(
            LoadModalStringEnum.ADDITIONAL_BILLINGS
        ) as UntypedFormArray;
    }

    public createAdditionaBilling(data: {
        id: number;
        name: string;
        billingValue: number;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : null],
            name: [data?.name ? data.name : null],
            billingValue: [data?.billingValue ? data.billingValue : null],
        });
    }

    public addAdditionalBilling(event: LoadAdditionalBilling): void {
        if (event) {
            this.selectedAdditionalBillings.push(
                this.additionalBillingTypes.find((item) => item.id === event.id)
            );

            const adjustedRate = this.selectedAdditionalBillings.find(
                (item) => item.id === 6
            );

            if (adjustedRate) {
                this.selectedAdditionalBillings.filter((item) => item.id !== 6);

                adjustedRate.checked = true;

                this.selectedAdditionalBillings.unshift(adjustedRate);
            }

            this.additionalBillingTypes = this.additionalBillingTypes.filter(
                (item) => item.id !== event.id
            );

            this.additionalBillings().push(
                this.createAdditionaBilling({
                    id: event.id,
                    name: event.name,
                    billingValue: event?.billingValue,
                })
            );
        }

        this.isVisibleBillDropdown = false;

        this.loadForm
            .get(LoadModalStringEnum.BILLING_DROPDOWN)
            .patchValue(null);
    }

    public removeAdditionalBilling(type: string, index: number): void {
        if (type === LoadModalStringEnum.ADJUSTED_2) {
            if (!this.selectedAdditionalBillings.length) return;
            this.selectedAdditionalBillings[0].checked = false;

            this.additionalBillingTypes.unshift(
                this.selectedAdditionalBillings[0]
            );

            this.selectedAdditionalBillings.pop();

            this.inputService.changeValidators(
                this.loadForm.get(LoadModalStringEnum.ADJUSTED_RATE),
                false
            );
        } else {
            this.additionalBillingTypes.push(
                this.selectedAdditionalBillings.find(
                    (item) =>
                        item.name ===
                        this.additionalBillings().at(index).value.name
                )
            );

            this.selectedAdditionalBillings =
                this.selectedAdditionalBillings.filter(
                    (item) =>
                        item.name !==
                        this.additionalBillings().at(index).value.name
                );

            switch (this.additionalBillings().at(index).value.name) {
                case LoadModalStringEnum.LAYOVER:
                    this.loadModalBill.layover = 0;
                    break;

                case LoadModalStringEnum.LUMPER:
                    this.loadModalBill.lumper = 0;
                    break;

                case LoadModalStringEnum.FUEL_SURCHARGE:
                    this.loadModalBill.fuelSurcharge = 0;
                    break;

                case LoadModalStringEnum.ESCORT:
                    this.loadModalBill.escort = 0;
                    break;

                case LoadModalStringEnum.DETENTION:
                    this.loadModalBill.detention = 0;
                    break;

                default:
                    break;
            }

            this.loadModalBill = Object.assign({}, this.loadModalBill);

            this.additionalBillings().removeAt(index);
        }
    }

    public onFinancialAction(data: { type: string; action: boolean }): void {
        if (data.action) {
            switch (data.type) {
                case LoadModalStringEnum.BILLING:
                    this.additionalBillingTypes =
                        this.originalAdditionalBillingTypes.filter(
                            (billing) =>
                                !this.additionalBillings().value.find(
                                    (rate) => rate.name === billing.name
                                )
                        );

                    if (this.additionalBillingTypes.length)
                        this.isVisibleBillDropdown = true;

                    break;
                case LoadModalStringEnum.PAYMENT:
                    this.updatePaymentsList();
                    this.showPaymentArray = true;
                    break;
                default:
                    break;
            }
        }
    }

    private updatePaymentsList(): void {
        const isPaidInFull = !!this.additionalPayments().value.find(
            (value: LoadAdditionalPayment) =>
                value.paymentType === LoadModalConstants.PAID_IN_FULL
        );
        const isAdvancePay = !!this.additionalPayments().value.find(
            (value: LoadAdditionalPayment) =>
                value.paymentType === LoadModalConstants.ADVANCE_PAY
        );

        let list = this.paymentTypesDropdownList;

        if (isPaidInFull) {
            list = [];
        } else if (isAdvancePay) {
            list = this.orginalPaymentTypesDropdownList.filter(
                (payments) => payments.id !== LoadModalConstants.ADVANCE_PAY
            );
        } else {
            list = this.orginalPaymentTypesDropdownList;
        }

        this.paymentTypesDropdownList = list;
    }

    public trackBillingPayment(): void {
        this.loadForm
            .get(LoadModalStringEnum.BASE_RATE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (!value) {
                    this.isAvailableAdjustedRate = false;
                    this.isAvailableAdvanceRate = false;
                    this.loadModalBill = {
                        ...this.loadModalBill,
                        baseRate: 0,
                    };

                    this.inputService.changeValidators(
                        this.loadForm.get(LoadModalStringEnum.ADJUSTED_RATE),
                        false
                    );
                    this.inputService.changeValidators(
                        this.loadForm.get(LoadModalStringEnum.DRIVER_RATE),
                        false
                    );
                    this.inputService.changeValidators(
                        this.loadForm.get(LoadModalStringEnum.ADVANCE_PAY),
                        false
                    );
                } else {
                    this.loadModalBill = {
                        ...this.loadModalBill,
                        baseRate: this.convertNumbers(value),
                    };
                }
            });

        // driver rate
        this.loadForm
            .get(LoadModalStringEnum.DRIVER_RATE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    if (
                        !this.loadForm.get(LoadModalStringEnum.BASE_RATE)
                            .value ||
                        MethodsCalculationsHelper.convertThousanSepInNumber(
                            value
                        ) >
                            MethodsCalculationsHelper.convertThousanSepInNumber(
                                this.loadForm.get(LoadModalStringEnum.BASE_RATE)
                                    .value
                            )
                    ) {
                        this.loadForm
                            .get(LoadModalStringEnum.DRIVER_RATE)
                            .reset();
                        this.loadForm
                            .get(LoadModalStringEnum.DRIVER_RATE)
                            .setErrors({ invalid: true });
                    } else {
                        this.loadForm
                            .get(LoadModalStringEnum.DRIVER_RATE)
                            .setErrors(null);
                    }
                }
            });

        // advance rate
        this.additionalPayments()
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value: LoadAdditionalPayment[]) => {
                const paymentTotals = value.reduce(
                    (acc, val) => {
                        const pay = val.pay
                            ? MethodsCalculationsHelper.convertThousanSepInNumber(
                                  val.pay as string
                              )
                            : 0;
                        switch (val.paymentType) {
                            case LoadModalPaymentEnum.PAID_IN_FULL:
                                acc.paidInFull += pay;
                                break;
                            case LoadModalPaymentEnum.SHORT_PAID:
                                acc.shortPaid += pay;
                                break;
                            case LoadModalPaymentEnum.ADVANCE_PAYMENT:
                                acc.advance += pay;
                                break;
                            default:
                                break;
                        }
                        return acc;
                    },
                    { paidInFull: 0, shortPaid: 0, advance: 0 }
                );

                this.loadModalPayment = {
                    paidInFull: paymentTotals.paidInFull,
                    shortPaid: paymentTotals.shortPaid,
                    advance: paymentTotals.advance,
                };
            });

        // additional billings
        this.additionalBillings()
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((arr) => {
                arr.forEach((value) => {
                    switch (value.name) {
                        case LoadModalStringEnum.LAYOVER:
                            this.loadModalBill.layover = value.billingValue;

                            break;
                        case LoadModalStringEnum.LUMPER:
                            this.loadModalBill.lumper = value.billingValue;

                            break;
                        case LoadModalStringEnum.FUEL_SURCHARGE:
                            this.loadModalBill.fuelSurcharge =
                                value.billingValue;

                            break;
                        case LoadModalStringEnum.ESCORT:
                            this.loadModalBill.escort = value.billingValue;

                            break;
                        case LoadModalStringEnum.DETENTION:
                            this.loadModalBill.detention = value.billingValue;

                            break;
                        default:
                            break;
                    }
                });

                this.loadModalBill = Object.assign({}, this.loadModalBill);
            });
    }

    public removeAdditionalPayment(): void {
        this.isVisiblePayment = false;

        this.inputService.changeValidators(
            this.loadForm.get(LoadModalStringEnum.ADVANCE_PAY),
            false
        );
    }

    private premmapedAdditionalBillingRate(action: string) {
        return this.originalAdditionalBillingTypes
            .map((item) => {
                const biilingRate = this.additionalBillings().controls.find(
                    (control) =>
                        control.get(LoadModalStringEnum.NAME).value ===
                        item.name
                );

                return {
                    id: action === LoadModalStringEnum.UPDATE ? item.id : null,
                    additionalBillingType: item.id,
                    rate: biilingRate
                        ? biilingRate.get(LoadModalStringEnum.BILLING_VALUE)
                              .value
                        : null,
                };
            })
            .filter((item) => item.additionalBillingType !== 6);
    }

    public get hasValidSteps(): boolean {
        return this.areOriginAndDestinationValid && this.loadExtraStops().valid;
    }

    public createNewExtraStop(): void {
        if (!this.areOriginAndDestinationValid || !this.loadExtraStops().valid)
            return;

        // shipper config
        this.loadExtraStopsShipperInputConfig.push({
            id: `${this.loadExtraStops().length}-${
                LoadModalStringEnum.EXTRA_STOP_SHIPPER
            }`,
            name: LoadModalStringEnum.INPUT_DROPDOWN,
            type: LoadModalStringEnum.TEXT,
            multipleLabel: {
                labels: [
                    LoadModalStringEnum.SHIPPER,
                    LoadModalStringEnum.CITY_STATE_ZIP,
                ],
                customClass: LoadModalStringEnum.LOAD_SHIPPER,
            },
            isDropdown: true,
            isRequired: true,
            blackInput: true,
            textTransform: LoadModalStringEnum.UPPERCASE,
            dropdownWidthClass: `${LoadModalStringEnum.DROPDOWN_WIDTH_1} load-shipper-stops`,
        });

        // shipper contact config
        this.loadExtraStopsShipperContactsInputConfig.push({
            id: `${this.loadExtraStops().length}-${
                LoadModalStringEnum.EXTRA_STOP_SHIPPER_CONTACT
            }`,
            name: LoadModalStringEnum.INPUT_DROPDOWN,
            type: LoadModalStringEnum.TEXT,
            multipleLabel: {
                labels: [
                    LoadModalStringEnum.CONTACT,
                    LoadModalStringEnum.PHONE,
                ],
                customClass: LoadModalStringEnum.LOAD_SHIPPER_CONTACT,
            },
            isDropdown: true,
            isDisabled: true,
            blackInput: true,
            textTransform: LoadModalStringEnum.CAPITALIZE,
            dropdownWidthClass: LoadModalStringEnum.DROPDOWN_WIDTH_2,
        });

        // selected
        this.selectedExtraStopShipper.push(null);
        this.selectedExtraStopShipperContact.push(null);
        this.loadExtraStopsDateRange.push(false);
        this.selectExtraStopType.push(3000);
        this.selectedExtraStopTime.push(7000);

        // stop items
        this.isCreatedNewStopItemsRow.extraStops = [
            ...this.isCreatedNewStopItemsRow.extraStops,
            false,
        ];
        this.extraStopItems = [...this.extraStopItems, []];

        this.addLoadExtraStop();
    }

    public addLoadExtraStop(): void {
        this.loadExtraStops().push(this.newLoadExtraStop());
        this.closeAllLoadExtraStopExceptActive(
            this.loadExtraStops().length - 1
        );
        this.loadExtraStops()
            .controls[this.loadExtraStops().length - 1].get(
                LoadModalStringEnum.OPEN_CLOSE
            )
            .patchValue(true);

        const obj = this.numberOfLoadExtraStops();

        this.loadExtraStops()
            .at(this.loadExtraStops().length - 1)
            .get(LoadModalStringEnum.STOP_ORDER)
            .patchValue(obj.numberOfPickups);

        if (this.loadExtraStops().length > 1) {
            this.typeOfExtraStops.push([
                {
                    id: 3000 + this.loadExtraStops().length,
                    name: LoadModalStringEnum.PICKUP_2,
                    checked: true,
                    color: LoadModalStringEnum.COLOR_1,
                },
                {
                    id: 4000 + this.loadExtraStops().length,
                    name: LoadModalStringEnum.DELIVERY_2,
                    checked: false,
                    color: LoadModalStringEnum.COLOR_2,
                },
            ]);

            this.stopTimeTabsExtraStops.push([
                {
                    id: 7900 + this.loadExtraStops().length,
                    name: LoadModalStringEnum.WORK_HOURS,
                    checked: true,
                    color: LoadModalStringEnum.COLOR_3,
                },
                {
                    id: 9000 + this.loadExtraStops().length,
                    name: LoadModalStringEnum.APPOINTMENT,
                    checked: false,
                    color: LoadModalStringEnum.COLOR_3,
                },
            ]);
        }

        this.getStopNumbers();
    }

    public newLoadExtraStop(): UntypedFormGroup {
        return this.formBuilder.group({
            id: [null],
            stopType: [LoadModalStringEnum.PICKUP_2],
            stopOrder: [null],
            shipperId: [null, Validators.required],
            shipperContactId: [null],
            dateFrom: [null, Validators.required],
            dateTo: [null],
            timeType: [null],
            timeFrom: [null, Validators.required],
            timeTo: [null, Validators.required],
            arrive: [null],
            depart: [null],
            longitude: [null],
            latitude: [null],
            legMiles: [null],
            legHours: [null],
            legMinutes: [null],
            legCost: [null],
            openClose: [true],
            waitTime: [null],
            shape: [null],
        });
    }

    public numberOfLoadExtraStops(): {
        numberOfPickups: number;
        numberOfDeliveries: number;
    } {
        let pickups: number = 1;
        let deliveries: number = 0;

        this.loadExtraStops().controls.forEach((item) => {
            if (
                item.get(LoadModalStringEnum.STOP_TYPE).value ===
                LoadModalStringEnum.PICKUP_2
            ) {
                pickups++;
            } else {
                deliveries++;
            }
        });

        return {
            numberOfPickups: pickups,
            numberOfDeliveries: deliveries,
        };
    }

    public loadExtraStops(): UntypedFormArray {
        return this.loadForm.get(
            LoadModalStringEnum.EXTRA_STOPS_2
        ) as UntypedFormArray;
    }

    private calculateStopOrder(): void {
        let stopOrder = 1;

        for (let i = 0; i < this.loadExtraStops().length; i++) {
            const stopType = this.loadExtraStops()
                .at(i)
                .get(LoadModalStringEnum.STOP_TYPE).value;

            if (stopType === LoadModalStringEnum.PICKUP_2) {
                this.loadExtraStops()
                    .at(i)
                    .get(LoadModalStringEnum.STOP_ORDER)
                    .patchValue(stopOrder + 1);

                stopOrder++;
            }
        }
    }

    public removeLoadExtraStop(index: number): void {
        this.loadExtraStops().removeAt(index);

        let pickupOrder = 2;
        let deliveryOrder = 1;

        for (let i = 0; i < this.loadExtraStops().length; i++) {
            if (
                this.loadExtraStops().at(i).get(LoadModalStringEnum.STOP_TYPE)
                    .value === LoadModalStringEnum.PICKUP_2
            ) {
                this.loadExtraStops()
                    .at(i)
                    .get(LoadModalStringEnum.STOP_ORDER)
                    .patchValue(pickupOrder);

                pickupOrder++;
            } else {
                this.loadExtraStops()
                    .at(i)
                    .get(LoadModalStringEnum.STOP_ORDER)
                    .patchValue(deliveryOrder);

                this.loadForm
                    .get(LoadModalStringEnum.DELIVERY_STOP_ORDER)
                    .patchValue(deliveryOrder + 1);

                deliveryOrder++;
            }
        }

        if (
            !this.loadExtraStops().value.some(
                (extraStop) =>
                    extraStop.stopType === LoadModalStringEnum.DELIVERY_2
            )
        )
            this.loadForm
                .get(LoadModalStringEnum.DELIVERY_STOP_ORDER)
                .patchValue(1);

        this.loadExtraStopsShipperInputConfig.splice(index, 1);
        this.loadExtraStopsShipperContactsInputConfig.splice(index, 1);

        // selected
        this.selectedExtraStopShipper.splice(index, 1);
        this.selectedExtraStopShipperContact.splice(index, 1);
        this.selectExtraStopType.splice(index, 1);
        this.loadExtraStopsDateRange.splice(index, 1);
        this.selectedExtraStopTime.splice(index, 1);

        if (this.loadExtraStops().length) {
            this.typeOfExtraStops.splice(index, 1);

            this.stopTimeTabsExtraStops.splice(index, 1);
        } else {
            this.typeOfExtraStops[0] = this.typeOfExtraStops[0].map((type) => {
                return {
                    ...type,
                    checked: type.name === LoadModalStringEnum.PICKUP_2,
                };
            });

            this.stopTimeTabsExtraStops[0] = this.stopTimeTabsExtraStops[0].map(
                (tab) => {
                    return {
                        ...tab,
                        checked:
                            tab.name.toLowerCase() ===
                            LoadModalStringEnum.WORK_HOURS_2,
                    };
                }
            );
        }

        this.getStopNumbers();

        this.drawStopOnMap();
    }

    public closeAllLoadExtraStopExceptActive(idx: number): void {
        this.isActivePickupStop = false;
        this.isActiveDeliveryStop = false;

        if (this.loadExtraStops().length) {
            this.loadExtraStops().controls.map((item, index) => {
                if (index === idx) {
                    const isCardOpen = item.get(
                        LoadModalStringEnum.OPEN_CLOSE
                    ).value;

                    item.get(LoadModalStringEnum.OPEN_CLOSE).patchValue(
                        !isCardOpen
                    );
                } else {
                    item.get(LoadModalStringEnum.OPEN_CLOSE).patchValue(false);
                }
            });
        }
    }

    private remapStopItems(
        stopItems: LoadStopItemCommand[]
    ): LoadStopItemCommand[] {
        if (!stopItems) return [];
        return stopItems.map((item: any) => {
            let newItem = { ...item };

            if (newItem.units) {
                newItem = {
                    ...newItem,
                    units: newItem.units.id
                        ? newItem.units.id
                        : this.stopItemDropdownLists.quantityDropdownList.find(
                              (unit) =>
                                  unit.name === newItem.units ||
                                  newItem.units === unit.id
                          )?.id,
                };
            }

            if (newItem.secure) {
                newItem = {
                    ...newItem,
                    secure: this.stopItemDropdownLists.secureDropdownList.find(
                        (secure) => secure.name === newItem.secure
                    )?.id,
                };
            }

            if (newItem.stackable) {
                newItem = {
                    ...newItem,
                    stackable:
                        this.stopItemDropdownLists.stackDropdownList.find(
                            (stackable) => stackable.name === newItem.stackable
                        )?.id,
                };
            }

            if (newItem.tarp) {
                newItem = {
                    ...newItem,
                    tarp: this.stopItemDropdownLists.tarpDropdownList.find(
                        (tarp) => tarp.name === newItem.tarp
                    )?.id,
                };
            }

            if (newItem.hazardousMaterialId) {
                newItem = {
                    ...newItem,
                    description: null,
                    hazardousMaterialId:
                        this.stopItemDropdownLists.hazardousDropdownList.find(
                            (hazard) =>
                                hazard.description ===
                                    newItem.hazardousMaterialId ||
                                newItem.id === hazard.id
                        )?.id,
                };
            } else {
                newItem = {
                    ...newItem,
                    hazardousMaterialId: null,
                };
            }

            // Remove null properties from form data
            Object.keys(newItem).forEach((key) => {
                if (newItem[key] === null) {
                    delete newItem[key];
                }
            });

            return newItem;
        });
    }

    private mapLegTime(
        pickuplegHours: number,
        pickuplegMinutes: number,
        pickuplegMiles: number
    ): {
        legHours: number;
        legMinutes: number;
        legMiles: number;
    } {
        let legHours = pickuplegHours ?? 0;
        let legMinutes = pickuplegMinutes ?? 0;

        if (legHours === 0 && legMinutes === 0) {
            legMinutes = 1;
        }
        return {
            legHours,
            legMinutes,
            legMiles: pickuplegMiles ?? 0.2,
        };
    }

    private formatStopDateTime(dateFrom: string, timeFrom: string): string {
        let dateTime = moment(dateFrom);

        if (timeFrom) {
            const [hours, minutes] = timeFrom.split(':');
            dateTime = dateTime
                .hours(parseInt(hours))
                .minutes(parseInt(minutes))
                .seconds(0);
        }

        return dateTime.toISOString();
    }

    private premmapedStops(saveCurrentLoad?: boolean): LoadStop[] {
        const stops: LoadStop[] = [];

        const {
            pickupStop,
            pickupStopOrder,
            pickupDateFrom,
            pickupDateTo,
            pickupTimeFrom,
            pickupTimeTo,
            pickuplegMiles,
            pickuplegHours,
            pickuplegMinutes,
            deliveryStop,
            deliveryStopOrder,
            deliveryDateFrom,
            deliveryDateTo,
            deliveryTimeFrom,
            deliveryTimeTo,
            deliverylegMiles,
            deliverylegHours,
            deliverylegMinutes,
            arrive,
            depart,
        } = this.loadForm.value;

        // pickup
        if (this.selectedPickupShipper) {
            const { legHours, legMinutes, legMiles } = this.mapLegTime(
                pickuplegHours,
                pickuplegMinutes,
                pickuplegMiles
            );
            stops.push({
                id: this.isActiveLoad ? this.stops?.[0]?.id ?? null : null,
                stopOrder: stops.length + 1,
                stopLoadOrder: pickupStopOrder,
                stopType: pickupStop,
                shipper: this.originalShippers.find(
                    (shipper) => shipper.id === this.selectedPickupShipper.id
                ) as any,
                shipperId: this.selectedPickupShipper.id,
                shipperContactId: this.selectedPickupShipperContact?.id
                    ? this.selectedPickupShipperContact.id
                    : null,
                dateFrom: this.formatStopDateTime(
                    pickupDateFrom,
                    pickupTimeFrom
                ),
                dateTo: this.formatStopDateTime(pickupDateTo, pickupTimeTo),
                timeType: saveCurrentLoad
                    ? this.stopTimeTabsPickup.find((item) => item.checked)
                    : this.stopTimeTabsPickup.find((item) => item.checked)
                          ?.name === LoadModalStringEnum.APPOINTMENT
                    ? 2
                    : 1,
                timeFrom: pickupTimeFrom,
                timeTo: pickupTimeTo,
                arrive: arrive,
                depart: depart,
                legMiles,
                legHours,
                legMinutes,
                items: this.remapStopItems(this.savedPickupStopItems),
                shape: this.stops?.[0]?.shape,
            });
        }

        // extra Stops
        if (this.loadExtraStops().length) {
            this.loadExtraStops().controls.forEach((item, index) => {
                const { legHours, legMinutes, legMiles } = this.mapLegTime(
                    item.get(LoadModalStringEnum.LEG_HOURS).value,
                    item.get(LoadModalStringEnum.LEG_MINUTES).value,
                    item.get(LoadModalStringEnum.LEG_MILES).value
                );
                stops.push({
                    id: this.isActiveLoad
                        ? item.get(LoadModalStringEnum.ID).value ?? null
                        : null,
                    stopType: saveCurrentLoad
                        ? this.typeOfExtraStops[index]?.find(
                              (item) => item.checked
                          )
                        : item.get(LoadModalStringEnum.STOP_TYPE).value,
                    stopOrder: stops.length + 1,
                    stopLoadOrder:
                        this.extraStopNumbers?.[index] ??
                        item.get(LoadModalStringEnum.STOP_ORDER).value,
                    shipperId: this.selectedExtraStopShipper[index]?.id,
                    shipper: this.originalShippers.find(
                        (shipper) =>
                            shipper.id ===
                            this.selectedExtraStopShipper[index]?.id
                    ) as any,
                    dateFrom: this.formatStopDateTime(
                        item.get(LoadModalStringEnum.DATE_FROM).value,
                        item.get(LoadModalStringEnum.TIME_FROM).value
                    ),
                    dateTo: this.formatStopDateTime(
                        item.get(LoadModalStringEnum.DATE_TO).value,
                        item.get(LoadModalStringEnum.TIME_TO).value
                    ),
                    timeType: saveCurrentLoad
                        ? this.stopTimeTabsExtraStops[index]?.find(
                              (item) => item.checked
                          )
                        : this.stopTimeTabsExtraStops[index].find(
                              (item) => item.checked
                          )?.name === LoadModalStringEnum.APPOINTMENT
                        ? 2
                        : 1,
                    timeFrom: item.get(LoadModalStringEnum.TIME_FROM).value,
                    timeTo: item.get(LoadModalStringEnum.TIME_TO).value,
                    arrive: item.get(LoadModalStringEnum.ARIVE).value,
                    depart: item.get(LoadModalStringEnum.DEPART).value,
                    legMiles,
                    legHours,
                    legMinutes,
                    items: this.remapStopItems(this.savedExtraStopItems[index]),
                    shape: item.get(LoadModalStringEnum.SHAPE).value,
                });
            });
        }
        // delivery
        if (this.selectedDeliveryShipper) {
            const { legHours, legMinutes, legMiles } = this.mapLegTime(
                deliverylegHours,
                deliverylegMinutes,
                deliverylegMiles
            );
            stops.push({
                id: this.isActiveLoad
                    ? this.stops?.[this.stops.length - 1]?.id ?? null
                    : null,
                stopType: deliveryStop,
                stopOrder: stops.length + 1,
                stopLoadOrder: this.loadForm.get(
                    LoadModalStringEnum.DELIVERY_STOP_ORDER
                ).value,
                shipperId: this.selectedDeliveryShipper.id,
                shipper: this.originalShippers.find(
                    (shipper) => shipper.id === this.selectedDeliveryShipper.id
                ),
                shipperContactId: this.selectedDeliveryShipperContact?.id
                    ? this.selectedDeliveryShipperContact.id
                    : null,
                dateFrom: this.formatStopDateTime(
                    deliveryDateFrom,
                    deliveryTimeFrom
                ),
                dateTo: this.formatStopDateTime(deliveryDateTo, deliveryTimeTo),
                timeType: saveCurrentLoad
                    ? this.stopTimeTabsDelivery.find((item) => item.checked)
                    : this.stopTimeTabsDelivery.find((item) => item.checked)
                          ?.name === LoadModalStringEnum.APPOINTMENT
                    ? 2
                    : 1,
                timeFrom: deliveryTimeFrom,
                timeTo: deliveryTimeTo,
                arrive: null,
                depart: null,
                legMiles,
                legHours,
                legMinutes,
                items: this.remapStopItems(this.savedDeliveryStopItems),
                shape: this.stops?.[this.stops.length - 1]?.shape,
            });
        }

        return stops;
    }
    private remapStopWaitTime(): LoadStatusHistoryResponse[] {
        if (this.isLoadClosed) {
            const waitTime = this.pickupStatusHistory.concat(
                ...this.extraStopStatusHistory,
                ...this.deliveryStatusHistory
            );

            // This is patched value from form
            waitTime.forEach((time: LoadModalWaitTimeFormField) => {
                time.dateTimeFrom =
                    MethodsCalculationsHelper.combineDateAndTimeToBackend(
                        time.startDate,
                        time.startTime
                    );
                time.dateTimeTo =
                    MethodsCalculationsHelper.combineDateAndTimeToBackend(
                        time.endDate,
                        time.endTime
                    );
            });

            return waitTime;
        }

        return [];
    }

    public drawStopOnMap(): void {
        this.isMilesLoading = true;

        const routes: LoadStopRoutes[] = [];

        // dispatches
        if (this.selectedDispatches?.currentLocationCoordinates) {
            routes[0] = {
                longitude:
                    this.selectedDispatches.currentLocationCoordinates
                        .longitude,
                latitude:
                    this.selectedDispatches.currentLocationCoordinates.latitude,
                pickup: false,
                delivery: false,
                stopNumber: 0,
            };
        }

        // pickup shipper
        if (this.selectedPickupShipper) {
            routes[
                this.selectedDispatches?.currentLocationCoordinates ? 1 : 0
            ] = {
                longitude: this.selectedPickupShipper.longitude,
                latitude: this.selectedPickupShipper.latitude,
                pickup: true,
                delivery: false,
                stopNumber: 1,
            };
        }

        // extra stops
        if (this.loadExtraStops().length) {
            this.loadExtraStops().controls.map((item, index) => {
                routes.push({
                    longitude: this.selectedExtraStopShipper[index]?.longitude,
                    latitude: this.selectedExtraStopShipper[index]?.latitude,
                    pickup: this.selectExtraStopType[index]
                        .toString()
                        .startsWith(LoadModalStringEnum.NUMBER_3),
                    delivery: this.selectExtraStopType[index]
                        .toString()
                        .startsWith(LoadModalStringEnum.NUMBER_4),
                    stopNumber: item.get(LoadModalStringEnum.STOP_ORDER).value,
                });
            });
        }

        // delivery shipper
        if (this.selectedDeliveryShipper) {
            routes.push({
                longitude: this.selectedDeliveryShipper.longitude,
                latitude: this.selectedDeliveryShipper.latitude,
                pickup: false,
                delivery: true,
                stopNumber:
                    this.numberOfLoadExtraStops().numberOfDeliveries + 1,
            });
        }

        const validRoutes = routes.filter(
            (item) =>
                item &&
                item.longitude !== undefined &&
                item.longitude !== null &&
                item.latitude !== undefined &&
                item.latitude !== null
        );

        if (validRoutes) {
            this.loadService
                .getRouting(
                    JSON.stringify(
                        validRoutes.map((item) => {
                            return {
                                longitude: item.longitude,
                                latitude: item.latitude,
                            };
                        })
                    )
                )
                .pipe(debounceTime(2000), takeUntil(this.destroy$))
                .subscribe({
                    next: (res: RoutingResponse) => {
                        this.loadStopRoutes[0] = {
                            routeColor: LoadModalStringEnum.COLOR_4,
                            stops: routes.map((route, index) => {
                                return {
                                    lat: route.latitude,
                                    long: route.longitude,
                                    stopColor: route.pickup
                                        ? LoadModalStringEnum.COLOR_5
                                        : route.delivery
                                        ? LoadModalStringEnum.COLOR_6
                                        : LoadModalStringEnum.COLOR_4,
                                    stopNumber: route.stopNumber.toString(),
                                    empty:
                                        this.selectedDispatches
                                            ?.currentLocationCoordinates &&
                                        index === 1,
                                    zIndex: 99 + index,
                                };
                            }),
                        };

                        this.data.routingMarkers = routes.map((routes) => {
                            return {
                                position: {
                                    lat: routes.latitude,
                                    lng: routes.longitude,
                                },
                            };
                        });

                        if (res?.legs?.length) {
                            res.legs.forEach((item, index) => {
                                // pickup
                                if (index === 0) {
                                    this.loadForm
                                        .get(LoadModalStringEnum.LOAD_MILES)
                                        .patchValue(
                                            res?.totalMiles - item.miles
                                        );

                                    if (this.selectedDispatches) {
                                        this.loadForm
                                            .get(
                                                LoadModalStringEnum.PICKUP_SHAPE
                                            )
                                            .patchValue(item.shape);
                                        this.loadForm
                                            .get(
                                                LoadModalStringEnum.PICKUP_LEG_MILES
                                            )
                                            .patchValue(item.miles);
                                        this.loadForm
                                            .get(
                                                LoadModalStringEnum.PICKUP_LEG_HOURS
                                            )
                                            .patchValue(item.hours);
                                        this.loadForm
                                            .get(
                                                LoadModalStringEnum.PICKUP_LEG_MINUTES
                                            )
                                            .patchValue(item.minutes);
                                    }

                                    this.loadForm
                                        .get(
                                            LoadModalStringEnum.PICKUP_LEG_COST
                                        )
                                        .patchValue(item.cost);
                                } else if (
                                    index === res.legs.length - 1 ||
                                    res.legs.length === 2
                                ) {
                                    this.loadForm
                                        .get(
                                            LoadModalStringEnum.DELIVERY_LEG_MILES
                                        )
                                        .patchValue(res?.legs[index].miles);
                                    this.loadForm
                                        .get(
                                            LoadModalStringEnum.DELIVERY_LEG_HOURS
                                        )
                                        .patchValue(res?.legs[index].hours);
                                    this.loadForm
                                        .get(
                                            LoadModalStringEnum.DELIVERY_LEG_MINUTES
                                        )
                                        .patchValue(res?.legs[index].minutes);
                                    this.loadForm
                                        .get(
                                            LoadModalStringEnum.DELIVERY_LEG_COST
                                        )
                                        .patchValue(res?.legs[index].cost);
                                    this.loadForm
                                        .get(LoadModalStringEnum.DELIVERY_SHAPE)
                                        .patchValue(res?.legs[index].shape);
                                } else {
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(LoadModalStringEnum.LEG_MILES)
                                        .patchValue(item.miles);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(LoadModalStringEnum.SHAPE)
                                        .patchValue(item.shape);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(LoadModalStringEnum.LEG_HOURS)
                                        .patchValue(item.hours);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(LoadModalStringEnum.LEG_MINUTES)
                                        .patchValue(item.minutes);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(LoadModalStringEnum.LEG_COST)
                                        .patchValue(item.cost);
                                }
                                this.loadForm
                                    .get(LoadModalStringEnum.TOTAL_MILES)
                                    .patchValue(res?.totalMiles);
                                this.totalLegMiles = res.totalMiles;
                                this.totalLegHours = res.totalHours;
                                this.totalLegMinutes = res.totalMinutes;
                                this.totalLegCost = res.totalCost;
                                this.emptyMiles = res.legs[0]?.miles || 0;

                                clearTimeout(this.lastCallTimeout);

                                this.lastCallTimeout = setTimeout(() => {
                                    this.watchFormChanges();
                                }, this.debounceDelay);
                            });
                        }

                        this.isMilesLoading = false;
                    },
                });
        }
    }

    public onExtraStopAction(data: { action: string }): void {
        if (data.action === LoadModalStringEnum.REORDERING) {
            this.reorderingStarted = false;
            this.reorderingSaveError = false;
        } else this.createNewExtraStop();
    }

    public getExtraStopsToDate(extraStopId: number): ITaInput {
        return {
            ...this.loadExtraStopsToDateInputConfig,
            isRequired: !!this.loadExtraStopsDateRange[extraStopId],
        };
    }

    public addDateRange(
        type: string,
        required: boolean,
        extraStopId?: number
    ): void {
        switch (type) {
            case LoadModalStringEnum.PICKUP:
                this.pickupDateRange = required;
                this.inputService.changeValidators(
                    this.loadForm.get(LoadModalStringEnum.PICKUP_DATE_TO),
                    required
                );

                this.loadPickupEndDateInputConfig = {
                    ...this.loadPickupEndDateInputConfig,
                    isRequired: required,
                };
                break;
            case LoadModalStringEnum.DELIVERY:
                this.deliveryDateRange = required;
                this.inputService.changeValidators(
                    this.loadForm.get(LoadModalStringEnum.DELIVERY_DATE_TO),
                    required
                );
                this.loadDeliveryDateToInputConfig = {
                    ...this.loadDeliveryDateToInputConfig,
                    isRequired: required,
                };

                break;
            case LoadModalStringEnum.EXTRA_STOP:
                this.loadExtraStopsDateRange[extraStopId] = required;

                this.inputService.changeValidators(
                    this.loadExtraStops()
                        .at(extraStopId)
                        ?.get(LoadModalStringEnum.DATE_TO),
                    required
                );
                break;
            default:
                break;
        }
    }

    public createNewStopItemsRow(type: string, extraStopId?: number): void {
        switch (type) {
            case LoadModalStringEnum.PICKUP:
                if (this.isPickupStopValid) {
                    this.isCreatedNewStopItemsRow.pickup = true;
                    this.isPickupItemsVisible = true;

                    setTimeout(() => {
                        this.isCreatedNewStopItemsRow.pickup = false;
                    }, 400);
                }

                break;
            case LoadModalStringEnum.DELIVERY:
                if (this.isDeliveryStopValid) {
                    this.isCreatedNewStopItemsRow.delivery = true;
                    this.isDeliveryItemsVisible = true;

                    setTimeout(() => {
                        this.isCreatedNewStopItemsRow.delivery = false;
                    }, 400);
                }
                break;
            case LoadModalStringEnum.EXTRA_STOP:
                if (
                    this.stopItemsValid[extraStopId] ||
                    this.stopItemsValid[extraStopId] === undefined
                ) {
                    this.isCreatedNewStopItemsRow.extraStops[extraStopId] =
                        true;
                    this.isExtraStopItemsVisible[extraStopId] = true;

                    setTimeout(() => {
                        this.isCreatedNewStopItemsRow.extraStops[extraStopId] =
                            false;
                    }, 400);
                }

                break;
            default:
                break;
        }
    }

    public toggleStopItemRow(type: string, extraStopId?: number): void {
        switch (type) {
            case LoadModalStringEnum.PICKUP:
                if (this.savedPickupStopItems.length) {
                    this.isPickupItemsVisible = !this.isPickupItemsVisible;
                }
                break;
            case LoadModalStringEnum.DELIVERY:
                if (this.savedDeliveryStopItems.length) {
                    this.isDeliveryItemsVisible = !this.isDeliveryItemsVisible;
                }

                break;
            case LoadModalStringEnum.EXTRA_STOP:
                if (this.savedExtraStopItems[extraStopId].length) {
                    this.isExtraStopItemsVisible[extraStopId] =
                        !this.isExtraStopItemsVisible[extraStopId];
                }
                break;
            default:
                break;
        }
    }

    public handleStopItemsDataValueEmit(
        stopItemsDataValue,
        type: string,
        extraStopIndex?: number
    ): void {
        switch (type) {
            case LoadModalStringEnum.PICKUP:
                this.savedPickupStopItems = stopItemsDataValue;
                break;
            case LoadModalStringEnum.DELIVERY:
                this.savedDeliveryStopItems = stopItemsDataValue;

                break;
            case LoadModalStringEnum.EXTRA_STOP:
                this.savedExtraStopItems[extraStopIndex] = stopItemsDataValue;

                break;
            default:
                break;
        }
    }

    public handleStopItemsValidStatusEmit(
        validStatus: boolean,
        type: string,
        extraStopIndex?: number
    ): void {
        // Flag to trigger form change on items change
        this.isFormDirty = true;
        switch (type) {
            case LoadModalStringEnum.PICKUP:
                this.isPickupStopValid = validStatus;
                break;
            case LoadModalStringEnum.DELIVERY:
                this.isDeliveryStopValid = validStatus;
                break;
            case LoadModalStringEnum.EXTRA_STOP:
                this.stopItemsValid[extraStopIndex] = validStatus;
                break;
            default:
                break;
        }

        this.isEachStopItemsRowValid =
            this.isPickupStopValid &&
            this.isDeliveryStopValid &&
            this.stopItemsValid.every((stop) => stop);
    }

    public additionalPartVisibility(event: {
        action: string;
        isOpen: boolean;
    }): void {
        this.loadModalSize = event.isOpen
            ? LoadModalStringEnum.MODAL_CONTAINER_LOAD
            : LoadModalStringEnum.MODAL_SIZE;

        switch (event.action) {
            case LoadModalStringEnum.HAZARDOUS:
                this.isHazardousVisible = event.isOpen;

                break;
            case LoadModalStringEnum.MAP:
                this.isHazardousVisible = false;

                break;
            default:
                break;
        }
    }

    public createComment(): void {
        this.isCommentsVisible = true;
        this.isCommenting = true;
        setTimeout(() => (this.isCommenting = false), 400);
    }

    public commentsCountChanged(): void {
        this.loadService
            .getLoadInsideListById(this.editData.data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.comments = res.pagination.data[0].comments;
                this.loadService.updateLoadPartily();
            });
    }

    public getDriverMessageOrNote(text: string, type: string): void {
        if (type === LoadModalStringEnum.DRIVER_MESSAGE)
            this.loadForm
                .get(LoadModalStringEnum.DRIVER_MESSAGE)
                .patchValue(text);

        if (type === LoadModalStringEnum.NOTE)
            this.loadForm.get(LoadModalStringEnum.NOTE).patchValue(text);
    }

    public handleTemplateSelectClick(templateId: number): void {
        this.selectedTemplate = templateId;

        this.isTemplateSelected = true;

        this.popover.close();

        this.loadService
            .getLoadTemplateById(templateId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((templateData) => {
                if (templateData) this.populateLoadModalData(templateData);
            });
    }

    public handleRemoveTemplateClick(): void {
        this.selectedTemplate = null;

        this.isTemplateSelected = false;

        this.ngbActiveModal.close();

        setTimeout(() => this.addNewLoadModal(), 200);
    }

    private getPreviusModalValues(): EditData | LoadShortResponse {
        return this.loadModalData();
    }

    private loadModalData(): EditData {
        const { ...form } = this.loadForm.value;
        const baseRate = form.baseRate;
        const driverRate = form.driverRate;
        const adjustedRate = form.adjustedRate;
        const advancePay = form.advancePay;
        const statusType = form.statusType;

        return {
            selectedTab: this.editData?.selectedTab,
            id: form.id,
            isEditMode: this.isEditingMode,
            previousStatus: this.selectedStatus,
            loadAction: this.editData?.loadAction,
            data: {
                id: form.id,
                status: this.originalLoadStatus,
                type: this.tabs.find((tab) => tab.id === this.selectedTab),
                name: form.templateName,
                loadNumber: this.loadNumber,
                loadTemplateId: this.selectedTemplate,
                dispatcher: this.selectedDispatcher,
                company:
                    this.labelsCompanies.length === 1
                        ? this.labelsCompanies[0]
                        : this.selectedCompany,
                dispatch: this.selectedDispatches,
                broker: this.selectedBroker,
                brokerContactId: this.selectedBrokerContact,
                referenceNumber: form.referenceNumber,
                generalCommodity: this.selectedGeneralCommodity,
                weight: form.weight,
                loadRequirements: {
                    id: form.loadRequirementsId,
                    truckType: this.selectedTruckReq,
                    trailerType: this.selectedTrailerReq,
                    doorType: this.selectedDoorType,
                    suspension: this.selectedSuspension,
                    trailerLength: this.selectedTrailerLength,
                    year: this.selectedYear?.name,
                    liftgate: form.liftgate,
                    driverMessage: form.driverMessage,
                },
                pays: this.mapPreviousPaymets(),
                stops: this.premmapedStops(true),
                baseRate: this.convertNumbers(baseRate),
                adjustedRate: this.convertNumbers(adjustedRate),
                driverRate: this.convertNumbers(driverRate),
                advancePay: this.convertNumbers(advancePay),
                additionalBillingRates: this.premmapedAdditionalBillingRate(
                    LoadModalStringEnum.CREATE
                ) as LoadBillingAdditionalResponse[],
                // pickup shipper
                // billing
                additionalBillingTypes: this.additionalBillings().value,

                // note, files
                note: form.note,
                files: this.documents,

                // legs
                totalMiles: this.totalLegMiles,
                totalHours: this.totalLegHours,
                totalMinutes: this.totalLegMinutes,
                emptyMiles: this.emptyMiles,
                statusType,
                deliveryStopOrder: form.deliveryStopOrder || 1,
            },
        };
    }

    private getLoadDropdowns(): void {
        if (
            this.isLoadActive(
                (this.editData?.data as LoadResponse)?.statusType?.name ||
                    ((this.editData?.data as LoadResponse)
                        ?.statusType as string)
            ) &&
            this.editData?.selectedTab !== TableStringEnum.TEMPLATE
        ) {
            this.loadService
                .getLoadStatusDropdownOptions(this.editData?.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    const status = (this.editData?.data as LoadResponse).status;
                    this.originalLoadStatus = status;

                    if (status) {
                        if (this.editData.previousStatus) {
                            this.selectedStatus = this.editData.previousStatus;
                        } else {
                            this.selectedStatus = {
                                name: status.statusString,
                                id: status.statusValue.id,
                                valueForRequest: status.statusValue.name,
                            };
                        }
                        this.statusDropDownList = [
                            this.selectedStatus,
                            ...res.possibleStatuses.map((status) => {
                                return {
                                    name: status.statusString,
                                    id: status.statusValue.id,
                                    valueForRequest: status.statusValue.name,
                                };
                            }),
                        ];
                        this.previousStatus = res.previousStatus
                            ? {
                                  name: res.previousStatus.statusString,
                                  id: res.previousStatus.statusValue.id,
                                  valueForRequest:
                                      res.previousStatus.statusValue.name,
                              }
                            : null;
                    }

                    this.originalStatus = (
                        this.editData?.data as LoadResponse
                    )?.status.statusValue.name;

                    this.handleTonuRateVisiblity();
                });
        }
        const id =
            this.editData?.selectedTab !== TableStringEnum.TEMPLATE &&
            this.isActiveLoad
                ? this.editData?.data?.id
                : null;
        this.loadService
            .getLoadDropdowns(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: LoadModalResponse) => {
                    this.tags = res.tags;

                    // dispatcher
                    this.labelsDispatcher = res.dispatchers.map((item) => {
                        return {
                            ...item,
                            name: item?.fullName,
                            logoName: item?.avatarFile?.url,
                        };
                    });

                    this.paymentMethodsDropdownList = res.paymentMethods;

                    // If we are creating new load only enable advace pay
                    if (!this.editData?.data.id)
                        res.paymentTypes = res.paymentTypes.filter(
                            (payment) => payment.id === 3
                        );

                    this.orginalPaymentTypesDropdownList = res.paymentTypes;
                    this.paymentTypesDropdownList = res.paymentTypes;

                    let initialDispatcher = this.labelsDispatcher.find(
                        (item) =>
                            item?.name ===
                            this.companyUser?.firstName?.concat(
                                LoadModalStringEnum.EMPTY_SPACE_STRING,
                                this.companyUser?.lastName
                            )
                    );

                    // OVO TREBA PROVERITI, JA SAM USER KOJI JE POZVAN U OVU KOMPANIJU I JA SE NE NALAZIM UNUTAR DISPATCHER LISTE A OVDE SE TRAZI UNUTAR DISPATCHER LISTE KO JE COMPANY OWNER PA PUCA
                    if (!initialDispatcher)
                        initialDispatcher = this.labelsDispatcher[0];

                    this.loadForm
                        .get(LoadModalStringEnum.DISPATCHER_ID)
                        .patchValue(initialDispatcher.name);

                    this.selectedDispatcher = initialDispatcher;

                    // division companies
                    this.labelsCompanies = res.companies.map((item) => {
                        return {
                            ...item,
                            name: item?.companyName,
                        };
                    });

                    if (this.labelsCompanies.length > 1)
                        this.selectedCompany = this.labelsCompanies.find(
                            (item) => item.name === this.companyUser.companyName
                        );

                    // dispatches
                    this.labelsDispatches = this.originLabelsDispatches =
                        res.dispatches.map((item, index) => {
                            return {
                                ...item,
                                driver: {
                                    ...item.driver,
                                    name: item.driver?.firstName?.concat(
                                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                                        item.driver?.lastName
                                    ),
                                    logoName: item.driver?.avatarFile?.url,
                                    owner: !!item.driver?.owner,
                                },
                                coDriver: {
                                    ...item.coDriver,
                                    name: item.coDriver?.firstName?.concat(
                                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                                        item.coDriver?.lastName
                                    ),
                                    /* logoName: item.coDriver?.avatar, */
                                },
                                truck: {
                                    ...item.truck,
                                    name: item.truck?.truckNumber,
                                    logoType: item.truck?.truckType?.name,
                                    logoName: item.truck?.truckType?.logoName,
                                    folder: LoadModalStringEnum.COMMON,
                                    subFolder: LoadModalStringEnum.TRUCKS,
                                },
                                trailer: {
                                    ...item.trailer,
                                    name: item.trailer?.trailerNumber,
                                    logoType: item.trailer?.trailerType?.name,
                                    logoName:
                                        item.trailer?.trailerType?.logoName,
                                    folder: LoadModalStringEnum.COMMON,
                                    subFolder: LoadModalStringEnum.TRAILERS,
                                },
                                itemIndex: index,
                                fullName: item.truck?.truckNumber
                                    .concat(
                                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                                        item.trailer?.trailerNumber
                                    )
                                    .concat(
                                        LoadModalStringEnum.EMPTY_SPACE_STRING,
                                        item.driver?.firstName.concat(
                                            LoadModalStringEnum.EMPTY_SPACE_STRING,
                                            item.driver?.lastName
                                        )
                                    ),
                            };
                        });

                    this.labelsDispatches = this.labelsDispatches.filter(
                        (item) =>
                            item?.dispatcherId === this.selectedDispatcher.id
                    );

                    // brokers
                    this.labelsBroker = res.brokers.map((item) => {
                        return {
                            ...item,
                            name: item?.businessName,
                            creditLimit: item?.creditLimit,
                            second_value: item?.creditLimit,
                            status: item.availableCreditType?.name,
                            logoName:
                                item?.dnu || item?.ban
                                    ? LoadModalStringEnum.BROKER_OPEN_SVG
                                    : item?.status === 0
                                    ? LoadModalStringEnum.BROKER_CLOSED_SVG
                                    : null,
                        };
                    });

                    // broker contacts
                    this.labelsBrokerContacts = this.originBrokerContacts =
                        res.brokerContacts.map((item) => {
                            return {
                                ...item,
                                contacts: item.contacts.map((item) => {
                                    return {
                                        ...item,
                                        name: item?.contactName,
                                        phone: item?.phone?.concat(
                                            LoadModalStringEnum.EMPTY_SPACE_STRING,
                                            item?.extensionPhone
                                                ? `x${item.extensionPhone}`
                                                : LoadModalStringEnum.EMPTY_STRING
                                        ),
                                        originalPhone: item.phone,
                                        phoneExtension: item.extensionPhone,
                                        fullName: item?.contactName?.concat(
                                            LoadModalStringEnum.EMPTY_SPACE_STRING,
                                            item?.phone?.concat(
                                                LoadModalStringEnum.EMPTY_SPACE_STRING,
                                                item?.extensionPhone
                                                    ? `x${item.extensionPhone}`
                                                    : LoadModalStringEnum.EMPTY_STRING
                                            )
                                        ),
                                    };
                                }),
                            };
                        });

                    // door type
                    this.labelsDoorType = res.doorTypes;

                    // general commmodity
                    this.labelsGeneralCommodity = res.generalCommodities.map(
                        (item) => {
                            if (
                                item.name.toLowerCase() ===
                                LoadModalStringEnum.HAZARDOUS
                            ) {
                                return {
                                    ...item,
                                    logoName: LoadModalStringEnum.HAZARDOUS_SVG,
                                    folder: LoadModalStringEnum.COMMON,
                                };
                            }
                            return { ...item };
                        }
                    );

                    // labels suspension
                    this.labelsSuspension = res.suspensions;

                    // labels template
                    this.labelsTemplate = res.templates;

                    // trailer length
                    this.labelsTrailerLength = res.trailerLengths;

                    // trailer req
                    this.labelsTrailerReq = res.trailerTypes.map((item) => {
                        return {
                            ...item,
                            folder: LoadModalStringEnum.COMMON,
                            subFolder: LoadModalStringEnum.TRAILERS,
                        };
                    });

                    // truck req
                    this.labelsTruckReq = res.truckTypes.map((item) => {
                        return {
                            ...item,
                            folder: LoadModalStringEnum.COMMON,
                            subFolder: LoadModalStringEnum.TRUCKS,
                        };
                    });

                    // years
                    this.labelsYear = res.years.map((item, index) => {
                        return {
                            id: index + 1,
                            name: `${item.toString()}+`,
                        };
                    });

                    // shipper
                    this.labelsShippers = res.shippers.map((item) => {
                        return {
                            ...item,
                            name: item?.businessName,
                            address: item.address?.city
                                ?.concat(', ', item.address?.stateShortName)
                                ?.concat(
                                    LoadModalStringEnum.EMPTY_SPACE_STRING,
                                    item.address?.zipCode
                                ),
                            logoName:
                                item.status === 0
                                    ? LoadModalStringEnum.BROKER_CLOSED_SVG
                                    : null,
                        };
                    });
                    this.originalShippers = res.shippers;

                    // shipper contacts
                    this.labelsShipperContacts = this.originShipperContacts =
                        res.shipperContacts.map((item) => {
                            return {
                                ...item,
                                contacts: item.contacts.map((item) => {
                                    return {
                                        ...item,
                                        name: item?.fullName,
                                        phone: item?.phone?.concat(
                                            LoadModalStringEnum.EMPTY_SPACE_STRING,
                                            item?.phoneExt
                                                ? `x${item.phoneExt}`
                                                : LoadModalStringEnum.EMPTY_STRING
                                        ),
                                        originalPhone: item.phone,
                                        phoneExtension: item.phoneExt,
                                        fullName: item?.fullName?.concat(
                                            LoadModalStringEnum.EMPTY_SPACE_STRING,
                                            item?.phone?.concat(
                                                LoadModalStringEnum.EMPTY_SPACE_STRING,
                                                item?.phoneExt
                                                    ? `x${item.phoneExt}`
                                                    : LoadModalStringEnum.EMPTY_STRING
                                            )
                                        ),
                                    };
                                }),
                            };
                        });

                    // additional billing types
                    this.additionalBillingTypes = [
                        ...res.additionalBillingTypes.map((item) => {
                            return { ...item, checked: false };
                        }),
                    ];
                    this.originalAdditionalBillingTypes =
                        this.additionalBillingTypes;

                    if (this.editData) {
                        this.isConvertedToTemplate =
                            this.editData.selectedTab ===
                            TableStringEnum.TEMPLATE;
                        this.populateLoadModalData(
                            (this.editData.data ??
                                this.editData) as LoadResponse
                        );
                    } else {
                        this.watchFormChanges();
                    }

                    this.generateModalText();
                    this.isActiveLoad = this.checkIfLoadIsActive();

                    // stop items
                    this.stopItemDropdownLists = {
                        quantityDropdownList: res.loadItemUnits,
                        stackDropdownList: res.stackable,
                        secureDropdownList: res.secures,
                        tarpDropdownList: res.tarps,
                        hazardousDropdownList: res.hazardousMaterials.map(
                            (item) => {
                                return {
                                    ...item,
                                    name: item.description,
                                    folder: LoadModalStringEnum.COMMON,
                                    subFolder: LoadModalStringEnum.LOAD,
                                };
                            }
                        ),
                    };
                },

                error: () => {},
            });
    }

    private mapDocumentsAndTags() {
        let documents: Blob[] = [];
        let tagsArray = [];

        this.documents?.forEach((item) => {
            if (item.tagId?.length) {
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });
            }

            if (item.realFile) documents.push(item.realFile);
        });

        if (!tagsArray.length) {
            tagsArray = null;
        }

        return { documents, tagsArray };
    }

    private getIdOrNull(item: EnumValue): null | number {
        return item ? item.id : null;
    }

    private getCommonLoadData(): Load {
        const {
            referenceNumber,
            weight,
            liftgate,
            driverMessage,
            note,
            baseRate,
            driverRate,
            advancePay,
            tonuRate,
            revisedRate,
            invoicedDate,
        } = this.loadForm.value;

        const adjustedRate = this.adjustedRate;
        const { documents, tagsArray } = this.mapDocumentsAndTags();
        return {
            dispatcherId: this.getIdOrNull(this.selectedDispatcher),
            dispatchId: this.getIdOrNull(this.selectedDispatches),
            brokerId: this.getIdOrNull(this.selectedBroker),
            brokerContactId: this.getIdOrNull(this.selectedBrokerContact),
            referenceNumber,
            generalCommodity: this.getIdOrNull(this.selectedGeneralCommodity),
            weight: this.convertNumbers(weight),
            loadRequirements: {
                truckTypeId: this.getIdOrNull(this.selectedTruckReq),
                trailerTypeId: this.getIdOrNull(this.selectedTrailerReq),
                doorType: this.getIdOrNull(this.selectedDoorType),
                suspension: this.getIdOrNull(this.selectedSuspension),
                trailerLengthId: this.getIdOrNull(this.selectedTrailerLength),
                year: this.selectedYear
                    ? Number(this.selectedYear.name.toString().replace('+', ''))
                    : null,
                liftgate,
                driverMessage,
            },
            stops: this.premmapedStops() as LoadStopCommand[],
            baseRate: this.convertNumbers(baseRate),
            adjustedRate: this.convertNumbers(adjustedRate),
            driverRate: this.convertNumbers(driverRate),
            advancePay: this.convertNumbers(advancePay),
            additionalBillingRates: this.premmapedAdditionalBillingRate(
                LoadModalStringEnum.CREATE
            ),
            files: documents,
            tags: tagsArray,
            note,
            totalMiles: this.totalLegMiles,
            totalHours: this.totalLegHours,
            totalMinutes: this.totalLegMinutes,
            emptyMiles: this.emptyMiles,
            pays: this.mapPayments(),
            tonuRate,
            revisedRate,
            invoicedDate: this.initialinvoicedDate ?? invoicedDate,
        };
    }

    private mapPayments(): LoadPaymentPayResponse[] {
        return this.additionalPayments().value.map((payments) => {
            return {
                ...payments,
                pay: MethodsCalculationsHelper.convertThousanSepInNumber(
                    payments.pay
                ),
                payDate: MethodsCalculationsHelper.convertDateToBackend(
                    payments.payDate
                ),
            };
        });
    }

    private mapPreviousPaymets(): LoadPaymentPayResponse[] {
        return this.additionalPayments().value.map((payments) => {
            return {
                id: payments.id,
                paymentMethod: this.paymentMethodsDropdownList.find(
                    (pay) => pay.id === payments.paymentMethod
                ),
                paymentType: this.orginalPaymentTypesDropdownList.find(
                    (pay) => pay.id === payments.paymentType
                ),
                pay: MethodsCalculationsHelper.convertThousanSepInNumber(
                    payments.pay
                ),
                payDate: MethodsCalculationsHelper.convertDateToBackend(
                    payments.payDate
                ),
            };
        });
    }

    private generateLoadModel(newLoad: boolean): Load {
        const commonData = this.getCommonLoadData();

        if (newLoad) {
            return {
                ...commonData,
                type: this.tabs.find((tab) => tab.id === this.selectedTab)
                    .name as LoadType,
                loadTemplateId: this.selectedTemplate
                    ? this.selectedTemplate.id
                    : null,
                companyId:
                    this.labelsCompanies.length === 1
                        ? this.labelsCompanies[0].id
                        : this.selectedCompany.id,
                dateCreated: moment(new Date()).toISOString(true),
            };
        }

        const { id, dateCreated, status, loadRequirements } = (this.editData
            .data || this.editData) as LoadResponse;
        return {
            ...commonData,
            id,
            dateCreated,
            loadRequirements: {
                ...commonData.loadRequirements,
                id: loadRequirements?.id,
            },
            filesForDeleteIds: this.filesForDelete,
            status: this.selectedStatus?.valueForRequest,
            statusHistory: this.remapStopWaitTime(),
        };
    }

    private generateTemplateModel(): CreateLoadTemplateCommand {
        const commonData = this.getCommonLoadData();
        const { templateName } = this.loadForm.value;
        return {
            ...commonData,
            name: templateName,
            type: this.tabs.find((tab) => tab.id === this.selectedTab)
                .name as LoadType,
            companyId:
                this.labelsCompanies.length === 1
                    ? this.labelsCompanies[0].id
                    : this.selectedCompany.id,
            dateCreated: moment(new Date()).toISOString(true),
        };
    }

    public createNewLoad(addNew: boolean): void {
        const isTemplate =
            this.editData?.selectedTab === TableStringEnum.TEMPLATE;

        this.loadService
            .createLoad(this.generateLoadModel(true))
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    const loadServiceObservable = !isTemplate
                        ? this.loadService.getLoadInsideListById(data.id)
                        : this.loadService.getLoadTemplateInsideListById(
                              data.id
                          );

                    loadServiceObservable.subscribe((newLoadData) => {
                        this.loadService.addNewLoad();
                        this.setModalSpinner(null, true, true, addNew);
                    });
                },
                error: () => this.setModalSpinner(null, false, false),
            });
    }

    public addNewLoadModal(): void {
        this.modalService.openModal(LoadModalComponent, {
            size: LoadModalStringEnum.LOAD,
        });
    }

    public updateLoadTemplate(addNew: boolean) {
        const newData = {
            ...this.generateLoadModel(false),
            name: this.loadForm.get(LoadModalStringEnum.TEMPLATE_NAME).value,
        };
        this.loadService
            .updateLoadTemplate(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.loadService
                        .getLoadTemplateInsideListById(newData.id)
                        .subscribe((res) => {
                            this.loadService.updateLoadTemplatePartily();
                        });
                    this.setModalSpinner(null, true, true, addNew);
                },
                error: () => this.setModalSpinner(null, false, false),
            });
    }
    private updateLoad(addNew: boolean): void {
        const newData = this.generateLoadModel(false);
        if (this.originalStatus !== this.selectedStatus.valueForRequest) {
            this.loadService
                .updateLoadStatus(
                    this.editData.data.id,
                    this.selectedStatus.valueForRequest as LoadStatus,
                    this.isPreviousStatus
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.handleLoadUpdate(newData, addNew));
        } else {
            this.handleLoadUpdate(newData, addNew);
        }
    }

    private handleLoadUpdate(newData: Load, addNew: boolean) {
        this.loadService
            .getLoadById(this.editData.data.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                // After status change we get times for stops that need to be sent to the backend
                // together with status history
                newData.stops.forEach((stop) => {
                    const _stop = response.stops.find(
                        (initialStop) => initialStop.id === stop.id
                    );
                    if (_stop) {
                        stop.arrive = _stop.arrive;
                        stop.depart = _stop.depart;
                    }
                });

                const isUserReversingFromInvoicedStatus =
                    this.originalStatus === LoadStatusEnum[8] &&
                    this.isPreviousStatus;

                if (isUserReversingFromInvoicedStatus)
                    newData.invoicedDate = null;

                if (this.isLoadClosed)
                    newData.statusHistory = response.statusHistory;

                this.loadService
                    .updateLoad(newData)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.loadService
                                .getLoadInsideListById(newData.id)
                                .subscribe(() => {
                                    this.loadService.updateLoadPartily();
                                });
                            this.setModalSpinner(null, true, true, addNew);
                        },
                        error: () => this.setModalSpinner(null, false, false),
                    });
            });
    }

    private saveLoadTemplate(addNew: boolean): void {
        this.loadService
            .createLoadTemplate(this.generateTemplateModel())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.loadService
                        .getLoadTemplateInsideListById(data.id)
                        .subscribe((newLoad) => {
                            this.loadService.addNewLoad();
                            this.setModalSpinner(
                                LoadModalStringEnum.LOAD_TEMPLATE,
                                true,
                                true,
                                addNew
                            );
                        });
                },
                error: () =>
                    this.setModalSpinner(
                        LoadModalStringEnum.LOAD_TEMPLATE,
                        false,
                        false
                    ),
            });
    }
    private convertNumbers(value: string): number {
        return value
            ? MethodsCalculationsHelper.convertThousanSepInNumber(value)
            : null;
    }

    private convertDate(date: string | null): string {
        return date
            ? MethodsCalculationsHelper.convertDateFromBackend(date)
            : date;
    }

    private formatTimeDifference(timeObject): string {
        if (!timeObject) return '';
        const { days, hours, minutes } = timeObject;
        let formattedString = '';

        if (days) {
            formattedString += `${days}d `;
        }
        if (hours) {
            formattedString += `${hours}h `;
        }
        if (minutes) {
            formattedString += `${minutes}m`;
        }

        return formattedString.trim();
    }

    private formatShipper(shipper: ShipperShortResponse): LoadShipper {
        if (!shipper) return null;

        const formattedShipper = {
            ...shipper,
            name: shipper.businessName,
        };

        if (shipper?.address) {
            return {
                ...formattedShipper,
                address: `${shipper.address.city}, ${shipper.address.stateShortName} ${shipper.address.zipCode}`,
            };
        }

        return formattedShipper;
    }

    private populateLoadModalData(loadModalData: LoadResponse): void {
        if (!loadModalData) return;

        const {
            loadNumber,
            type,
            company,
            dispatcher,
            broker,
            referenceNumber,
            generalCommodity,
            weight,
            dispatch,
            advancePay,
            note,
            files,
            loadedMiles,
            totalMiles,
            totalTimeHours,
            comments,
            baseRate,
            additionalBillingRates,
            pays,
            adjustedRate,
            invoicedDate,
            ageUnpaid,
            daysToPay,
            driverRate,
            tonuRate,
            revisedRate,
            statusHistory,
            emptyMiles,
            id,
            statusType,
        } = loadModalData;

        this.isEditingMode = true;
        // Check if stops exists and is an array before using it
        const stops = this.formatStop(loadModalData.stops);
        if (stops.length) {
            stops.forEach((stop, index) => {
                if (index === 0) {
                    this.pickupStatusHistory = stop.statusHistory;
                    this.pickupStopItems = stop.items;
                    this.savedPickupStopItems = stop.items.length
                        ? [stop.items]
                        : [];
                } else if (index !== stops.length - 1) {
                    this.extraStopItems[index - 1] = stop.items;
                    this.extraStopStatusHistory[index - 1] = stop.statusHistory;
                    this.savedExtraStopItems[index - 1] = stop.items.length
                        ? [stop.items]
                        : [];
                } else {
                    // In case we close modal and come back without adding delivery it will add pickup stop to delivery
                    if (stops.length > 1) {
                        this.deliveryStopItems = stop.items;
                        this.savedDeliveryStopItems = stop.items.length
                            ? [stop.items]
                            : [];
                        this.deliveryStatusHistory = stop.statusHistory;
                    }
                }
            });
        }

        this.stops = stops;
        this.statusHistory = statusHistory;

        // Check if loadRequirements exists before accessing its properties
        const loadRequirements = loadModalData.loadRequirements
            ? {
                  truckType: loadModalData.loadRequirements.truckType,
                  trailerType: loadModalData.loadRequirements.trailerType,
                  year: loadModalData.loadRequirements.year,
                  liftgate: loadModalData.loadRequirements.liftgate,
                  driverMessage: loadModalData.loadRequirements.driverMessage,
                  trailierLength: loadModalData.loadRequirements.trailerLength,
                  doorType: loadModalData.loadRequirements.doorType,
                  suspension: loadModalData.loadRequirements.suspension,
                  id: loadModalData.loadRequirements.id,
              }
            : {};

        // Ensure pickupStop and deliveryStop are defined
        let pickupStop = stops[0];

        // Ensure broker exists before attempting to find and spread
        const editedBroker = broker
            ? {
                  ...this.labelsBroker.find((b) => b.id === broker?.id),
                  name: broker?.businessName,
              }
            : {};

        // Ensure dispatcher exists before attempting to spread
        const editedDispatcher = dispatcher
            ? {
                  ...dispatcher,
                  name: dispatcher?.fullName,
              }
            : {};

        const editedTruck = dispatch
            ? this.originLabelsDispatches.find(
                  (dispatches) => dispatches.id === dispatch?.id
              )
            : null;

        const editedPickupShipper = this.formatShipper(pickupStop?.shipper);

        let deliveryStop;
        // In case we close modal and come back without adding delivery it will add pickup stop to delivery

        if (stops.length > 1) {
            deliveryStop = stops[stops.length - 1];
        }

        const editedDeliveryShipper = this.formatShipper(deliveryStop?.shipper);

        // Filter out undefined stops
        const editedStops = stops.filter(
            (_, index) => index !== 0 && index !== stops.length - 1
        );

        // Ensure pickupStop and deliveryStop are formatted if they exist
        if (pickupStop) {
            pickupStop = this.formatStopTimes(pickupStop);
        }
        if (deliveryStop) {
            deliveryStop = this.formatStopTimes(deliveryStop);
        }

        // form
        this.loadForm.patchValue({
            id,
            templateName:
                (loadModalData as any).name !== undefined
                    ? (loadModalData as any).name
                    : null,
            name: (loadModalData as any).name,
            referenceNumber: referenceNumber ?? null,
            weight: weight ?? null,
            liftgate: loadRequirements?.liftgate,
            driverMessage: loadRequirements?.driverMessage,
            loadRequirementsId: loadRequirements.id,
            note: note,
            // pickup
            pickupDateFrom: pickupStop
                ? this.convertDate(pickupStop.dateFrom)
                : null,
            pickupDateTo: pickupStop
                ? this.convertDate(pickupStop.dateTo)
                : null,
            pickupTimeFrom: pickupStop?.timeFrom,
            pickupTimeTo: pickupStop?.timeTo,
            pickuplegMiles: pickupStop?.legMiles,
            pickuplegHours: pickupStop?.legHours,
            pickuplegMinutes: pickupStop?.legMinutes,
            pickupWaitTime: pickupStop
                ? this.formatTimeDifference(pickupStop.wait)
                : null,

            // delivery
            deliveryDateFrom: deliveryStop
                ? this.convertDate(deliveryStop.dateFrom)
                : null,
            deliveryDateTo: deliveryStop
                ? this.convertDate(deliveryStop.dateTo)
                : null,
            deliveryTimeFrom: deliveryStop?.timeFrom,
            deliveryTimeTo: deliveryStop?.timeTo,
            deliverylegMiles: deliveryStop?.legMiles,
            deliverylegHours: deliveryStop?.legHours,
            deliverylegMinutes: deliveryStop?.legMinutes,
            deliveryStopOrder: deliveryStop?.stopLoadOrder,
            deliverWaitTime: deliveryStop
                ? this.formatTimeDifference(deliveryStop.wait)
                : null,

            // billing & payment
            baseRate: baseRate ?? null,
            advancePay: advancePay ?? null,
            driverRate: driverRate ?? null,
            adjustedRate: adjustedRate ?? null,

            // total
            loadMiles: loadedMiles,
            totalMiles: totalMiles,
            totalHours: totalTimeHours,
            emptyMiles: emptyMiles,
            invoicedDate,
            ageUnpaid: ageUnpaid,
            daysToPay,
            tonuRate: tonuRate ?? null,
            revisedRate: revisedRate ?? null,
            statusType: statusType?.name || statusType,
            arrive: pickupStop?.arrive,
            depart: pickupStop?.depart,
        });

        // load number
        this.loadNumber = loadNumber ?? this.loadNumber;
        this.initialinvoicedDate = invoicedDate;

        // documents
        this.documents = files || [];

        // comments
        this.comments = comments;

        // dropdowns
        if (editedBroker)
            this.onSelectDropdown(editedBroker, LoadModalStringEnum.BROKER);
        if (editedTruck)
            this.onSelectDropdown(editedTruck, LoadModalStringEnum.DISPATCHES);
        if (editedPickupShipper)
            this.onSelectDropdown(
                editedPickupShipper,
                LoadModalStringEnum.SHIPPER_PICKUP
            );
        if (editedDeliveryShipper)
            this.onSelectDropdown(
                editedDeliveryShipper,
                LoadModalStringEnum.SHIPPER_DELIVERY
            );
        if (company)
            this.onSelectDropdown(company, LoadModalStringEnum.COMPANY);
        if (loadRequirements?.truckType)
            this.onSelectDropdown(
                loadRequirements?.truckType,
                LoadModalStringEnum.TRUCK_REQ
            );
        if (loadRequirements?.trailerType)
            this.onSelectDropdown(
                loadRequirements?.trailerType,
                LoadModalStringEnum.TRAILER_REQ
            );
        if (loadRequirements.trailierLength)
            this.onSelectDropdown(
                loadRequirements.trailierLength,
                LoadModalStringEnum.LENGTH
            );
        if (loadRequirements.doorType)
            this.onSelectDropdown(
                loadRequirements.doorType,
                LoadModalStringEnum.DOOR_TYPE
            );
        if (loadRequirements.suspension)
            this.onSelectDropdown(
                loadRequirements.suspension,
                LoadModalStringEnum.SUSPENSION
            );

        // extra stops
        if (editedStops.length) {
            setTimeout(() => {
                editedStops.forEach((extraStop, index) => {
                    this.createNewExtraStop();

                    const editedShipper = extraStop.shipper
                        ? this.formatShipper(extraStop.shipper)
                        : {};

                    if (extraStop) extraStop = this.formatStopTimes(extraStop);

                    this.loadExtraStops()
                        .at(index)
                        .patchValue({
                            id: extraStop.id,
                            stopType: extraStop.stopType.name,
                            stopOrder: extraStop.stopLoadOrder,
                            stopLoadOrder: extraStop.stopLoadOrder,
                            shipperId: extraStop.shipper?.id ?? null,
                            shipperContactId:
                                extraStop.shipperContact?.id ?? null,
                            dateFrom: extraStop
                                ? this.convertDate(extraStop.dateFrom)
                                : null,
                            dateTo: extraStop
                                ? this.convertDate(extraStop.dateTo)
                                : null,
                            timeType: extraStop.timeType.name.toUpperCase(),
                            timeFrom: extraStop?.timeFrom,
                            timeTo: extraStop?.timeTo,
                            arrive: extraStop?.arrive,
                            depart: extraStop?.depart,
                            legMiles: extraStop?.legMiles,
                            legHours: extraStop?.legHours,
                            legMinutes: extraStop?.legMinutes,
                            items: extraStop?.items,
                            openClose: false,
                            statusHistory: extraStop?.statusHistory,
                            waitTime: extraStop
                                ? this.formatTimeDifference(extraStop.wait)
                                : null,
                        });

                    this.loadExtraStopsDateRange[index] = !!extraStop?.dateTo;

                    if (editedShipper?.id)
                        this.onSelectDropdown(
                            editedShipper,
                            LoadModalStringEnum.SHIPPER_EXTRA_STOPS,
                            index
                        );

                    this.onTabChange(
                        extraStop.stopType,
                        LoadModalStringEnum.STOP_TAB,
                        index
                    );
                    this.onTabChange(
                        extraStop.timeType,
                        LoadModalStringEnum.EXTRA_STOPS_TIME,
                        index
                    );
                });
            }, 500);
        }
        // tabs
        if (type) {
            this.onTabChange(type, LoadModalStringEnum.FTL_LTL);
        }
        if (pickupStop)
            this.onTabChange(
                pickupStop.timeType,
                LoadModalStringEnum.STOP_TIME_PICKUP
            );
        if (deliveryStop)
            this.onTabChange(
                deliveryStop.timeType,
                LoadModalStringEnum.STOP_TIME_DELIVERY
            );

        // selected
        this.selectedCompany = company
            ? { ...company, name: company.companyName }
            : {};
        this.selectedDispatcher = editedDispatcher;
        this.selectedGeneralCommodity = generalCommodity;
        this.selectedTruckReq = loadRequirements?.truckType;
        this.selectedTrailerReq = loadRequirements?.trailerType;
        this.selectedYear = loadRequirements?.year
            ? this.labelsYear.find(
                  (year) =>
                      year.name.toString().replace('+', '') ==
                      `${loadRequirements?.year.toString().replace('+', '')}`
              )
            : null;

        additionalBillingRates?.forEach((rate) => {
            if (rate.rate) {
                this.additionalBillings().push(
                    this.createAdditionaBilling({
                        id: rate.id,
                        name: rate.additionalBillingType.name,
                        billingValue: rate.rate,
                    })
                );
            }
        });

        this.isEachStopItemsRowValid = true;

        pays?.forEach((pay) => {
            this.additionalPayments().push(
                this.createAdditionPaymentBilling({
                    id: pay.id,
                    pay: MethodsCalculationsHelper.convertNumberInThousandSep(
                        pay.pay
                    ) as any,
                    payType: pay.paymentType,
                    payDate: MethodsCalculationsHelper.convertDateFromBackend(
                        pay.payDate
                    ),
                    paymentType: pay.paymentType.id,
                    paymentMethod: pay.paymentMethod.id,
                    name: pay.paymentType.name,
                    displayPaymentType: pay.paymentMethod.name,
                })
            );
        });

        this.isVisiblePayment = !!pays?.length;

        this.pickupDateRange = !!pickupStop?.dateTo;
        this.deliveryDateRange = !!deliveryStop?.dateTo;

        this.isHazardousPicked =
            generalCommodity?.name.toLowerCase() ===
            LoadModalStringEnum.HAZARDOUS;
        if (!this.isHazardousPicked) this.isHazardousVisible = false;
    }

    private formatStop(stops: LoadStopResponse[]): LoadStopResponse[] {
        const _stops = stops?.filter((stop) => stop.id !== 0) || [];

        if (!this.isConvertedToTemplate) return _stops;

        // Clear stop values
        _stops.forEach((stop) => {
            stop.arrive = null;
            stop.depart = null;
            stop.statusHistory = [];
        });

        return _stops;
    }

    public pickupStatusHistoryChange(
        newHistory: LoadStatusHistoryResponse[],
        action: string,
        index: number
    ): void {
        switch (action) {
            case LoadModalStringEnum.PICKUP:
                this.pickupStatusHistory = newHistory;
                break;

            case LoadModalStringEnum.EXTRA_STOP:
                this.extraStopStatusHistory[index] = newHistory;
                break;

            case LoadModalStringEnum.DELIVERY:
                this.deliveryStatusHistory = newHistory;
                break;
        }
    }

    private formatStopTimes(stop: LoadStopResponse): LoadStopResponse {
        //  If step is finished we need to show different times
        if (stop?.arrive && stop?.depart) {
            return {
                ...stop,
                dateFrom: stop.arrive,
                dateTo: stop.dateTo,
                timeFrom: MethodsCalculationsHelper.convertTimeFromBackend(
                    stop.arrive
                ) as any,
                timeTo: MethodsCalculationsHelper.convertTimeFromBackend(
                    stop.depart
                ) as any,
            };
        }
        return { ...stop };
    }

    public shouldDisableDrag(extraStop: UntypedFormArray): boolean {
        return (
            this.isStepFinished(extraStop) ||
            this.isDragAndDropActive ||
            this.loadExtraStops().controls.length < 2 ||
            extraStop.get(LoadModalStringEnum.OPEN_CLOSE).value
        );
    }

    public isStepFinished(
        extraStop: UntypedFormArray | AbstractControl
    ): boolean {
        return (
            extraStop.value.arrive !== null && extraStop.value.depart !== null
        );
    }

    public isPickupStopFinished(): boolean {
        const pickupStop = this.stops?.filter((stop) => stop.id !== 0);
        return (
            pickupStop?.length &&
            !!(pickupStop[0].arrive && pickupStop[0].depart)
        );
    }

    public isDeliveryStopFinished(): boolean {
        if (this.stops) {
            const deliveryStop = this.stops[this.stops.length - 1];
            return (
                deliveryStop && !!(deliveryStop.arrive && deliveryStop.depart)
            );
        }
        return false;
    }

    public isExtraStopAppointment(index: number): boolean {
        const isAppointment =
            this.selectedExtraStopTime[index] === 2 ||
            this.selectedExtraStopTime[index] > 8999;
        if (this.isStepFinished(this.loadExtraStops().at(index))) {
            return false;
        }

        return isAppointment;
    }

    public isPickupAppointment(): boolean {
        const isAppointment =
            this.selectedStopTimePickup === 6 ||
            this.selectedStopTimePickup === 2;

        if (this.isPickupStopFinished()) {
            return false;
        }

        return isAppointment;
    }

    public isDeliveryAppointment(): boolean {
        const isAppointment =
            this.selectedStopTimeDelivery === 8 ||
            this.selectedStopTimeDelivery === 2;

        if (this.isDeliveryStopFinished()) {
            return false;
        }

        return isAppointment;
    }
    public drop(event: CdkDragDrop<string[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }

        this.reorderingStarted = true;

        // Reorder values from extra stops
        const itemsToReorder = [
            this.loadExtraStops().controls,
            this.selectExtraStopType,
            this.selectedExtraStopShipper,
            this.selectedExtraStopShipperContact,
            this.typeOfExtraStops,
            this.loadExtraStopsShipperInputConfig,
            this.stopTimeTabsExtraStops,
            this.loadExtraStopsShipperContactsInputConfig,
            this.selectedExtraStopTime,
            this.extraStopItems,
            this.extraStopStatusHistory,
            this.loadExtraStopsDateRange as [],
            this.isCreatedNewStopItemsRow.extraStops,
        ];

        itemsToReorder.forEach((item) => {
            moveItemInArray(item, event.previousIndex, event.currentIndex);
        });

        this.getStopNumbers();

        // Prevent opening or closing tab
        setTimeout(() => (this.isDragAndDropActive = false), 250);
    }

    public onDragStart(): void {
        this.isDragAndDropActive = true;
    }
    public onDragEnd(): void {
        setTimeout(() => {
            this.isDragAndDropActive = false;
        }, 250);
    }

    public runFormValidation(): void {
        this.loadForm.markAsTouched();
        if (this.reorderingStarted) this.reorderingSaveError = true;
    }

    private setModalSpinner(
        action: null | LoadModalStringEnum.LOAD_TEMPLATE,
        status: boolean,
        close: boolean,
        addNew?: boolean
    ): void {
        this.modalService.setModalSpinner({
            action,
            status,
            close,
        });
        this.isButtonDisabled = false;
        if (addNew) this.addNewLoadModal();
    }

    private getStopNumbers(): void {
        let pickupStopNumber = 1;
        let deliveryStopNumber = 0;
        this.extraStopNumbers = [];

        this.loadExtraStops().controls.forEach((extraStop, index) => {
            if (extraStop.value.stopType === LoadModalStringEnum.PICKUP_2) {
                pickupStopNumber++;
                this.extraStopNumbers.push(pickupStopNumber);
            } else {
                deliveryStopNumber++;
                this.extraStopNumbers.push(deliveryStopNumber);
            }
        });

        this.loadForm
            .get(LoadModalStringEnum.DELIVERY_STOP_ORDER)
            .patchValue(deliveryStopNumber + 1);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
