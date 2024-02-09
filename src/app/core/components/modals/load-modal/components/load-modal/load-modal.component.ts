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

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { LoadFinancialComponent } from '../load-modal-financial/load-modal-financial.component';
import { BrokerModalComponent } from '../../../broker-modal/broker-modal.component';
import { ShipperModalComponent } from '../../../shipper-modal/shipper-modal.component';
import { AppTooltipComponent } from '../../../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from '../../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '../../../../shared/ta-input/ta-input.component';
import { TaCustomCardComponent } from '../../../../shared/ta-custom-card/ta-custom-card.component';
import { TaCheckboxComponent } from '../../../../shared/ta-checkbox/ta-checkbox.component';
import { LoadStopComponent } from '../load-modal-stop/load-modal-stop.component';
import { TaUploadFilesComponent } from '../../../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../../../shared/ta-input-note/ta-input-note.component';
import { MapsComponent } from '../../../../shared/maps/maps.component';
import { TaCommentComponent } from '../../../../standalone-components/ta-comment/ta-comment.component';
import { LoadModalStopItemsComponent } from '../load-modal-stop-items/load-modal-stop-items.component';

// services
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { FormService } from '../../../../../services/form/form.service';
import { LoadTService } from '../../../../load/state/load.service';

// animations
import { fadeInAnimation } from '../../state/utils/animations/fade-in.animation';

// helpers
import {
    convertDateFromBackend,
    convertDateFromBackendToDateAndTime,
    convertDateToBackend,
    convertThousanSepInNumber,
} from '../../../../../utils/methods.calculations';

// pipes
import { FinancialCalculationPipe } from '../../state/pipes/financialCalculation.pipe';
import { LoadDatetimeRangePipe } from '../../state/pipes/load-datetime-range.pipe';
import { LoadTimeTypePipe } from '../../state/pipes/load-time-type.pipe';

// constants
import { LoadModalConstants } from '../../state/utils/constants/load-modal.constants';
import { LoadModalConfigConstants } from '../../state/utils/constants/load-modal-config.constants';
import { LoadStopItemsConstants } from '../../state/utils/constants/load-stop-items.constants';

// enums
import { ConstantStringEnum } from '../../state/enums/load-modal.enum';

// models
import {
    SignInResponse,
    LoadModalResponse,
    CreateLoadTemplateCommand,
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
} from 'appcoretruckassist';
import { ITaInput } from '../../../../shared/ta-input/ta-input.config';
import {
    IBilling,
    IPayment,
} from '../load-modal-financial/load-modal-financial.component';
import { MapRouteModel } from '../../../../shared/model/map-route';
import { StopRoutes } from '../../state/models/load-modal-model/stop-routes.model';
import { LoadModalTab } from '../../state/models/load-modal-model/load-modal-tab';
import { Load } from '../../state/models/load-modal-model/load.model';
import { Tags } from '../../state/models/load-modal-model/tags.model';
import { CommentCompanyUser } from '../../state/models/load-modal-model/comment-company-user';
import { CommentData } from 'src/app/core/model/comment-data';
import { StopItemDropdownLists } from '../../state/models/load-modal-stop-items-model/load-stop-item-dropdowns.model';
import { StopItemsData } from '../../state/models/load-modal-stop-items-model/load-stop-items-data.model';
import { IsCreatedNewStopItemsRow } from '../../state/models/load-modal-stop-items-model/is-created-new-stop-items-row.model';
import { EditData } from '../../state/models/load-modal-model/edit-data.model';
import { FileEvent } from 'src/app/core/model/file-event.model';
import { AdditionalBilling } from '../../state/models/load-modal-model/additional-billing.model';
import { Year } from '../../state/models/load-modal-model/year-dropdown.model';

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

        // components
        AppTooltipComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputDropdownComponent,
        TaInputComponent,
        TaCustomCardComponent,
        TaCheckboxComponent,
        LoadStopComponent,
        LoadFinancialComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        MapsComponent,
        TaCommentComponent,
        LoadModalStopItemsComponent,

        // pipes
        FinancialCalculationPipe,
        LoadDatetimeRangePipe,
        LoadTimeTypePipe,
    ],
    animations: [fadeInAnimation],
    providers: [FinancialCalculationPipe],
})
export class LoadModalComponent implements OnInit, OnDestroy, DoCheck {
    @ViewChild('originElement') originElement: ElementRef;
    @ViewChild('popover') popover: NgbPopover;

    @Input() editData: EditData;

    private destroy$ = new Subject<void>();

    public companyUser: SignInResponse = null;

    // form
    public loadForm: UntypedFormGroup;
    public isFormDirty: boolean = false;

    // modal
    public originHeight: number;
    public loadModalSize: string = ConstantStringEnum.MODAL_SIZE;
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
    public selectedYear: Year = null;

    // load stop item labels
    public stopItemDropdownLists: StopItemDropdownLists;

    // input configurations
    public loadDispatchesTTDInputConfig: ITaInput;
    public loadBrokerInputConfig: ITaInput;
    public loadBrokerContactsInputConfig: ITaInput;
    public loadPickupShipperInputConfig: ITaInput;
    public loadPickupShipperContactsInputConfig: ITaInput;
    public loadDeliveryShipperInputConfig: ITaInput;
    public loadDeliveryShipperContactsInputConfig: ITaInput;

    // extra Stop configuration
    public selectedExtraStopShipper: any[] = [];
    public selectedExtraStopShipperContact: any[] = [];
    public loadExtraStopsShipperInputConfig: ITaInput[] = [];
    public loadExtraStopsShipperContactsInputConfig: ITaInput[] = [];
    public loadExtraStopsDateRange: EnumValue[] | boolean[] = [];
    public selectedExtraStopTime: any[] = [];
    public previousDeliveryStopOrder: number;

    // stop items
    public pickupStopItems: StopItemsData[] = [];
    public deliveryStopItems: StopItemsData[] = [];
    public extraStopItems: StopItemsData[][] = [];

    public isCreatedNewStopItemsRow: IsCreatedNewStopItemsRow;
    public isEachStopItemsRowValid: boolean = true;

    // billing & payment
    public originalAdditionalBillingTypes: AdditionalBilling[] = [];
    public additionalBillingTypes: AdditionalBilling[] = [];
    public loadModalBill: IBilling;
    public loadModalPayment: IPayment;
    public selectedAdditionalBillings: AdditionalBilling[] = [];
    public isAvailableAdjustedRate: boolean = false;
    public isAvailableAdvanceRate: boolean = false;
    public isVisibleBillDropdown: boolean = false;
    public isVisiblePayment: boolean = false;

    // documents
    public documents: any[] = [];
    public filesForDelete: number[] = [];
    public tags: TagResponse[] = [];

    public isDocumentsCardOpen: boolean = false;

    // comments
    public comments: CommentCompanyUser[] = [];
    private editedCommentId: number;
    private deletedCommentId: number;

    public isCommenting: boolean = false;
    public isCommented: boolean = false;
    public isCommentEdited: boolean = false;

    // map routes
    public loadStopRoutes: MapRouteModel[] = [];

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

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private loadService: LoadTService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        private financialCalculationPipe: FinancialCalculationPipe,
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

    public trackByIdentity(_, index: number): number {
        return index;
    }

    private createForm(): void {
        this.loadForm = this.formBuilder.group({
            templateName: [
                null,
                this.isConvertedToTemplate && Validators.required,
            ],
            loadTemplateId: [null],
            dispatcherId: [null],
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
            pickupStop: [ConstantStringEnum.PICKUP_2],
            pickupStopOrder: [1],
            pickupShipper: [null, Validators.required],
            pickupShipperContactId: [null],
            pickupDateFrom: [null, Validators.required],
            pickupDateTo: [null],
            pickupTimeFrom: [null, Validators.required],
            pickupTimeTo: [null, Validators.required],
            pickuplegMiles: [null],
            pickuplegHours: [null],
            pickuplegMinutes: [null],
            pickuplegCost: [null],

            // delivery stop
            deliveryStop: [ConstantStringEnum.DELIVERY_2],
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

            // extra stops
            extraStops: this.formBuilder.array([]),

            // billing
            baseRate: [null, Validators.required],
            adjustedRate: [null],
            driverRate: [null],
            advancePay: [null],
            additionalBillings: this.formBuilder.array([]),
            billingDropdown: [null],
            invoiced: [null],

            // note, files
            note: [null],
            files: [null],
            tags: [null],

            // legs
            loadMiles: [0],
            totalMiles: [0],
            totalHours: [0],
            totalMinutes: [0],
        });

        this.formService.checkFormChange(this.loadForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (isFormChange: boolean) => (this.isFormDirty = isFormChange)
            );
    }

    private getCompanyUser(): void {
        this.companyUser = JSON.parse(
            localStorage.getItem(ConstantStringEnum.USER)
        );
    }

    private getConstantData(): void {
        this.tabs = LoadModalConstants.LOAD_MODAL_TABS;

        // tabs
        this.typeOfExtraStops = LoadModalConstants.TYPE_OF_EXTRA_STOPS;
        this.stopTimeTabsPickup = LoadModalConstants.STOP_TIME_TABS_PICKUP;
        this.stopTimeTabsDelivery = LoadModalConstants.STOP_TIME_TABS_DELIVERY;
        this.stopTimeTabsExtraStops =
            LoadModalConstants.STOP_TIME_TABS_EXTRA_STOPS;

        // configurations
        this.loadDispatchesTTDInputConfig =
            LoadModalConfigConstants.LOAD_DISPATCHES_TTD_INPUT_CONFIG;
        this.loadBrokerInputConfig =
            LoadModalConfigConstants.LOAD_BROKER_INPUT_CONFIG;
        this.loadBrokerContactsInputConfig =
            LoadModalConfigConstants.LOAD_BROKER_CONTACTS_INPUT_CONFIG;
        this.loadPickupShipperInputConfig =
            LoadModalConfigConstants.LOAD_PICKUP_SHIPPER_INPUT_CONFIG;
        this.loadPickupShipperContactsInputConfig =
            LoadModalConfigConstants.LOAD_PICKUP_SHIPPER_CONTACTS_INPUT_CONFIG;
        this.loadDeliveryShipperInputConfig =
            LoadModalConfigConstants.LOAD_DELIVERY_SHIPPER_INPUT_CONFIG;
        this.loadDeliveryShipperContactsInputConfig =
            LoadModalConfigConstants.LOAD_DELIVERY_SHIPPER_CONTACTS_INPUT_CONFIG;

        // billing & payment
        this.loadModalBill = LoadModalConstants.LOAD_MODAL_BILL;
        this.loadModalPayment = LoadModalConstants.LOAD_MODAL_PAYMENT;

        // stop items
        this.isCreatedNewStopItemsRow =
            LoadStopItemsConstants.IS_CREATED_NEW_STOP_ITEMS_ROW;
    }

    public onTabChange(event: EnumValue, action: string, indx?: number): void {
        switch (action) {
            case ConstantStringEnum.FTL_LTL:
                this.selectedTab = event.id;

                this.tabs = this.tabs.map((tab) => {
                    return {
                        ...tab,
                        checked: tab.name === event.name,
                    };
                });

                break;
            case ConstantStringEnum.STOP_TAB:
                this.selectExtraStopType[indx] = this.editData
                    ? event.id === 1
                        ? 3000 + indx
                        : 4000 + indx
                    : event.id;

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
                    .get(ConstantStringEnum.STOP_TYPE)
                    .patchValue(
                        event.id
                            .toString()
                            .startsWith(ConstantStringEnum.NUMBER_4)
                            ? ConstantStringEnum.DELIVERY_2
                            : ConstantStringEnum.PICKUP_2
                    );

                const obj = this.numberOfLoadExtraStops();

                if (!this.editData) {
                    if (
                        event.id
                            .toString()
                            .startsWith(ConstantStringEnum.NUMBER_4)
                    ) {
                        this.previousDeliveryStopOrder = this.loadForm.get(
                            ConstantStringEnum.DELIVERY_STOP_ORDER
                        ).value;

                        this.loadExtraStops()
                            .at(indx)
                            .get(ConstantStringEnum.STOP_ORDER)
                            .patchValue(obj.numberOfDeliveries);

                        this.loadForm
                            .get(ConstantStringEnum.DELIVERY_STOP_ORDER)
                            .patchValue(obj.numberOfDeliveries + 1);
                    } else {
                        this.loadExtraStops()
                            .at(indx)
                            .get(ConstantStringEnum.STOP_ORDER)
                            .patchValue(obj.numberOfPickups);

                        if (this.previousDeliveryStopOrder)
                            this.loadForm
                                .get(ConstantStringEnum.DELIVERY_STOP_ORDER)
                                .patchValue(this.previousDeliveryStopOrder);
                    }

                    this.calculateStopOrder();
                }

                if (this.selectedExtraStopShipper[indx]) this.drawStopOnMap();

                break;
            case ConstantStringEnum.STOP_TIME_PICKUP:
                this.selectedStopTimePickup = event.id;

                this.stopTimeTabsPickup = this.stopTimeTabsPickup.map((tab) => {
                    return {
                        ...tab,
                        checked:
                            tab.name.toLowerCase() === event.name.toLowerCase(),
                    };
                });

                if (
                    this.selectedStopTimePickup === 6 ||
                    this.selectedStopTimePickup === 2
                ) {
                    this.inputService.changeValidators(
                        this.loadForm.get(ConstantStringEnum.PICKUP_TIME_TO),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.loadForm.get(ConstantStringEnum.PICKUP_TIME_TO)
                    );
                }

                break;
            case ConstantStringEnum.STOP_TIME_DELIVERY:
                this.selectedStopTimeDelivery = event.id;

                this.stopTimeTabsDelivery = this.stopTimeTabsDelivery.map(
                    (tab) => {
                        return {
                            ...tab,
                            checked:
                                tab.name.toLowerCase() ===
                                event.name.toLowerCase(),
                        };
                    }
                );

                if (
                    this.selectedStopTimeDelivery === 8 ||
                    this.selectedStopTimeDelivery === 2
                ) {
                    this.inputService.changeValidators(
                        this.loadForm.get(ConstantStringEnum.DELIVERY_TIME_TO),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.loadForm.get(ConstantStringEnum.DELIVERY_TIME_TO)
                    );
                }

                break;
            case ConstantStringEnum.EXTRA_STOPS_TIME:
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
                        .startsWith(ConstantStringEnum.NUMBER_9) ||
                    this.selectedExtraStopTime[indx] === 2
                ) {
                    this.inputService.changeValidators(
                        this.loadExtraStops()
                            .at(indx)
                            .get(ConstantStringEnum.TIME_TO),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.loadExtraStops()
                            .at(indx)
                            .get(ConstantStringEnum.TIME_TO)
                    );
                }

                break;
            default:
                break;
        }
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case ConstantStringEnum.SAVE:
            case ConstantStringEnum.SAVE_AND_ADD_NEW:
                if (this.loadForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.loadForm);

                    return;
                }

                if (this.isConvertedToTemplate) {
                    this.saveLoadTemplate();
                } else {
                    this.editData ? this.updateLoad() : this.createNewLoad();
                }

                if (data.action === ConstantStringEnum.SAVE_AND_ADD_NEW)
                    this.modalService.openModal(LoadModalComponent, {
                        size: ConstantStringEnum.LOAD,
                    });

                break;
            case ConstantStringEnum.CONVERT_TO_TEMPLATE:
                this.isConvertedToTemplate = true;

                this.inputService.changeValidators(
                    this.loadForm.get(ConstantStringEnum.TEMPLATE_NAME)
                );

                break;
            default:
                break;
        }
    }

    public onSelectDropdown(event: any, action: string, index?: number): void {
        switch (action) {
            case ConstantStringEnum.DISPATCHER:
                this.selectedDispatcher = event;

                if (this.selectedDispatcher) {
                    this.labelsDispatches = this.originLabelsDispatches.filter(
                        (item) =>
                            item.dispatcherId === this.selectedDispatcher.id
                    );

                    this.selectedDispatches = null;

                    this.loadForm
                        .get(ConstantStringEnum.DISPATCH_ID)
                        .patchValue(null);
                } else {
                    this.labelsDispatches = this.originLabelsDispatches;
                }

                break;
            case ConstantStringEnum.COMPANY:
                this.selectedCompany = event;

                break;
            case ConstantStringEnum.GENERAL_COMMODITY:
                this.selectedGeneralCommodity = event;

                this.isHazardousPicked =
                    event?.name?.toLowerCase() === ConstantStringEnum.HAZARDOUS;

                if (!this.isHazardousPicked) this.isHazardousVisible = false;

                break;
            case ConstantStringEnum.DISPATCHES:
                this.onSelectDropdownDispatches(event);

                break;
            case ConstantStringEnum.BROKER:
                this.onSelectDropdownBroker(event);

                break;
            case ConstantStringEnum.BROKER_CONTACT:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: ConstantStringEnum.OPEN,
                        payload: {
                            key: ConstantStringEnum.LOAD_MODAL,
                            value: this.loadModalData(),
                            id: this.selectedBroker.id,
                        },
                        type: ConstantStringEnum.EDIT_CONTACT,
                        component: BrokerModalComponent,
                        size: ConstantStringEnum.SMALL,
                    });
                } else {
                    if (event) {
                        this.selectedBrokerContact = {
                            ...event,
                            name: event?.name?.concat(
                                ConstantStringEnum.EMPTY_SPACE_STRING,
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
                                    ConstantStringEnum.LOAD_BROKER_CONTACT,
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
            case ConstantStringEnum.SHIPPER_PICKUP:
                this.onSelectDropdownShipperPickup(event);

                break;
            case ConstantStringEnum.SHIPPER_CONTACT_PICKUP:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: ConstantStringEnum.OPEN,
                        payload: {
                            key: ConstantStringEnum.LOAD_MODAL,
                            value: this.loadModalData(),
                            id: this.selectedPickupShipper.id,
                        },
                        type: ConstantStringEnum.EDIT_CONTACT,
                        component: ShipperModalComponent,
                        size: ConstantStringEnum.SMALL,
                    });
                } else {
                    if (event) {
                        this.selectedPickupShipperContact = {
                            ...event,
                            name: event?.name?.concat(
                                ConstantStringEnum.EMPTY_SPACE_STRING,
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
                                    ConstantStringEnum.LOAD_SHIPPER_CONTACT,
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
            case ConstantStringEnum.SHIPPER_DELIVERY:
                this.onSelectDropdownShipperDelivery(event);

                break;
            case ConstantStringEnum.SHIPPER_CONTACT_DELIVERY:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: ConstantStringEnum.OPEN,
                        payload: {
                            key: ConstantStringEnum.LOAD_MODAL,
                            value: this.loadModalData(),
                            id: this.selectedDeliveryShipper.id,
                        },
                        type: ConstantStringEnum.EDIT_CONTACT,
                        component: ShipperModalComponent,
                        size: ConstantStringEnum.SMALL,
                    });
                } else {
                    if (event) {
                        this.selectedDeliveryShipperContact = {
                            ...event,
                            name: event?.name?.concat(
                                ConstantStringEnum.EMPTY_SPACE_STRING,
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
                                    ConstantStringEnum.LOAD_SHIPPER_CONTACT,
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
            case ConstantStringEnum.SHIPPER_EXTRA_STOPS:
                this.onSelectDropdownShipperExtraStops(event, index);

                break;
            case ConstantStringEnum.SHIPPER_CONTACT_EXTRA_STOPS:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: ConstantStringEnum.OPEN,
                        payload: {
                            key: ConstantStringEnum.LOAD_MODAL,
                            value: this.loadModalData(),
                            id: this.selectedExtraStopShipper[index].id,
                        },
                        type: ConstantStringEnum.EDIT_CONTACT,
                        component: ShipperModalComponent,
                        size: ConstantStringEnum.SMALL,
                    });
                } else {
                    if (event) {
                        this.selectedExtraStopShipperContact[index] = {
                            ...event,
                            name: event?.name?.concat(
                                ConstantStringEnum.EMPTY_SPACE_STRING,
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
                                    ConstantStringEnum.LOAD_SHIPPER_CONTACT,
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
            case ConstantStringEnum.TRUCK_REQ:
                this.selectedTruckReq = event;

                break;
            case ConstantStringEnum.TRAILER_REQ:
                this.selectedTrailerReq = event;

                break;
            case ConstantStringEnum.DOOR_TYPE:
                this.selectedDoorType = event;

                break;
            case ConstantStringEnum.SUSPENSION:
                this.selectedSuspension = event;

                break;
            case ConstantStringEnum.LENGTH:
                this.selectedTrailerLength = event;

                break;
            case ConstantStringEnum.YEAR:
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
                        ConstantStringEnum.EMPTY_SPACE_STRING,
                        event?.trailer?.name
                    )
                    .concat(
                        ConstantStringEnum.EMPTY_SPACE_STRING,
                        event?.driver?.name
                    ),
            };

            // draw stop on map
            this.drawStopOnMap();

            this.loadDispatchesTTDInputConfig = {
                ...this.loadDispatchesTTDInputConfig,
                multipleLabel: {
                    labels: [
                        ConstantStringEnum.TRUCK,
                        ConstantStringEnum.TRAILER,
                        ConstantStringEnum.DRIVER,
                        event?.payType ? ConstantStringEnum.DRIVER_PAY : null,
                    ],
                    customClass: ConstantStringEnum.LOAD_DISPATCHES_TTD,
                },
                multipleInputValues: {
                    options: [
                        {
                            id: event?.truck?.id,
                            value: event?.truck?.name,
                            logoName: event?.truck?.logoName,
                            isImg: false,
                            isSvg: true,
                            folder: ConstantStringEnum.COMMON,
                            subFolder: ConstantStringEnum.TRUCKS,
                            logoType: event?.truck?.logoType,
                        },
                        {
                            value: event?.trailer?.name,
                            logoName: event?.trailer?.logoName,
                            isImg: false,
                            isSvg: true,
                            folder: ConstantStringEnum.COMMON,
                            subFolder: ConstantStringEnum.TRAILERS,
                            logoType: event?.trailer?.logoType,
                        },
                        {
                            value: event?.driver?.name,
                            logoName: event?.driver?.logoName
                                ? event?.driver?.logoName
                                : ConstantStringEnum.NO_URL,
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
                    customClass: ConstantStringEnum.LOAD_DISPATCHES_TTD,
                },
            };

            if (
                this.selectedDispatches.payType === ConstantStringEnum.FLAT_RATE
            ) {
                this.inputService.changeValidators(
                    this.loadForm.get(ConstantStringEnum.DRIVER_RATE)
                );

                this.inputService.changeValidators(
                    this.loadForm.get(ConstantStringEnum.ADJUSTED_RATE),
                    false
                );

                this.additionalBillingTypes =
                    this.additionalBillingTypes.filter((item) => item.id !== 6);
            } else {
                this.inputService.changeValidators(
                    this.loadForm.get(ConstantStringEnum.DRIVER_RATE),
                    false
                );

                if (
                    this.selectedDispatches.payType &&
                    !this.additionalBillingTypes.find((item) => item.id === 6)
                ) {
                    this.additionalBillingTypes.unshift({
                        id: 6,
                        name: ConstantStringEnum.ADJUSTED,
                        checked: false,
                    });
                }
            }
        } else {
            this.loadDispatchesTTDInputConfig = {
                ...this.loadDispatchesTTDInputConfig,
                multipleLabel: {
                    labels: [
                        ConstantStringEnum.TRUCK,
                        ConstantStringEnum.TRAILER,
                        ConstantStringEnum.DRIVER,
                        ConstantStringEnum.DRIVER_PAY,
                    ],
                    customClass: ConstantStringEnum.LOAD_DISPATCHES_TTD,
                },
                multipleInputValues: null,
            };

            this.selectedDispatches = null;

            this.inputService.changeValidators(
                this.loadForm.get(ConstantStringEnum.DRIVER_RATE),
                false
            );

            this.inputService.changeValidators(
                this.loadForm.get(ConstantStringEnum.ADJUSTED_RATE),
                false
            );

            this.loadForm
                .get(ConstantStringEnum.PICKUP_LEG_MILES)
                .patchValue(null);
        }
    }

    private onSelectDropdownBroker(event): void {
        if (event?.canOpenModal) {
            this.ngbActiveModal.close();

            this.modalService.setProjectionModal({
                action: ConstantStringEnum.OPEN,
                payload: {
                    key: ConstantStringEnum.LOAD_MODAL,
                    value: this.loadModalData(),
                },
                type: ConstantStringEnum.NEW,
                component: BrokerModalComponent,
                size: ConstantStringEnum.SMALL,
            });
        } else {
            this.selectedBroker = event;

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
                                        ?.name !== ConstantStringEnum.UNLIMITED,
                            },
                            {
                                value: this.selectedBroker.loadsCount,
                                logoName: null,
                                isCounter: true,
                            },
                        ],
                        customClass: ConstantStringEnum.LOAD_BROKER,
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
                    name: ConstantStringEnum.ADD_NEW,
                });

                if (this.labelsBrokerContacts[1]?.contacts[0]) {
                    this.selectedBrokerContact =
                        this.labelsBrokerContacts[1].contacts[0];

                    if (this.selectedBrokerContact) {
                        this.loadForm
                            .get(ConstantStringEnum.BROKER_CONTACT_ID)
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
                                    ConstantStringEnum.LOAD_BROKER_CONTACT,
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
                            name: ConstantStringEnum.ADD_NEW,
                        },
                    ];

                    this.loadForm
                        .get(ConstantStringEnum.BROKER_CONTACT_ID)
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
                    .get(ConstantStringEnum.BROKER_CONTACT_ID)
                    .patchValue(null);

                this.loadBrokerContactsInputConfig = {
                    ...this.loadBrokerContactsInputConfig,
                    multipleInputValues: null,
                    isDisabled: true,
                };
            }
        }
    }

    private onSelectDropdownShipperPickup(event): void {
        if (event?.canOpenModal) {
            this.ngbActiveModal.close();

            this.modalService.setProjectionModal({
                action: ConstantStringEnum.OPEN,
                payload: {
                    key: ConstantStringEnum.LOAD_MODAL,
                    value: this.loadModalData(),
                },
                type: ConstantStringEnum.NEW,
                component: ShipperModalComponent,
                size: ConstantStringEnum.SMALL,
            });
        } else {
            this.selectedPickupShipper = event;

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
                            {
                                value: this.selectedPickupShipper.loadsCount,
                                logoName: null,
                                isCounter: true,
                            },
                        ],
                        customClass: ConstantStringEnum.LOAD_SHIPPER,
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
                    name: ConstantStringEnum.ADD_NEW,
                });

                if (this.labelsShipperContacts[1]?.contacts[0]) {
                    this.selectedPickupShipperContact =
                        this.labelsShipperContacts[1].contacts[0];

                    this.loadForm
                        .get(ConstantStringEnum.PICKUP_SHIPPER_CONTACT_ID)
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
                                ConstantStringEnum.LOAD_SHIPPER_CONTACT,
                        },
                        isDisabled: false,
                    };
                } else {
                    this.selectedPickupShipperContact = null;

                    this.labelsShipperContacts = [
                        {
                            id: 7655,
                            name: ConstantStringEnum.ADD_NEW,
                        },
                    ];

                    this.loadForm
                        .get(ConstantStringEnum.PICKUP_SHIPPER_CONTACT_ID)
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
                    .get(ConstantStringEnum.PICKUP_SHIPPER_CONTACT_ID)
                    .patchValue(null);

                this.loadPickupShipperContactsInputConfig = {
                    ...this.loadPickupShipperContactsInputConfig,
                    multipleInputValues: null,
                    isDisabled: true,
                };
            }
        }
    }

    private onSelectDropdownShipperDelivery(event): void {
        if (event?.canOpenModal) {
            this.ngbActiveModal.close();

            this.modalService.setProjectionModal({
                action: ConstantStringEnum.OPEN,
                payload: {
                    key: ConstantStringEnum.LOAD_MODAL,
                    value: this.loadModalData(),
                },
                type: ConstantStringEnum.NEW,
                component: ShipperModalComponent,
                size: ConstantStringEnum.SMALL,
            });
        } else {
            this.selectedDeliveryShipper = event;

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
                            {
                                value: this.selectedDeliveryShipper.loadsCount,
                                logoName: null,
                                isCounter: true,
                            },
                        ],
                        customClass: ConstantStringEnum.LOAD_SHIPPER,
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
                    name: ConstantStringEnum.ADD_NEW,
                });

                if (this.labelsShipperContacts[1]?.contacts[0]) {
                    this.selectedDeliveryShipperContact =
                        this.labelsShipperContacts[1].contacts[0];

                    this.loadForm
                        .get(ConstantStringEnum.DELIVERY_SHIPPER_CONTACT_ID)
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
                                ConstantStringEnum.LOAD_SHIPPER_CONTACT,
                        },
                        isDisabled: false,
                    };
                } else {
                    this.selectedDeliveryShipperContact = null;

                    this.labelsShipperContacts = [
                        {
                            id: 7655,
                            name: ConstantStringEnum.ADD_NEW,
                        },
                    ];

                    this.loadForm
                        .get(ConstantStringEnum.DELIVERY_SHIPPER_CONTACT_ID)
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
                    .get(ConstantStringEnum.DELIVERY_SHIPPER_CONTACT_ID)
                    .patchValue(null);

                this.loadDeliveryShipperContactsInputConfig = {
                    ...this.loadDeliveryShipperContactsInputConfig,
                    multipleInputValues: null,
                    isDisabled: true,
                };
            }
        }
    }

    private onSelectDropdownShipperExtraStops(event, index: number): void {
        if (event?.canOpenModal) {
            this.ngbActiveModal.close();

            this.modalService.setProjectionModal({
                action: ConstantStringEnum.OPEN,
                payload: {
                    key: ConstantStringEnum.LOAD_MODAL,
                    value: this.loadModalData(),
                },
                type: ConstantStringEnum.NEW,
                component: ShipperModalComponent,
                size: ConstantStringEnum.SMALL,
            });
        } else {
            this.selectedExtraStopShipper[index] = event;

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
                        customClass: ConstantStringEnum.LOAD_SHIPPER,
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
                    name: ConstantStringEnum.ADD_NEW,
                });

                if (this.labelsShipperContacts[1]?.contacts[0]) {
                    this.selectedExtraStopShipperContact[index] =
                        this.labelsShipperContacts[1].contacts[0];

                    this.loadExtraStops()
                        .at(index)
                        .get(ConstantStringEnum.SHIPPER_CONTACT_ID)
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
                                ConstantStringEnum.LOAD_SHIPPER_CONTACT,
                        },
                        isDisabled: false,
                    };
                } else {
                    this.labelsShipperContacts = [
                        { id: 7655, name: ConstantStringEnum.ADD_NEW },
                    ];

                    this.selectedExtraStopShipperContact[index] = null;

                    this.loadExtraStops()
                        .at(index)
                        .get(ConstantStringEnum.SHIPPER_CONTACT_ID)
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
                    .get(ConstantStringEnum.SHIPPER_CONTACT_ID)
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
            case ConstantStringEnum.ADD:
                this.documents = event.files;

                this.loadForm
                    .get(ConstantStringEnum.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case ConstantStringEnum.DELETE_2:
                this.documents = event.files;

                this.loadForm
                    .get(ConstantStringEnum.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                if (event.deleteId) this.filesForDelete.push(event.deleteId);

                break;
            case ConstantStringEnum.TAG:
                let changedTag = false;

                event.files.map((item) => {
                    if (item.tagChanged) {
                        changedTag = true;
                    }
                });

                this.loadForm
                    .get(ConstantStringEnum.TAGS)
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
        switch (action) {
            case ConstantStringEnum.FIRST_PICKUP:
                this.isActivePickupStop = event;

                this.isActiveDeliveryStop = false;

                this.loadExtraStops().controls.filter((item) => {
                    item.get(ConstantStringEnum.OPEN_CLOSE).patchValue(false);
                });

                break;
            case ConstantStringEnum.FIRST_DELIVERY:
                if (!this.selectedPickupShipper) return;

                this.isActiveDeliveryStop = event;

                this.isActivePickupStop = false;

                this.loadExtraStops().controls.filter((item) => {
                    item.get(ConstantStringEnum.OPEN_CLOSE).patchValue(false);
                });

                break;
            case ConstantStringEnum.EXTRA_STOPS:
                this.closeAllLoadExtraStopExceptActive(
                    this.loadExtraStops().at(indx)
                );

                break;
            default:
                break;
        }
    }

    public additionalBillings(): UntypedFormArray {
        return this.loadForm.get(
            ConstantStringEnum.ADDITIONAL_BILLINGS
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

    public addAdditionalBilling(event: AdditionalBilling): void {
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

            if (event.id !== 6) {
                this.additionalBillings().push(
                    this.createAdditionaBilling({
                        id: event.id,
                        name: event.name,
                        billingValue: event?.billingValue,
                    })
                );

                setTimeout(() => {
                    this.inputService.changeValidators(
                        this.additionalBillings().at(
                            this.additionalBillings().length - 1
                        )
                    );
                }, 150);
            }
        }

        this.isVisibleBillDropdown = false;

        this.loadForm.get(ConstantStringEnum.BILLING_DROPDOWN).patchValue(null);
    }

    public removeAdditionalBilling(type: string, index: number): void {
        if (type === ConstantStringEnum.ADJUSTED_2) {
            this.selectedAdditionalBillings[0].checked = false;

            this.additionalBillingTypes.unshift(
                this.selectedAdditionalBillings[0]
            );

            this.selectedAdditionalBillings.pop();

            this.inputService.changeValidators(
                this.loadForm.get(ConstantStringEnum.ADJUSTED_RATE),
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
                case ConstantStringEnum.LAYOVER:
                    this.loadModalBill.layover = 0;
                    break;

                case ConstantStringEnum.LUMPER:
                    this.loadModalBill.lumper = 0;
                    break;

                case ConstantStringEnum.FUEL_SURCHARGE:
                    this.loadModalBill.fuelSurcharge = 0;
                    break;

                case ConstantStringEnum.ESCORT:
                    this.loadModalBill.escort = 0;
                    break;

                case ConstantStringEnum.DETENTION:
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
                case ConstantStringEnum.BILLING:
                    this.isVisibleBillDropdown = true;

                    break;
                case ConstantStringEnum.PAYMENT:
                    this.isVisiblePayment = true;
                    this.inputService.changeValidators(
                        this.loadForm.get(ConstantStringEnum.ADVANCE_PAY)
                    );

                    break;
                default:
                    break;
            }
        }
    }

    public trackBillingPayment(): void {
        this.loadForm
            .get(ConstantStringEnum.BASE_RATE)
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
                        this.loadForm.get(ConstantStringEnum.ADJUSTED_RATE),
                        false
                    );
                    this.inputService.changeValidators(
                        this.loadForm.get(ConstantStringEnum.DRIVER_RATE),
                        false
                    );
                    this.inputService.changeValidators(
                        this.loadForm.get(ConstantStringEnum.ADVANCE_PAY),
                        false
                    );
                } else {
                    this.loadModalBill = {
                        ...this.loadModalBill,
                        baseRate: value,
                    };
                }
            });

        // adjusted rate
        this.loadForm
            .get(ConstantStringEnum.ADJUSTED_RATE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value &&
                    (!this.loadForm.get(ConstantStringEnum.BASE_RATE).value ||
                        convertThousanSepInNumber(value) >
                            convertThousanSepInNumber(
                                this.loadForm.get(ConstantStringEnum.BASE_RATE)
                                    .value
                            ))
                ) {
                    this.loadForm.get(ConstantStringEnum.ADJUSTED_RATE).reset();
                }
            });

        // driver rate
        this.loadForm
            .get(ConstantStringEnum.DRIVER_RATE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    if (
                        !this.loadForm.get(ConstantStringEnum.BASE_RATE)
                            .value ||
                        convertThousanSepInNumber(value) >
                            convertThousanSepInNumber(
                                this.loadForm.get(ConstantStringEnum.BASE_RATE)
                                    .value
                            )
                    ) {
                        this.loadForm
                            .get(ConstantStringEnum.DRIVER_RATE)
                            .reset();
                        this.loadForm
                            .get(ConstantStringEnum.DRIVER_RATE)
                            .setErrors({ invalid: true });
                    } else {
                        this.loadForm
                            .get(ConstantStringEnum.DRIVER_RATE)
                            .setErrors(null);
                    }
                }
            });

        // advance rate
        this.loadForm
            .get(ConstantStringEnum.ADVANCE_PAY)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.loadModalPayment = {
                        ...this.loadModalPayment,
                        advance: value,
                    };

                    if (
                        convertThousanSepInNumber(value) >
                        this.financialCalculationPipe.transform(
                            this.loadModalBill,
                            ConstantStringEnum.BILLING
                        )
                    ) {
                        this.loadForm
                            .get(ConstantStringEnum.ADVANCE_PAY)
                            .setErrors({ invalid: true });
                    } else {
                        this.loadForm
                            .get(ConstantStringEnum.ADVANCE_PAY)
                            .setErrors(null);
                    }
                } else {
                    this.loadModalPayment = {
                        ...this.loadModalPayment,
                        advance: 0,
                    };
                }
            });

        // additional billings
        this.additionalBillings()
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((arr) => {
                arr.forEach((value) => {
                    switch (value.name) {
                        case ConstantStringEnum.LAYOVER:
                            this.loadModalBill.layover = value.billingValue;

                            break;
                        case ConstantStringEnum.LUMPER:
                            this.loadModalBill.lumper = value.billingValue;

                            break;
                        case ConstantStringEnum.FUEL_SURCHARGE:
                            this.loadModalBill.fuelSurcharge =
                                value.billingValue;

                            break;
                        case ConstantStringEnum.ESCORT:
                            this.loadModalBill.escort = value.billingValue;

                            break;
                        case ConstantStringEnum.DETENTION:
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
            this.loadForm.get(ConstantStringEnum.ADVANCE_PAY),
            false
        );
    }

    private premmapedAdditionalBillingRate(action: string) {
        return this.originalAdditionalBillingTypes
            .map((item) => {
                const biilingRate = this.additionalBillings().controls.find(
                    (control) =>
                        control.get(ConstantStringEnum.NAME).value === item.name
                );

                return {
                    id: action === ConstantStringEnum.UPDATE ? item.id : null,
                    additionalBillingType: item.id,
                    rate: biilingRate
                        ? biilingRate.get(ConstantStringEnum.BILLING_VALUE)
                              .value
                        : null,
                };
            })
            .filter((item) => item.additionalBillingType !== 6);
    }

    public createNewExtraStop(): void {
        if (!this.selectedPickupShipper) return;

        // shipper config
        this.loadExtraStopsShipperInputConfig.push({
            id: `${this.loadExtraStops().length}-${
                ConstantStringEnum.EXTRA_STOP_SHIPPER
            }`,
            name: ConstantStringEnum.INPUT_DROPDOWN,
            type: ConstantStringEnum.TEXT,
            multipleLabel: {
                labels: [
                    ConstantStringEnum.SHIPPER,
                    ConstantStringEnum.CITY_STATE_ZIP,
                    ConstantStringEnum.LOADS,
                ],
                customClass: ConstantStringEnum.LOAD_SHIPPER,
            },
            isDropdown: true,
            isRequired: true,
            blackInput: true,
            textTransform: ConstantStringEnum.UPPERCASE,
            dropdownWidthClass: ConstantStringEnum.DROPDOWN_WIDTH_1,
        });

        // shipper contact config
        this.loadExtraStopsShipperContactsInputConfig.push({
            id: `${this.loadExtraStops().length}-${
                ConstantStringEnum.EXTRA_STOP_SHIPPER_CONTACT
            }`,
            name: ConstantStringEnum.INPUT_DROPDOWN,
            type: ConstantStringEnum.TEXT,
            multipleLabel: {
                labels: [ConstantStringEnum.CONTACT, ConstantStringEnum.PHONE],
                customClass: ConstantStringEnum.LOAD_SHIPPER_CONTACT,
            },
            isDropdown: true,
            isDisabled: true,
            blackInput: true,
            textTransform: ConstantStringEnum.CAPITALIZE,
            dropdownWidthClass: ConstantStringEnum.DROPDOWN_WIDTH_2,
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
            this.loadExtraStops().controls[this.loadExtraStops().length - 1]
        );

        const obj = this.numberOfLoadExtraStops();

        this.loadExtraStops()
            .at(this.loadExtraStops().length - 1)
            .get(ConstantStringEnum.STOP_ORDER)
            .patchValue(obj.numberOfPickups);

        if (this.loadExtraStops().length > 1) {
            this.typeOfExtraStops.push([
                {
                    id: 3000 + this.loadExtraStops().length,
                    name: ConstantStringEnum.PICKUP_2,
                    checked: true,
                    color: ConstantStringEnum.COLOR_1,
                },
                {
                    id: 4000 + this.loadExtraStops().length,
                    name: ConstantStringEnum.DELIVERY_2,
                    checked: false,
                    color: ConstantStringEnum.COLOR_2,
                },
            ]);

            this.stopTimeTabsExtraStops.push([
                {
                    id: 7900 + this.loadExtraStops().length,
                    name: ConstantStringEnum.WORK_HOURS,
                    checked: true,
                    color: ConstantStringEnum.COLOR_3,
                },
                {
                    id: 9000 + this.loadExtraStops().length,
                    name: ConstantStringEnum.APPOINTMENT,
                    checked: false,
                    color: ConstantStringEnum.COLOR_3,
                },
            ]);
        }
    }

    public newLoadExtraStop(): UntypedFormGroup {
        return this.formBuilder.group({
            id: [null],
            stopType: [ConstantStringEnum.PICKUP_2],
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
                item.get(ConstantStringEnum.STOP_TYPE).value ===
                ConstantStringEnum.PICKUP_2
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
            ConstantStringEnum.EXTRA_sTOPS_2
        ) as UntypedFormArray;
    }

    private calculateStopOrder(): void {
        let stopOrder = 1;

        for (let i = 0; i < this.loadExtraStops().length; i++) {
            const stopType = this.loadExtraStops()
                .at(i)
                .get(ConstantStringEnum.STOP_TYPE).value;

            if (stopType === ConstantStringEnum.PICKUP_2) {
                this.loadExtraStops()
                    .at(i)
                    .get(ConstantStringEnum.STOP_ORDER)
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
                this.loadExtraStops().at(i).get(ConstantStringEnum.STOP_TYPE)
                    .value === ConstantStringEnum.PICKUP_2
            ) {
                this.loadExtraStops()
                    .at(i)
                    .get(ConstantStringEnum.STOP_ORDER)
                    .patchValue(pickupOrder);

                pickupOrder++;
            } else {
                this.loadExtraStops()
                    .at(i)
                    .get(ConstantStringEnum.STOP_ORDER)
                    .patchValue(deliveryOrder);

                this.loadForm
                    .get(ConstantStringEnum.DELIVERY_STOP_ORDER)
                    .patchValue(deliveryOrder + 1);

                deliveryOrder++;
            }
        }

        if (
            !this.loadExtraStops().value.some(
                (extraStop) =>
                    extraStop.stopType === ConstantStringEnum.DELIVERY_2
            )
        )
            this.loadForm
                .get(ConstantStringEnum.DELIVERY_STOP_ORDER)
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
                    checked: type.name === ConstantStringEnum.PICKUP_2,
                };
            });

            this.stopTimeTabsExtraStops[0] = this.stopTimeTabsExtraStops[0].map(
                (tab) => {
                    return {
                        ...tab,
                        checked:
                            tab.name.toLowerCase() ===
                            ConstantStringEnum.WORK_HOURS_2,
                    };
                }
            );
        }

        this.drawStopOnMap();
    }

    public closeAllLoadExtraStopExceptActive(loadStop: AbstractControl): void {
        this.isActivePickupStop = false;
        this.isActiveDeliveryStop = false;

        if (this.loadExtraStops().length) {
            this.loadExtraStops().controls.map((item) => {
                if (
                    item.get(ConstantStringEnum.STOP_ORDER).value ===
                    loadStop.get(ConstantStringEnum.STOP_ORDER).value
                ) {
                    item.get(ConstantStringEnum.OPEN_CLOSE).patchValue(true);
                } else {
                    item.get(ConstantStringEnum.OPEN_CLOSE).patchValue(false);
                }
            });
        }
    }

    private premmapedStops(): LoadStopCommand[] {
        const stops: LoadStopCommand[] = [];

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
        } = this.loadForm.value;

        // pickup
        if (this.selectedPickupShipper) {
            stops.push({
                id: null,
                stopType: pickupStop,
                stopOrder: stops.length + 1,
                stopLoadOrder: pickupStopOrder,
                shipperId: this.selectedPickupShipper.id,
                shipperContactId: this.selectedPickupShipperContact?.id
                    ? this.selectedPickupShipperContact.id
                    : null,
                dateFrom: convertDateToBackend(pickupDateFrom),
                dateTo: pickupDateTo
                    ? convertDateToBackend(pickupDateTo)
                    : null,
                timeType:
                    this.stopTimeTabsPickup.find((item) => item.checked)
                        .name === ConstantStringEnum.APPOINTMENT
                        ? 2
                        : 1,
                timeFrom: pickupTimeFrom,
                timeTo: pickupTimeTo,
                arrive: null,
                depart: null,
                legMiles: pickuplegMiles,
                legHours: pickuplegHours,
                legMinutes: pickuplegMinutes,
                items: this.pickupStopItems,
            });
        }

        // extra Stops
        if (this.loadExtraStops().length) {
            this.loadExtraStops().controls.forEach((item, index) => {
                stops.push({
                    id: null,
                    stopType: item.get(ConstantStringEnum.STOP_TYPE).value,
                    stopOrder: stops.length + 1,
                    stopLoadOrder: item.get(ConstantStringEnum.STOP_ORDER)
                        .value,
                    shipperId: this.selectedExtraStopShipper[index].id,
                    dateFrom: convertDateToBackend(
                        item.get(ConstantStringEnum.DATE_FROM).value
                    ),
                    dateTo: item.get(ConstantStringEnum.DATE_TO).value
                        ? convertDateToBackend(
                              item.get(ConstantStringEnum.DATE_TO).value
                          )
                        : null,
                    timeType:
                        this.stopTimeTabsPickup.find((item) => item.checked)
                            .name === ConstantStringEnum.APPOINTMENT
                            ? 2
                            : 1,
                    timeFrom: item.get(ConstantStringEnum.TIME_FROM).value,
                    timeTo: item.get(ConstantStringEnum.TIME_TO).value,
                    arrive: null,
                    depart: null,
                    legMiles: item.get(ConstantStringEnum.LEG_MILES).value,
                    legHours: item.get(ConstantStringEnum.LEG_HOURS).value,
                    legMinutes: item.get(ConstantStringEnum.LEG_MINUTES).value,
                    items: this.extraStopItems[index],
                });
            });
        }

        // delivery
        if (this.selectedDeliveryShipper) {
            stops.push({
                id: null,
                stopType: deliveryStop,
                stopOrder: stops.length + 1,
                stopLoadOrder: deliveryStopOrder,
                shipperId: this.selectedDeliveryShipper.id,
                shipperContactId: this.selectedDeliveryShipperContact?.id
                    ? this.selectedDeliveryShipperContact.id
                    : null,
                dateFrom: convertDateToBackend(deliveryDateFrom),
                dateTo: deliveryDateTo
                    ? convertDateToBackend(deliveryDateTo)
                    : null,
                timeType:
                    this.stopTimeTabsDelivery.find((item) => item.checked)
                        .name === ConstantStringEnum.APPOINTMENT
                        ? 2
                        : 1,
                timeFrom: deliveryTimeFrom,
                timeTo: deliveryTimeTo,
                arrive: null,
                depart: null,
                legMiles: deliverylegMiles,
                legHours: deliverylegHours,
                legMinutes: deliverylegMinutes,
                items: this.deliveryStopItems,
            });
        }

        return stops;
    }

    public drawStopOnMap(): void {
        const routes: StopRoutes[] = [];

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
                        .startsWith(ConstantStringEnum.NUMBER_3),
                    delivery: this.selectExtraStopType[index]
                        .toString()
                        .startsWith(ConstantStringEnum.NUMBER_4),
                    stopNumber: item.get(ConstantStringEnum.STOP_ORDER).value,
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

        if (routes.length > 1) {
            this.loadService
                .getRouting(
                    JSON.stringify(
                        routes.map((item) => {
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
                        // TODO: Populate lat and long with routesPoints

                        // render on map routes
                        this.loadStopRoutes[0] = {
                            routeColor: ConstantStringEnum.COLOR_4,
                            stops: routes.map((route, index) => {
                                return {
                                    lat: route.latitude,
                                    long: route.longitude,
                                    stopColor: route.pickup
                                        ? ConstantStringEnum.COLOR_5
                                        : route.delivery
                                        ? ConstantStringEnum.COLOR_6
                                        : ConstantStringEnum.COLOR_4,
                                    stopNumber: route.stopNumber.toString(),
                                    empty:
                                        this.selectedDispatches
                                            ?.currentLocationCoordinates &&
                                        index === 1,
                                    zIndex: 99 + index,
                                };
                            }),
                        };

                        // store in form values
                        if (res?.legs?.length) {
                            res.legs.forEach((item, index) => {
                                // pickup
                                if (index === 0) {
                                    this.loadForm
                                        .get(ConstantStringEnum.LOAD_MILES)
                                        .patchValue(
                                            res?.totalMiles - item.miles
                                        );

                                    if (this.selectedDispatches) {
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.PICKUP_LEG_MILES
                                            )
                                            .patchValue(item.miles);
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.PICKUP_LEG_HOURS
                                            )
                                            .patchValue(item.hours);
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.PICKUP_LEG_MINUTES
                                            )
                                            .patchValue(item.minutes);
                                    }

                                    this.loadForm
                                        .get(ConstantStringEnum.PICKUP_LEG_COST)
                                        .patchValue(item.cost);
                                }
                                // extra stops
                                if (
                                    index > 0 &&
                                    this.loadExtraStops().length === index
                                ) {
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(ConstantStringEnum.LEG_MILES)
                                        .patchValue(item.miles);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(ConstantStringEnum.LEG_HOURS)
                                        .patchValue(item.hours);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(ConstantStringEnum.LEG_MINUTES)
                                        .patchValue(item.minutes);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get(ConstantStringEnum.LEG_COST)
                                        .patchValue(item.cost);
                                }
                                // delivery
                                else {
                                    if (res?.legs?.length === 1) {
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.DELIVERY_LEG_MILES
                                            )
                                            .patchValue(res?.legs[0].miles);
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.DELIVERY_LEG_HOURS
                                            )
                                            .patchValue(res?.legs[0].hours);
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.DELIVERY_LEG_MINUTES
                                            )
                                            .patchValue(res?.legs[0].minutes);
                                    } else {
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.DELIVERY_LEG_MILES
                                            )
                                            .patchValue(res?.legs[index].miles);
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.DELIVERY_LEG_HOURS
                                            )
                                            .patchValue(res?.legs[index].hours);
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.DELIVERY_LEG_MINUTES
                                            )
                                            .patchValue(
                                                res?.legs[index].minutes
                                            );
                                        this.loadForm
                                            .get(
                                                ConstantStringEnum.DELIVERY_LEG_COST
                                            )
                                            .patchValue(res?.legs[index].cost);
                                    }
                                }
                            });

                            this.loadForm
                                .get(ConstantStringEnum.TOTAL_MILES)
                                .patchValue(res?.totalMiles);

                            this.totalLegMiles = res.totalMiles;
                            this.totalLegHours = res.totalHours;
                            this.totalLegMinutes = res.totalMinutes;
                            this.totalLegCost = res.totalCost;
                        }
                    },
                    error: () => {},
                });
        }
    }

    public createNewStopItemsRow(type: string, extraStopId?: number): void {
        switch (type) {
            case ConstantStringEnum.PICKUP:
                this.isCreatedNewStopItemsRow.pickup = true;

                setTimeout(() => {
                    this.isCreatedNewStopItemsRow.pickup = false;
                }, 400);

                break;
            case ConstantStringEnum.DELIVERY:
                this.isCreatedNewStopItemsRow.delivery = true;

                setTimeout(() => {
                    this.isCreatedNewStopItemsRow.delivery = false;
                }, 400);

                break;
            case ConstantStringEnum.EXTRA_STOP:
                this.isCreatedNewStopItemsRow.extraStops[extraStopId] = true;

                setTimeout(() => {
                    this.isCreatedNewStopItemsRow.extraStops[extraStopId] =
                        false;
                }, 400);

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
            case ConstantStringEnum.PICKUP:
                this.pickupStopItems = stopItemsDataValue;

                break;
            case ConstantStringEnum.DELIVERY:
                this.deliveryStopItems = stopItemsDataValue;

                break;
            case ConstantStringEnum.EXTRA_STOP:
                this.extraStopItems[extraStopIndex] = stopItemsDataValue;

                break;
            default:
                break;
        }
    }

    public handleStopItemsValidStatusEmit(validStatus: boolean): void {
        this.isEachStopItemsRowValid = validStatus;
    }

    public additionalPartVisibility(event: {
        action: string;
        isOpen: boolean;
    }): void {
        this.loadModalSize = event.isOpen
            ? ConstantStringEnum.MODAL_CONTAINER_LOAD
            : ConstantStringEnum.MODAL_SIZE;

        switch (event.action) {
            case ConstantStringEnum.HAZARDOUS:
                this.isHazardousVisible = event.isOpen;

                break;
            case ConstantStringEnum.MAP:
                this.isHazardousVisible = false;

                break;
            default:
                break;
        }
    }

    public createComment(): void {
        if (this.comments.some((comment) => comment.isCommenting)) return;

        const newComment: CommentCompanyUser = {
            commentId: 0,
            companyUser: {
                id: this.companyUser.userId,
                name: `${this.companyUser.firstName} ${this.companyUser.lastName}`,
                avatar: this.companyUser.avatar,
            },
            commentContent: null,
            commentDate: null,
            isCommenting: true,
        };

        this.isCommenting = true;
        this.isCommented = true;

        this.comments = [...this.comments, newComment];
    }

    public handleCommentActionEmit(commentData: CommentData): void {
        switch (commentData.btnType) {
            case ConstantStringEnum.CANCEL:
                if (!commentData.isEditCancel) {
                    this.comments.splice(commentData.commentIndex, 1);

                    this.isCommented = false;
                }

                this.isCommenting = false;

                break;
            case ConstantStringEnum.CONFIRM:
                this.comments[commentData.commentIndex] = {
                    ...this.comments[commentData.commentIndex],
                    commentContent: commentData.commentContent,
                    commentDate: `${commentData.commentDate}, ${commentData.commentTime}`,
                    isCommenting: false,
                };

                this.editedCommentId = commentData.commentId;

                commentData.isEditConfirm && (this.isCommentEdited = true);

                this.isCommenting = false;

                break;
            case ConstantStringEnum.DELETE:
                this.comments.splice(commentData.commentIndex, 1);

                this.deletedCommentId = commentData.commentId;

                this.isCommented = false;
                this.isCommenting = false;

                break;
            default:
                break;
        }
    }

    public getDriverMessageOrNote(text: string, type: string): void {
        if (type === ConstantStringEnum.DRIVER_MESSAGE)
            this.loadForm
                .get(ConstantStringEnum.DRIVER_MESSAGE)
                .patchValue(text);

        if (type === ConstantStringEnum.NOTE)
            this.loadForm.get(ConstantStringEnum.NOTE).patchValue(text);
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

        setTimeout(() => {
            this.modalService.openModal(LoadModalComponent, {
                size: ConstantStringEnum.LOAD,
            });
        }, 200);
    }

    public handleOpenCloseDocumentsCard(openClose: boolean): void {
        this.isDocumentsCardOpen = openClose;
    }

    private loadModalData() {
        const { ...form } = this.loadForm.value;

        return {
            type: this.tabs.find((tab) => tab.id === this.selectedTab)
                .name as LoadType,
            loadNumber: this.loadNumber,
            loadTemplateId: this.selectedTemplate,
            dispatcherId: this.selectedDispatcher,
            companyId:
                this.labelsCompanies.length === 1
                    ? this.labelsCompanies[0]
                    : this.selectedCompany,
            dispatchId: this.selectedDispatches,
            brokerId: this.selectedBroker,
            brokerContactId: this.selectedBrokerContact,
            referenceNumber: form.referenceNumber,
            generalCommodity: this.selectedGeneralCommodity,
            weight: form.weight,
            loadRequirements: {
                id: null,
                truckTypeId: this.selectedTruckReq,
                trailerTypeId: this.selectedTrailerReq,
                doorType: this.selectedDoorType,
                suspension: this.selectedSuspension,
                trailerLengthId: this.selectedTrailerLength,
                year: this.selectedYear,
                liftgate: form.liftgate,
                driverMessage: form.driverMessage,
            },
            // pickup shipper
            pickupShipper: this.selectedPickupShipper,
            pickupShipperContant: this.selectedPickupShipperContact,
            pickupDateFrom: form.pickupDateFrom,
            pickupDateTo: form.pickupDateTo,
            pickupTimeFrom: form.pickupTimeFrom,
            pickupTimeTo: form.pickupTimeTo,
            pickuplegMiles: form.pickuplegMiles,
            pickuplegHours: form.pickuplegHours,
            pickuplegMinutes: form.pickuplegMinutes,
            pickuplegCost: form.pickuplegCost,
            selectedStopTimePickup: this.selectedStopTimePickup,
            // delivery shipper
            deliveryShipper: this.selectedDeliveryShipper,
            deliveryShipperContact: this.selectedDeliveryShipperContact,
            deliveryDateFrom: form.deliveryDateFrom,
            deliveryDateTo: form.deliveryDateTo,
            deliveryTimeFrom: form.deliveryTimeFrom,
            deliveryTimeTo: form.deliveryTimeTo,
            deliverylegMiles: form.deliverylegMiles,
            deliverylegHours: form.deliverylegHours,
            deliverylegMinutes: form.deliverylegMinutes,
            deliverylegCost: form.deliverylegCost,
            selectedStopTimeDelivery: this.selectedStopTimeDelivery,
            // extra stop shipper
            extraStopShipper: this.selectedExtraStopShipper,
            extraStopShipperContact: this.selectedExtraStopShipperContact,
            selectedExtraStopTime: this.selectedExtraStopTime,
            extraStops: this.loadExtraStops().value,
            // billing
            baseRate: form.baseRate,
            driverRate: form.driverRate,
            adjustedRate: form.adjustedRate,
            advancePay: form.advancePay,
            additionalBillingTypes: this.additionalBillings().value,

            // note, files
            note: form.note,
            files: this.documents,

            // legs
            totalMiles: this.totalLegMiles,
            totalHours: this.totalLegHours,
            totalMinutes: this.totalLegMinutes,
        };
    }

    private getLoadDropdowns(): void {
        this.loadService
            .getLoadDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: LoadModalResponse) => {
                    this.loadNumber = res.loadNumber;
                    this.tags = res.tags;

                    // dispatcher
                    this.labelsDispatcher = res.dispatchers.map((item) => {
                        return {
                            ...item,
                            name: item?.fullName,
                            logoName: item?.avatar,
                        };
                    });

                    let initialDispatcher = this.labelsDispatcher.find(
                        (item) =>
                            item?.name ===
                            this.companyUser?.firstName?.concat(
                                ConstantStringEnum.EMPTY_SPACE_STRING,
                                this.companyUser?.lastName
                            )
                    );

                    // OVO TREBA PROVERITI, JA SAM USER KOJI JE POZVAN U OVU KOMPANIJU I JA SE NE NALAZIM UNUTAR DISPATCHER LISTE A OVDE SE TRAZI UNUTAR DISPATCHER LISTE KO JE COMPANY OWNER PA PUCA
                    if (!initialDispatcher)
                        initialDispatcher = this.labelsDispatcher[0];

                    this.loadForm
                        .get(ConstantStringEnum.DISPATCHER_ID)
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
                                        ConstantStringEnum.EMPTY_SPACE_STRING,
                                        item.driver?.lastName
                                    ),
                                    logoName: item.driver?.avatar,
                                    owner: !!item.driver?.owner,
                                },
                                coDriver: {
                                    ...item.coDriver,
                                    name: item.coDriver?.firstName?.concat(
                                        ConstantStringEnum.EMPTY_SPACE_STRING,
                                        item.coDriver?.lastName
                                    ),
                                    logoName: item.coDriver?.avatar,
                                },
                                truck: {
                                    ...item.truck,
                                    name: item.truck?.truckNumber,
                                    logoType: item.truck?.truckType?.name,
                                    logoName: item.truck?.truckType?.logoName,
                                    folder: ConstantStringEnum.COMMON,
                                    subFolder: ConstantStringEnum.TRUCKS,
                                },
                                trailer: {
                                    ...item.trailer,
                                    name: item.trailer?.trailerNumber,
                                    logoType: item.trailer?.trailerType?.name,
                                    logoName:
                                        item.trailer?.trailerType?.logoName,
                                    folder: ConstantStringEnum.COMMON,
                                    subFolder: ConstantStringEnum.TRAILERS,
                                },
                                itemIndex: index,
                                fullName: item.truck?.truckNumber
                                    .concat(
                                        ConstantStringEnum.EMPTY_SPACE_STRING,
                                        item.trailer?.trailerNumber
                                    )
                                    .concat(
                                        ConstantStringEnum.EMPTY_SPACE_STRING,
                                        item.driver?.firstName.concat(
                                            ConstantStringEnum.EMPTY_SPACE_STRING,
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
                            status: item.availableCreditType?.name,
                            logoName:
                                item?.dnu || item?.ban
                                    ? ConstantStringEnum.BROKER_OPEN_SVG
                                    : item?.status === 0
                                    ? ConstantStringEnum.BROKER_CLOSED_SVG
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
                                            ConstantStringEnum.EMPTY_SPACE_STRING,
                                            item?.extensionPhone
                                                ? `x${item.extensionPhone}`
                                                : ConstantStringEnum.EMPTY_STRING
                                        ),
                                        originalPhone: item.phone,
                                        phoneExtension: item.extensionPhone,
                                        fullName: item?.contactName.concat(
                                            ConstantStringEnum.EMPTY_SPACE_STRING,
                                            item?.phone?.concat(
                                                ConstantStringEnum.EMPTY_SPACE_STRING,
                                                item?.extensionPhone
                                                    ? `x${item.extensionPhone}`
                                                    : ConstantStringEnum.EMPTY_STRING
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
                                ConstantStringEnum.HAZARDOUS
                            ) {
                                return {
                                    ...item,
                                    logoName: ConstantStringEnum.HAZARDOUS_SVG,
                                    folder: ConstantStringEnum.COMMON,
                                    subFolder: ConstantStringEnum.LOAD,
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
                            folder: ConstantStringEnum.COMMON,
                            subFolder: ConstantStringEnum.TRAILERS,
                        };
                    });

                    // truck req
                    this.labelsTruckReq = res.truckTypes.map((item) => {
                        return {
                            ...item,
                            folder: ConstantStringEnum.COMMON,
                            subFolder: ConstantStringEnum.TRUCKS,
                        };
                    });

                    // years
                    this.labelsYear = res.years.map((item, index) => {
                        return {
                            id: index + 1,
                            name: item.toString(),
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
                                    ConstantStringEnum.EMPTY_SPACE_STRING,
                                    item.address?.zipCode
                                ),
                            logoName:
                                item.status === 0
                                    ? ConstantStringEnum.BROKER_CLOSED_SVG
                                    : null,
                        };
                    });

                    // shipper contacts
                    this.labelsShipperContacts = this.originShipperContacts =
                        res.shipperContacts.map((item) => {
                            return {
                                ...item,
                                contacts: item.contacts.map((item) => {
                                    return {
                                        ...item,
                                        name: item?.contactName,
                                        phone: item?.phone?.concat(
                                            ConstantStringEnum.EMPTY_SPACE_STRING,
                                            item?.extensionPhone
                                                ? `x${item.extensionPhone}`
                                                : ConstantStringEnum.EMPTY_STRING
                                        ),
                                        originalPhone: item.phone,
                                        phoneExtension: item.extensionPhone,
                                        fullName: item?.contactName.concat(
                                            ConstantStringEnum.EMPTY_SPACE_STRING,
                                            item?.phone?.concat(
                                                ConstantStringEnum.EMPTY_SPACE_STRING,
                                                item?.extensionPhone
                                                    ? `x${item.extensionPhone}`
                                                    : ConstantStringEnum.EMPTY_STRING
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

                    if (this.editData)
                        this.populateLoadModalData(this.editData.data);
                },

                error: () => {},
            });
    }

    public createNewLoad(): void {
        const {
            referenceNumber,
            weight,
            liftgate,
            driverMessage,
            note,
            baseRate,
            adjustedRate,
            driverRate,
            advancePay,
            pickuplegMiles,
        } = this.loadForm.value;

        let documents: Blob[] = [];
        let tagsArray: Tags[] = [];

        this.documents?.map((item) => {
            if (item.tagId?.length)
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) documents.push(item.realFile);
        });

        if (!tagsArray.length) tagsArray = null;

        const newData: Load = {
            type: this.tabs.find((tab) => tab.id === this.selectedTab)
                .name as LoadType,
            loadNumber: this.loadNumber,
            loadTemplateId: this.selectedTemplate
                ? this.selectedTemplate.id
                : null,
            dispatcherId: this.selectedDispatcher
                ? this.selectedDispatcher.id
                : null,
            companyId:
                this.labelsCompanies.length === 1
                    ? this.labelsCompanies[0].id
                    : this.selectedCompany.id,
            dispatchId: this.selectedDispatches
                ? this.selectedDispatches.id
                : null,
            dateCreated: moment(new Date()).toISOString(true),
            brokerId: this.selectedBroker.id,
            brokerContactId: this.selectedBrokerContact
                ? this.selectedBrokerContact.id
                : null,
            referenceNumber: referenceNumber,
            generalCommodity: this.selectedGeneralCommodity
                ? this.selectedGeneralCommodity.id
                : null,
            weight: convertThousanSepInNumber(weight),
            loadRequirements: {
                id: null,
                truckTypeId: this.selectedTruckReq
                    ? this.selectedTruckReq.id
                    : null,
                trailerTypeId: this.selectedTrailerReq
                    ? this.selectedTrailerReq.id
                    : null,
                doorType: this.selectedDoorType
                    ? this.selectedDoorType.id
                    : null,
                suspension: this.selectedSuspension
                    ? this.selectedSuspension.id
                    : null,
                trailerLengthId: this.selectedTrailerLength
                    ? this.selectedTrailerLength.id
                    : null,
                year: this.selectedYear ? this.selectedYear.name : null,
                liftgate: liftgate,
                driverMessage: driverMessage,
            },
            stops: this.premmapedStops(),
            baseRate: convertThousanSepInNumber(baseRate),
            adjustedRate: adjustedRate
                ? convertThousanSepInNumber(adjustedRate)
                : null,
            driverRate: driverRate
                ? convertThousanSepInNumber(driverRate)
                : null,
            advancePay: convertThousanSepInNumber(advancePay),
            additionalBillingRates: this.premmapedAdditionalBillingRate(
                ConstantStringEnum.CREATE
            ),
            files: documents,
            tags: tagsArray,
            note: note,
            emptyMiles: pickuplegMiles,
            totalMiles: this.totalLegMiles,
            totalHours: this.totalLegHours,
            totalMinutes: this.totalLegMinutes,
        };

        this.loadService
            .createLoad(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private updateLoad(): void {
        const { id, dateCreated, status, loadRequirements } =
            this.editData.data;

        const {
            referenceNumber,
            weight,
            liftgate,
            driverMessage,
            note,
            baseRate,
            adjustedRate,
            driverRate,
            advancePay,
            pickuplegMiles,
        } = this.loadForm.value;

        let documents: Blob[] = [];
        let tagsArray: Tags[] = [];

        this.documents.map((item) => {
            if (item.tagId?.length)
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) documents.push(item.realFile);
        });

        if (!tagsArray.length) tagsArray = null;

        const newData: Load = {
            id,
            dispatcherId: this.selectedDispatcher
                ? this.selectedDispatcher.id
                : null,
            dateCreated,
            status: status.name as LoadStatus,
            dispatchId: this.selectedDispatches
                ? this.selectedDispatches.id
                : null,
            brokerId: this.selectedBroker.id,
            brokerContactId: this.selectedBrokerContact
                ? this.selectedBrokerContact.id
                : null,
            referenceNumber: referenceNumber,
            generalCommodity: this.selectedGeneralCommodity
                ? this.selectedGeneralCommodity.id
                : null,
            weight: convertThousanSepInNumber(weight),
            loadRequirements: {
                id: loadRequirements?.id,
                truckTypeId: this.selectedTruckReq
                    ? this.selectedTruckReq.id
                    : null,
                trailerTypeId: this.selectedTrailerReq
                    ? this.selectedTrailerReq.id
                    : null,
                doorType: this.selectedDoorType
                    ? this.selectedDoorType.id
                    : null,
                suspension: this.selectedSuspension
                    ? this.selectedSuspension.id
                    : null,
                trailerLengthId: this.selectedTrailerLength
                    ? this.selectedTrailerLength.id
                    : null,
                year: this.selectedYear ? this.selectedYear.name : null,
                liftgate: liftgate,
                driverMessage: driverMessage,
            },
            stops: this.premmapedStops(),
            baseRate: convertThousanSepInNumber(baseRate),
            adjustedRate: adjustedRate
                ? convertThousanSepInNumber(adjustedRate)
                : null,
            driverRate: driverRate
                ? convertThousanSepInNumber(driverRate)
                : null,
            additionalBillingRates: this.premmapedAdditionalBillingRate(
                ConstantStringEnum.CREATE
            ),
            comment: {
                id: this.deletedCommentId
                    ? null
                    : this.editedCommentId ??
                      this.comments[this.comments.length - 1]?.commentId,
                commentContent: this.deletedCommentId
                    ? null
                    : this.editedCommentId
                    ? this.comments.find(
                          (comment) =>
                              comment.commentId === this.editedCommentId
                      ).commentContent
                    : this.comments[this.comments.length - 1]?.commentContent,
            },
            deleteComment: {
                id: this.deletedCommentId,
            },
            files: documents,
            tags: tagsArray,
            filesForDeleteIds: this.filesForDelete,
            note: note,
            totalMiles: this.totalLegMiles,
            totalHours: this.totalLegHours,
            totalMinutes: this.totalLegMinutes,
        };

        this.loadService
            .updateLoad(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private saveLoadTemplate(): void {
        const {
            templateName,
            referenceNumber,
            weight,
            liftgate,
            driverMessage,
            baseRate,
            adjustedRate,
            driverRate,
            advancePay,
            note,
        } = this.loadForm.value;

        const newData: CreateLoadTemplateCommand = {
            name: templateName,
            type: this.tabs.find((tab) => tab.id === this.selectedTab)
                .name as LoadType,
            dispatcherId: this.selectedDispatcher
                ? this.selectedDispatcher.id
                : null,
            companyId:
                this.labelsCompanies.length === 1
                    ? this.labelsCompanies[0].id
                    : this.selectedCompany.id,
            dispatchId: this.selectedDispatches
                ? this.selectedDispatches.id
                : null,
            dateCreated: moment(new Date()).toISOString(true),
            brokerId: this.selectedBroker.id,
            brokerContactId: this.selectedBrokerContact
                ? this.selectedBrokerContact.id
                : null,
            referenceNumber: referenceNumber,
            generalCommodity: this.selectedGeneralCommodity
                ? this.selectedGeneralCommodity.id
                : null,
            weight: convertThousanSepInNumber(weight),
            loadRequirements: {
                id: null,
                truckTypeId: this.selectedTruckReq
                    ? this.selectedTruckReq.id
                    : null,
                trailerTypeId: this.selectedTrailerReq
                    ? this.selectedTrailerReq.id
                    : null,
                doorType: this.selectedDoorType
                    ? this.selectedDoorType.id
                    : null,
                suspension: this.selectedSuspension
                    ? this.selectedSuspension.id
                    : null,
                trailerLengthId: this.selectedTrailerLength
                    ? this.selectedTrailerLength.id
                    : null,
                year: this.selectedYear ? this.selectedYear.name : null,
                liftgate: liftgate,
                driverMessage: driverMessage,
            },
            stops: this.premmapedStops(),
            baseRate: convertThousanSepInNumber(baseRate),
            adjustedRate: adjustedRate
                ? convertThousanSepInNumber(adjustedRate)
                : null,
            driverRate: driverRate
                ? convertThousanSepInNumber(driverRate)
                : null,

            advancePay: convertThousanSepInNumber(advancePay),
            additionalBillingRates: this.premmapedAdditionalBillingRate(
                ConstantStringEnum.CREATE
            ),
            note: note,
            totalMiles: this.totalLegMiles,
            totalHours: this.totalLegHours,
            totalMinutes: this.totalLegMinutes,
        };

        this.loadService
            .createLoadTemplate(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: ConstantStringEnum.LOAD_TEMPLATE,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: ConstantStringEnum.LOAD_TEMPLATE,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private populateLoadModalData(loadModalData: LoadResponse): void {
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
            loadRequirements,
            note,
            files,
            stops,
            loadedMiles,
            totalMiles,
            totalTimeHours,
            comments,
        } = loadModalData;

        const pickupStop = stops[0];
        const deliveryStop = stops[stops.length - 1];

        const editedBroker = {
            ...broker,
            name: broker.businessName,
        };

        const editedDispatcher = {
            ...dispatcher,
            name: dispatcher.fullName,
        };

        const editedTruck = this.originLabelsDispatches.find(
            (dispatches) => dispatches.id === dispatch?.id
        );

        const editedPickupShipper = {
            ...stops[0].shipper,
            address: `${pickupStop.shipper.address.city}, ${pickupStop.shipper.address.stateShortName} ${pickupStop.shipper.address.zipCode}`,
            name: pickupStop.shipper.businessName,
        };

        const editedDeliveryShipper = {
            ...deliveryStop.shipper,
            address: `${deliveryStop.shipper.address.city}, ${deliveryStop.shipper.address.stateShortName} ${deliveryStop.shipper.address.zipCode}`,
            name: deliveryStop.shipper.businessName,
        };

        const editedStops = stops.filter(
            (_, index) => index !== 0 && index !== stops.length - 1
        );

        // form
        this.loadForm.patchValue({
            referenceNumber: referenceNumber,
            weight: weight,
            liftgate: loadRequirements?.liftgate,
            driverMessage: loadRequirements?.driverMessage,
            note: note,

            // pickup
            pickupDateFrom: convertDateFromBackend(pickupStop.dateFrom),
            pickupDateTo: pickupStop.dateTo
                ? convertDateFromBackend(pickupStop.dateTo)
                : pickupStop.dateTo,
            pickupTimeFrom: pickupStop.timeFrom,
            pickupTimeTo: pickupStop.timeTo,
            pickuplegMiles: pickupStop.legMiles,
            pickuplegHours: pickupStop.legHours,
            pickuplegMinutes: pickupStop.legMinutes,

            // delivery
            deliveryDateFrom: convertDateFromBackend(deliveryStop.dateFrom),
            deliveryDateTo: deliveryStop.dateTo
                ? convertDateFromBackend(deliveryStop.dateTo)
                : deliveryStop.dateTo,
            deliveryTimeFrom: deliveryStop.timeFrom,
            deliveryTimeTo: deliveryStop.timeTo,
            deliverylegMiles: deliveryStop.legMiles,
            deliverylegHours: deliveryStop.legHours,
            deliverylegMinutes: deliveryStop.legMinutes,
            deliveryStopOrder: deliveryStop.stopLoadOrder,

            // billing & payment
            /*   baseRate: baseRate,
            driverRate: driverRate,
            adjustedRate: adjustedRate,
            advancePay: advancePay, */

            // total
            loadMiles: loadedMiles,
            totalMiles: totalMiles,
            totalHours: totalTimeHours,
        });

        // load number
        this.loadNumber = loadNumber ?? this.loadNumber;

        // documents
        this.documents = files;

        // comments
        this.comments = comments.map((comment) => {
            return {
                companyUser: {
                    id: comment.companyUser.id,
                    name: comment.companyUser.fullName,
                    avatar: comment.companyUser.avatar,
                },
                commentId: comment.id,
                commentContent: comment.commentContent,
                commentDate: convertDateFromBackendToDateAndTime(
                    comment.createdAt
                ),
                isCommenting: false,
                isEdited: comment.isEdited,
            };
        });

        // dropdowns
        this.onSelectDropdown(editedBroker, ConstantStringEnum.BROKER);
        this.onSelectDropdown(editedTruck, ConstantStringEnum.DISPATCHES);
        this.onSelectDropdown(
            editedPickupShipper,
            ConstantStringEnum.SHIPPER_PICKUP
        );
        this.onSelectDropdown(
            editedDeliveryShipper,
            ConstantStringEnum.SHIPPER_DELIVERY
        );

        // tabs
        this.onTabChange(type, ConstantStringEnum.FTL_LTL);
        this.onTabChange(
            pickupStop.timeType,
            ConstantStringEnum.STOP_TIME_PICKUP
        );
        this.onTabChange(
            deliveryStop.timeType,
            ConstantStringEnum.STOP_TIME_DELIVERY
        );

        // selected
        this.selectedCompany = company;
        this.selectedDispatcher = editedDispatcher;
        this.selectedGeneralCommodity = generalCommodity;
        this.selectedTruckReq = loadRequirements?.truckType;
        this.selectedTrailerReq = loadRequirements?.trailerType;
        this.selectedTrailerLength = loadRequirements?.trailerLength;
        this.selectedDoorType = loadRequirements?.doorType;
        this.selectedSuspension = loadRequirements?.suspension;
        this.selectedYear = this.labelsYear.find(
            (year) => year.name == loadRequirements?.year
        );

        this.pickupDateRange = pickupStop.dateTo ? true : false;
        this.deliveryDateRange = deliveryStop.dateTo ? true : false;

        this.isHazardousPicked =
            generalCommodity?.name.toLowerCase() ===
            ConstantStringEnum.HAZARDOUS;
        if (!this.isHazardousPicked) this.isHazardousVisible = false;

        // extra stops
        if (editedStops.length) {
            editedStops.forEach((extraStop, index) => {
                this.createNewExtraStop();

                const editedShipper = {
                    ...extraStop.shipper,
                    address: `${extraStop.shipper.address.city}, ${extraStop.shipper.address.stateShortName} ${extraStop.shipper.address.zipCode}`,
                    name: extraStop.shipper.businessName,
                };

                this.loadExtraStops()
                    .at(index)
                    .patchValue({
                        id: extraStop.id,
                        stopType: extraStop.stopType.name,
                        stopOrder: extraStop.stopLoadOrder,
                        stopLoadOrder: extraStop.stopLoadOrder,
                        shipperId: extraStop.shipper.id,
                        shipperContactId: extraStop.shipperContact?.id,
                        dateFrom: convertDateFromBackend(extraStop.dateFrom),
                        dateTo: extraStop.dateTo
                            ? convertDateFromBackend(extraStop.dateTo)
                            : extraStop.dateTo,
                        timeType: extraStop.timeType.name.toUpperCase(),
                        timeFrom: extraStop.timeFrom,
                        timeTo: extraStop.timeTo,
                        arrive: extraStop.arrive,
                        depart: extraStop.depart,
                        legMiles: extraStop.legMiles,
                        legHours: extraStop.legHours,
                        legMinutes: extraStop.legMinutes,
                        items: extraStop.items,
                        openClose: false,
                    });

                this.loadExtraStopsDateRange[index] = !!extraStop.dateTo;

                this.onSelectDropdown(
                    editedShipper,
                    ConstantStringEnum.SHIPPER_EXTRA_STOPS,
                    index
                );

                this.onTabChange(
                    extraStop.stopType,
                    ConstantStringEnum.STOP_TAB,
                    index
                );
                this.onTabChange(
                    extraStop.timeType,
                    ConstantStringEnum.EXTRA_STOPS_TIME,
                    index
                );
            });
        }

        /* 
        this.isVisiblePayment = !!advancePay;
        this.selectedTemplate = loadTemplateId;
            

        additionalBillingTypes.map((item) => {
            if (item.billingValue) {
                this.addAdditionalBilling(item);
            }
        }); 
        */
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
