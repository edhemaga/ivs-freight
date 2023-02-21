import {
    CreateCommentCommand,
    RoutingService,
    SignInResponse,
    UpdateCommentCommand,
} from 'appcoretruckassist';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    AbstractControl,
    UntypedFormControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';

import { FormService } from '../../../services/form/form.service';
import { LoadTService } from '../../load/state/load.service';
import { LoadModalResponse } from '../../../../../../appcoretruckassist';
import { CommentsService } from '../../../services/comments/comments.service';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import { ITaInput } from '../../shared/ta-input/ta-input.config';

import { debounceTime, Subject, takeUntil } from 'rxjs';
import { descriptionValidation } from '../../shared/ta-input/ta-input.regex-validations';
import {
    convertDateToBackend,
    convertThousanSepInNumber,
} from '../../../utils/methods.calculations';
import moment from 'moment';
import { CreateLoadTemplateCommand } from '../../../../../../appcoretruckassist/model/createLoadTemplateCommand';
import {
    IBilling,
    IPayment,
    LoadFinancialComponent,
} from './load-financial/load-financial.component';
import { MapRouteModel } from '../../shared/model/map-route';
import { BrokerModalComponent } from '../broker-modal/broker-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShipperModalComponent } from '../shipper-modal/shipper-modal.component';
import { FinancialCalculationPipe } from './load-financial/financialCalculation.pipe';
import { RoutingResponse } from '../../../../../../appcoretruckassist/model/routingResponse';
import { LoadStopItemAutocompleteDescriptionResponse } from '../../../../../../appcoretruckassist/model/loadStopItemAutocompleteDescriptionResponse';
import { ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { EditTagsService } from 'src/app/core/services/shared/editTags.service';
import { getLoadModalColumnDefinition } from 'src/assets/utils/settings/modal-columns-configuration/table-load-modal-columns';
import { CommonModule } from '@angular/common';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaCheckboxComponent } from '../../shared/ta-checkbox/ta-checkbox.component';
import { LoadStopComponent } from './load-stop/load-stop.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { LoadDatetimeRangePipe } from './pipes/load-datetime-range.pipe';
import { LoadTimeTypePipe } from './pipes/load-time-type.pipe';
import { MapsComponent } from '../../shared/maps/maps.component';

interface IStopRoutes {
    longitude: number;
    latitude: number;
    pickup?: boolean;
    delivery?: boolean;
    stopNumber?: number;
}
@Component({
    selector: 'app-load-modal',
    templateUrl: './load-modal.component.html',
    styleUrls: ['./load-modal.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
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

        // Pipe
        FinancialCalculationPipe,
        LoadDatetimeRangePipe,
        LoadTimeTypePipe,
    ],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateX(-500px)' }),
                animate(
                    3000,
                    style({ opacity: 1, transform: 'translateX(0px)' })
                ),
            ]),
        ]),
    ],
    providers: [ModalService, FormService, FinancialCalculationPipe],
})
export class LoadModalComponent implements OnInit, OnDestroy, DoCheck {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public loadForm: UntypedFormGroup;
    public isFormDirty: boolean;

    public loadModalSize: string = 'modal-container-M';

    public companyUser: SignInResponse = null;

    public selectedTab: number = 1;
    public tabs = [
        {
            id: 1,
            name: 'FTL',
            checked: true,
        },
        {
            id: 2,
            name: 'LTL',
            checked: false,
        },
    ];

    public selectExtraStopType: number[] = [];
    public typeOfExtraStops = [
        [
            {
                id: 3000,
                name: 'Pickup',
                checked: true,
                color: '26A690',
            },
            {
                id: 4000,
                name: 'Delivery',
                checked: false,
                color: 'EF5350',
            },
        ],
    ];

    public selectedStopTimePickup: number = 5;
    public stopTimeTabsPickup = [
        {
            id: 5,
            name: 'WORK HOURS',
            checked: true,
            color: '3074D3',
        },
        {
            id: 6,
            name: 'APPOINTMENT',
            checked: false,
            color: '3074D3',
        },
    ];

    public selectedStopTimeDelivery: number = 7;
    public stopTimeTabsDelivery = [
        {
            id: 7,
            name: 'WORK HOURS',
            checked: true,
            color: '3074D3',
        },
        {
            id: 8,
            name: 'APPOINTMENT',
            checked: false,
            color: '3074D3',
        },
    ];

    public stopTimeTabsExtraStops = [
        [
            {
                id: 7900,
                name: 'WORK HOURS',
                checked: true,
                color: '3074D3',
            },
            {
                id: 9000,
                name: 'APPOINTMENT',
                checked: false,
                color: '3074D3',
            },
        ],
    ];

    public loadNumber: string;

    public labelsTemplate: any[] = [];
    public labelsDispatcher: any[] = [];
    public labelsCompanies: any[] = [];
    public labelsDispatches: any[] = [];
    public originLabelsDispatches: any[] = [];
    public labelsGeneralCommodity: any[] = [];

    // Broker Labels
    public labelsBroker: any[] = [];
    public labelsBrokerContacts: any[] = [];
    public originBrokerContacts: any[] = [];

    // Shipper Labels
    public labelsShipperContacts: any[] = [];
    public originShipperContacts: any[] = [];

    // Requirements Labels
    public labelsTruckReq: any[] = [];
    public labelsTrailerReq: any[] = [];
    public labelsDoorType: any[] = [];
    public labelsSuspension: any[] = [];
    public labelsTrailerLength: any[] = [];
    public labelsYear: any[] = [];
    public labelsShippers: any[] = [];

    public selectedTemplate: any = null;
    public selectedDispatcher: any = null;
    public selectedCompany: any = null;
    public selectedDispatches: any = null;
    public selectedGeneralCommodity: any = null;

    // Broker
    public selectedBroker: any = null;
    public selectedBrokerContact: any = null;

    // Pickup Shipper
    public selectedPickupShipper: any = null;
    public selectedPickupShipperContact: any = null;

    // Delivery Shipper
    public selectedDeliveryShipper: any = null;
    public selectedDeliveryShipperContact: any = null;

    // Requirements
    public selectedTruckReq: any = null;
    public selectedTrailerReq: any = null;
    public selectedDoorType: any = null;
    public selectedSuspension: any = null;
    public selectedTrailerLength: any = null;
    public selectedYear: any = null;

    // Load Stop Items Details Labels
    public labelsloadDetailsUnits: any[] = [];
    public labelsLoadDetailsStackable: any[] = [];
    public labelsLoadDetailsTarps: any[] = [];
    public labelsLoadDetailsDriverAssis: any[] = [];
    public labelsLoadDetailsStrapChain: any[] = [];
    public labelsLoadDetailsHazardous: any[] = [];

    public selectedLoadDetailsUnits: any[] = [];
    public selectedLoadDetailsStackable: any[] = [];
    public selectedLoadDetailsTarps: any[] = [];
    public selectedLoadDetailsDriverAssis: any[] = [];
    public selectedLoadDetailsStrapChain: any[] = [];
    public selectedLoadDetailsHazardous: any[] = [];

    // Some Inputs Configurations
    public loadDispatchesTTDInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Truck', 'Trailer', 'Driver', 'Driver Pay'],
            customClass: 'load-dispatches-ttd',
        },
        isDropdown: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-616',
    };

    public loadBrokerInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Broker', 'Avail. Credit', 'Loads'],
            customClass: 'load-broker',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-432',
    };

    public loadBrokerContactsInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-broker-contact',
        },
        isDropdown: true,
        isDisabled: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-330',
    };

    public loadPickupShipperInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Shipper', 'City, State, Zip', 'Loads'],
            customClass: 'load-shipper',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: true,
        textTransform: 'uppercase',
        dropdownWidthClass: 'w-col-608',
    };

    public loadPickupShipperContactsInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-shipper-contact',
        },
        isDropdown: true,
        isDisabled: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-330',
    };

    public loadDeliveryShipperInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Shipper', 'City, State, Zip', 'Loads'],
            customClass: 'load-shipper',
        },
        isDropdown: true,
        isRequired: true,
        blackInput: true,
        textTransform: 'uppercase',
        dropdownWidthClass: 'w-col-608',
    };

    public loadDeliveryShipperContactsInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone'],
            customClass: 'load-shipper-contact',
        },
        isDropdown: true,
        isDisabled: true,
        blackInput: true,
        textTransform: 'capitalize',
        dropdownWidthClass: 'w-col-330',
    };

    // Extra Stop Configuration
    public selectedExtraStopShipper: any[] = [];
    public selectedExtraStopShipperContact: any[] = [];
    public loadExtraStopsShipperInputConfig: ITaInput[] = [];
    public loadExtraStopsShipperContactsInputConfig: ITaInput[] = [];
    public loadExtraStopsDateRange: any[] = [];
    public selectedExtraStopTime: any[] = [];

    // Billing
    public originalAdditionalBillingTypes: any[] = [];
    public additionalBillingTypes: any[] = [];
    public isAvailableAdjustedRate: boolean = false;
    public isAvailableAdvanceRate: boolean = false;

    // Documents
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];
    public tags: any[] = [];

    // Comments
    public comments: any[] = [];

    // Map Routes
    public loadStopRoutes: MapRouteModel[] = [];

    // Hazardous Dropdown
    public isHazardousPicked: boolean = false;
    public isHazardousVisible: boolean = false;

    // Pickup Stops
    public pickupDateRange: boolean = false;
    public isActivePickupStop: boolean = false;

    // Delivery Stops
    public deliveryDateRange: boolean = false;
    public isActiveDeliveryStop: boolean = false;

    // Billing part
    public loadModalBill: IBilling = {
        baseRate: 0,
        layover: 0,
        lumper: 0,
        fuelSurcharge: 0,
        escort: 0,
        detention: 0,
    };
    public selectedAdditionalBillings: any[] = [];
    public isVisibleBillDropdown: boolean = false;

    // Payment part
    public loadModalPayment: IPayment = {
        advance: 0,
        paidInFull: 0,
        shortPaid: [],
    };
    public isVisiblePayment: boolean = false;

    // Dummy variables for load total
    public totalLegMiles: number = null;
    public totalLegHours: number = null;
    public totalLegMinutes: number = null;
    public totalLegCost: number = null;

    public disableCardAnimation: boolean = false;

    public requirementsSectionOpened: boolean = false;

    // Modal Table
    tableModalOpen: string = '';

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private commentsService: CommentsService,
        private routingService: RoutingService,
        private loadService: LoadTService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        private financialCalculationPipe: FinancialCalculationPipe,
        private tagsService: EditTagsService,
        private cdRef: ChangeDetectorRef
    ) {}

    public originHeight: number;

    @ViewChild('originElement') originElement: ElementRef;

    ngOnInit() {
        this.companyUser = JSON.parse(localStorage.getItem('user'));
        this.createForm();
        this.getLoadDropdowns();

        this.trackBillingPayment();
    }

    ngDoCheck() {
        if (this.originElement) {
            this.originHeight =
                this.originElement.nativeElement.getBoundingClientRect().height;
            this.cdRef.detectChanges();
        }
    }

    private createForm() {
        this.loadForm = this.formBuilder.group({
            loadTemplateId: [null],
            dispatcherId: [null],
            companyId: [this.companyUser.companyName, Validators.required],
            dispatchId: [null],
            referenceNumber: [null, Validators.required],
            generalCommodity: [null],
            weight: [null],
            brokerId: [null, Validators.required],
            brokerContactId: [null],
            // Requirements
            truckTypeId: [null],
            trailerTypeId: [null],
            doorType: [null],
            suspension: [null],
            trailerLengthId: [null],
            year: [null],
            liftgate: [null],
            driverMessage: [null],
            // ----------------
            // Pickup Stop
            pickupStop: ['Pickup'],
            pickupStopOrder: [1],
            pickupShipper: [null, Validators.required],
            pickupShipperContactId: [null],
            pickupDateFrom: [null, Validators.required],
            pickupDateTo: [null],
            pickupTimeFrom: [null, Validators.required],
            pickupTimeTo: [null, Validators.required],
            pickupItems: this.formBuilder.array([]),
            pickuplegMiles: [null],
            pickuplegHours: [null],
            pickuplegMinutes: [null],
            pickuplegCost: [null],
            // -------------
            // Delivery Stop
            deliveryStop: ['Delivery'],
            deliveryStopOrder: [1],
            deliveryShipper: [null, Validators.required],
            deliveryShipperContactId: [null],
            deliveryDateFrom: [null, Validators.required],
            deliveryDateTo: [null],
            deliveryTimeFrom: [null, Validators.required],
            deliveryTimeTo: [null, Validators.required],
            deliveryItems: this.formBuilder.array([]),
            deliverylegMiles: [null],
            deliverylegHours: [null],
            deliverylegMinutes: [null],
            deliverylegCost: [null],
            // -------------
            // Extra Stops
            extraStops: this.formBuilder.array([]),
            // -------------
            // Billing
            baseRate: [null, Validators.required],
            adjustedRate: [null],
            driverRate: [null],
            advancePay: [null],
            additionalBillings: this.formBuilder.array([]),
            billingDropdown: [null],
            invoiced: [null],
            // -------------
            note: [null],
            files: [null],
            loadMiles: [0],
            totalMiles: [0],
            totalHours: [0],
            totalMinutes: [0],
            tags: [null],
        });

        this.formService.checkFormChange(this.loadForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onTabChange(event: any, action: string, indx?: number) {
        switch (action) {
            case 'ftl-ltl': {
                this.selectedTab = event.id;
                break;
            }
            case 'stop-tab': {
                this.selectExtraStopType[indx] = event.id;
                this.loadExtraStops()
                    .at(indx)
                    .get('stopType')
                    .patchValue(
                        event.id.toString().startsWith('4')
                            ? 'Delivery'
                            : 'Pickup'
                    );

                const obj = this.numberOfLoadExtraStops();

                if (event.id.toString().startsWith('4')) {
                    this.loadExtraStops()
                        .at(indx)
                        .get('stopOrder')
                        .patchValue(obj.numberOfDeliveries);
                    this.loadForm
                        .get('deliveryStopOrder')
                        .patchValue(obj.numberOfDeliveries + 1);
                } else {
                    this.loadExtraStops()
                        .at(indx)
                        .get('stopOrder')
                        .patchValue(obj.numberOfPickups);
                }

                if (this.selectedExtraStopShipper[indx]) {
                    this.drawStopOnMap();
                }
                break;
            }
            case 'stop-time-pickup': {
                this.selectedStopTimePickup = event.id;
                if (this.selectedStopTimePickup === 6) {
                    this.inputService.changeValidators(
                        this.loadForm.get('pickupTimeTo'),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.loadForm.get('pickupTimeTo')
                    );
                }
                break;
            }
            case 'stop-time-delivery': {
                this.selectedStopTimeDelivery = event.id;
                if (this.selectedStopTimeDelivery === 8) {
                    this.inputService.changeValidators(
                        this.loadForm.get('deliveryTimeTo'),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.loadForm.get('deliveryTimeTo')
                    );
                }
                break;
            }
            case 'extra-stops-time': {
                this.selectedExtraStopTime[indx] = event?.id ? event.id : event;
                if (this.selectedExtraStopTime.toString().startsWith('9')) {
                    this.inputService.changeValidators(
                        this.loadExtraStops().at(indx).get('timeTo'),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.loadExtraStops().at(indx).get('timeTo')
                    );
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.loadForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.loadForm);
                    return;
                }
                if (this.editData) {
                    this.updateLoad(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addLoad();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case 'load-template': {
                if (this.loadForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.loadForm);
                    return;
                }

                this.saveLoadTemplate();

                this.modalService.setModalSpinner({
                    action: 'load-template',
                    status: true,
                    close: false,
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSelectDropdown(event: any, action: string, index?: number) {
        switch (action) {
            case 'dispatcher': {
                this.selectedDispatcher = event;

                if (this.selectedDispatcher) {
                    this.labelsDispatches = this.originLabelsDispatches.filter(
                        (item) =>
                            item.dispatcherId === this.selectedDispatcher.id
                    );
                    this.selectedDispatches = null;
                    this.loadForm.get('dispatchId').patchValue(null);
                } else {
                    this.labelsDispatches = this.originLabelsDispatches;
                }
                break;
            }
            case 'company': {
                this.selectedCompany = event;
                break;
            }
            case 'general-commodity': {
                this.selectedGeneralCommodity = event;
                this.isHazardousPicked =
                    event?.name?.toLowerCase() === 'hazardous';

                if (!this.isHazardousPicked) {
                    this.isHazardousVisible = false;
                }
                break;
            }
            case 'dispatches': {
                if (event) {
                    this.selectedDispatches = {
                        ...event,
                        name: event?.truck?.name
                            ?.concat(' ', event?.trailer?.name)
                            .concat(' ', event?.driver?.name),
                    };

                    // Draw Stop on map
                    this.drawStopOnMap();

                    this.loadDispatchesTTDInputConfig = {
                        ...this.loadDispatchesTTDInputConfig,
                        multipleLabel: {
                            labels: [
                                'Truck',
                                'Trailer',
                                'Driver',
                                event?.payType ? 'Driver Pay' : null,
                            ],
                            customClass: 'load-dispatches-ttd',
                        },
                        multipleInputValues: {
                            options: [
                                {
                                    id: event?.truck?.id,
                                    value: event?.truck?.name,
                                    logoName: event?.truck?.logoName,
                                    isImg: false,
                                    isSvg: true,
                                    folder: 'common',
                                    subFolder: 'trucks',
                                    logoType: event?.truck?.logoType,
                                },
                                {
                                    value: event?.trailer?.name,
                                    logoName: event?.trailer?.logoName,
                                    isImg: false,
                                    isSvg: true,
                                    folder: 'common',
                                    subFolder: 'trailers',
                                    logoType: event?.trailer?.logoType,
                                },
                                {
                                    value: event?.driver?.name,
                                    logoName: event?.driver?.logoName
                                        ? event?.driver?.logoName
                                        : 'no-url',
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
                            customClass: 'load-dispatches-ttd',
                        },
                    };

                    if (this.selectedDispatches.payType === 'Flat Rate') {
                        this.inputService.changeValidators(
                            this.loadForm.get('driverRate')
                        );
                        this.inputService.changeValidators(
                            this.loadForm.get('adjustedRate'),
                            false
                        );

                        this.additionalBillingTypes =
                            this.additionalBillingTypes.filter(
                                (item) => item.id !== 6
                            );
                    } else {
                        this.inputService.changeValidators(
                            this.loadForm.get('driverRate'),
                            false
                        );

                        if (this.selectedDispatches.payType) {
                            if (
                                !this.additionalBillingTypes.find(
                                    (item) => item.id === 6
                                )
                            )
                                this.additionalBillingTypes.unshift({
                                    id: 6,
                                    name: 'Adjusted',
                                    checked: false,
                                });
                        }
                    }
                } else {
                    this.loadDispatchesTTDInputConfig = {
                        ...this.loadDispatchesTTDInputConfig,
                        multipleLabel: {
                            labels: [
                                'Truck',
                                'Trailer',
                                'Driver',
                                'Driver Pay',
                            ],
                            customClass: 'load-dispatches-ttd',
                        },
                        multipleInputValues: null,
                    };

                    this.selectedDispatches = null;

                    this.inputService.changeValidators(
                        this.loadForm.get('driverRate'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.loadForm.get('adjustedRate'),
                        false
                    );
                }

                break;
            }
            case 'broker': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'load-modal',
                            value: this.loadModalData(),
                        },
                        type: 'new',
                        component: BrokerModalComponent,
                        size: 'small',
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
                                        value: this.selectedBroker
                                            .availableCredit,
                                        second_value:
                                            this.selectedBroker.creditLimit,
                                        logoName: null,
                                        isProgressBar:
                                            this.selectedBroker
                                                .availableCreditType.name !==
                                            'Unlimited',
                                    },
                                    {
                                        value: this.selectedBroker.loadsCount,
                                        logoName: null,
                                        isCounter: true,
                                    },
                                ],
                                customClass: 'load-broker',
                            },
                        };

                        this.labelsBrokerContacts = this.originBrokerContacts
                            .map((el) => {
                                return {
                                    ...el,
                                    contacts: el?.contacts?.filter(
                                        (subEl) =>
                                            subEl.brokerId ===
                                            this.selectedBroker.id
                                    ),
                                };
                            })
                            .filter((item) => item.contacts?.length);

                        this.labelsBrokerContacts.unshift({
                            id: 7655,
                            name: 'ADD NEW',
                        });

                        if (this.labelsBrokerContacts[1]?.contacts[0]) {
                            this.selectedBrokerContact =
                                this.labelsBrokerContacts[1].contacts[0];

                            if (this.selectedBrokerContact) {
                                this.loadForm
                                    .get('brokerContactId')
                                    .patchValue(
                                        this.selectedBrokerContact.fullName
                                    );

                                this.loadBrokerContactsInputConfig = {
                                    ...this.loadBrokerContactsInputConfig,
                                    multipleInputValues: {
                                        options: [
                                            {
                                                value: this
                                                    .selectedBrokerContact.name,
                                                logoName: null,
                                            },
                                            {
                                                value: this
                                                    .selectedBrokerContact
                                                    .originalPhone,
                                                second_value: this
                                                    .selectedBrokerContact
                                                    .phoneExtension
                                                    ? `#${this.selectedBrokerContact.phoneExtension}`
                                                    : null,
                                                logoName: null,
                                            },
                                        ],
                                        customClass: 'load-broker-contact',
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
                                    name: 'ADD NEW',
                                },
                            ];
                            this.loadForm
                                .get('brokerContactId')
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

                        this.loadForm.get('brokerContactId').patchValue(null);

                        this.loadBrokerContactsInputConfig = {
                            ...this.loadBrokerContactsInputConfig,
                            multipleInputValues: null,
                            isDisabled: true,
                        };
                    }
                }

                break;
            }
            case 'broker-contact': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'load-modal',
                            value: this.loadModalData(),
                            id: this.selectedBroker.id,
                        },
                        type: 'edit-contact',
                        component: BrokerModalComponent,
                        size: 'small',
                    });
                } else {
                    if (event) {
                        this.selectedBrokerContact = {
                            ...event,
                            name: event?.name?.concat(' ', event?.phone),
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
                                customClass: 'load-broker-contact',
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
            }
            case 'shipper-pickup': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'load-modal',
                            value: this.loadModalData(),
                        },
                        type: 'new',
                        component: ShipperModalComponent,
                        size: 'small',
                    });
                } else {
                    this.selectedPickupShipper = event;

                    console.log(this.selectedPickupShipper);

                    // Draw Stop on map
                    this.drawStopOnMap();

                    if (this.selectedPickupShipper) {
                        this.loadPickupShipperInputConfig = {
                            ...this.loadPickupShipperInputConfig,
                            multipleInputValues: {
                                options: [
                                    {
                                        value: this.selectedPickupShipper
                                            .businessName,
                                        logoName: null,
                                    },
                                    {
                                        value: this.selectedPickupShipper
                                            .address,
                                        logoName: null,
                                    },
                                    {
                                        value: this.selectedPickupShipper
                                            .loadsCount,
                                        logoName: null,
                                        isCounter: true,
                                    },
                                ],
                                customClass: 'load-shipper',
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
                            name: 'ADD NEW',
                        });

                        if (this.labelsShipperContacts[1]?.contacts[0]) {
                            this.selectedPickupShipperContact =
                                this.labelsShipperContacts[1].contacts[0];

                            this.loadForm
                                .get('pickupShipperContactId')
                                .patchValue(
                                    this.selectedPickupShipperContact.fullName
                                );

                            this.loadPickupShipperContactsInputConfig = {
                                ...this.loadPickupShipperContactsInputConfig,
                                multipleInputValues: {
                                    options: [
                                        {
                                            value: this
                                                .selectedPickupShipperContact
                                                .name,
                                            logoName: null,
                                        },
                                        {
                                            value: this
                                                .selectedPickupShipperContact
                                                .originalPhone,
                                            second_value: this
                                                .selectedPickupShipperContact
                                                .phoneExtension
                                                ? `#${this.selectedPickupShipperContact.phoneExtension}`
                                                : null,
                                            logoName: null,
                                        },
                                    ],
                                    customClass: 'load-shipper-contact',
                                },
                                isDisabled: false,
                            };
                        } else {
                            this.selectedPickupShipperContact = null;
                            this.labelsShipperContacts = [
                                {
                                    id: 7655,
                                    name: 'ADD NEW',
                                },
                            ];
                            this.loadForm
                                .get('pickupShipperContactId')
                                .patchValue(null);

                            this.loadPickupShipperContactsInputConfig = {
                                ...this.loadPickupShipperContactsInputConfig,
                                multipleInputValues: null,
                                isDisabled: false,
                            };
                        }
                    }
                    // Restart value if clear
                    else {
                        this.labelsShipperContacts = this.originShipperContacts;

                        this.loadPickupShipperInputConfig = {
                            ...this.loadPickupShipperInputConfig,
                            multipleInputValues: null,
                        };

                        this.selectedPickupShipperContact = null;

                        this.loadForm
                            .get('pickupShipperContactId')
                            .patchValue(null);

                        this.loadPickupShipperContactsInputConfig = {
                            ...this.loadPickupShipperContactsInputConfig,
                            multipleInputValues: null,
                            isDisabled: true,
                        };
                    }
                }

                break;
            }
            case 'shipper-contact-pickup': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'load-modal',
                            value: this.loadModalData(),
                            id: this.selectedPickupShipper.id,
                        },
                        type: 'edit-contact',
                        component: ShipperModalComponent,
                        size: 'small',
                    });
                } else {
                    if (event) {
                        this.selectedPickupShipperContact = {
                            ...event,
                            name: event?.name?.concat(' ', event?.phone),
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
                                customClass: 'load-shipper-contact',
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
            }
            case 'shipper-delivery': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'load-modal',
                            value: this.loadModalData(),
                        },
                        type: 'new',
                        component: ShipperModalComponent,
                        size: 'small',
                    });
                } else {
                    this.selectedDeliveryShipper = event;

                    const existLoadStop =
                        this.selectedDeliveryShipper?.id ===
                        this.selectedPickupShipper?.id;

                    if (existLoadStop) {
                        setTimeout(() => {
                            this.loadForm
                                .get('deliveryShipper')
                                .patchValue(null);
                            this.selectedDeliveryShipper = null;
                            this.loadDeliveryShipperInputConfig = {
                                ...this.loadDeliveryShipperInputConfig,
                                multipleInputValues: null,
                            };
                            return;
                        }, 30);
                    }

                    // Draw Stop on map
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
                                        value: this.selectedDeliveryShipper
                                            .address,
                                        logoName: null,
                                    },
                                    {
                                        value: this.selectedDeliveryShipper
                                            .loadsCount,
                                        logoName: null,
                                        isCounter: true,
                                    },
                                ],
                                customClass: 'load-shipper',
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
                            name: 'ADD NEW',
                        });

                        if (this.labelsShipperContacts[1]?.contacts[0]) {
                            this.selectedDeliveryShipperContact =
                                this.labelsShipperContacts[1].contacts[0];

                            this.loadForm
                                .get('deliveryShipperContactId')
                                .patchValue(
                                    this.selectedDeliveryShipperContact.fullName
                                );

                            this.loadDeliveryShipperContactsInputConfig = {
                                ...this.loadDeliveryShipperContactsInputConfig,
                                multipleInputValues: {
                                    options: [
                                        {
                                            value: this
                                                .selectedDeliveryShipperContact
                                                .name,
                                            logoName: null,
                                        },
                                        {
                                            value: this
                                                .selectedDeliveryShipperContact
                                                .originalPhone,
                                            second_value: this
                                                .selectedDeliveryShipperContact
                                                .phoneExtension
                                                ? `#${this.selectedDeliveryShipperContact.phoneExtension}`
                                                : null,
                                            logoName: null,
                                        },
                                    ],
                                    customClass: 'load-shipper-contact',
                                },
                                isDisabled: false,
                            };
                        } else {
                            this.selectedDeliveryShipperContact = null;
                            this.labelsShipperContacts = [
                                {
                                    id: 7655,
                                    name: 'ADD NEW',
                                },
                            ];
                            this.loadForm
                                .get('deliveryShipperContactId')
                                .patchValue(null);

                            this.loadDeliveryShipperContactsInputConfig = {
                                ...this.loadDeliveryShipperContactsInputConfig,
                                multipleInputValues: null,
                                isDisabled: false,
                            };
                        }
                    }
                    // Restart value if clear
                    else {
                        this.labelsShipperContacts = this.originShipperContacts;

                        this.loadPickupShipperInputConfig = {
                            ...this.loadPickupShipperInputConfig,
                            multipleInputValues: null,
                        };

                        this.selectedDeliveryShipperContact = null;

                        this.loadForm
                            .get('deliveryShipperContactId')
                            .patchValue(null);

                        this.loadDeliveryShipperContactsInputConfig = {
                            ...this.loadDeliveryShipperContactsInputConfig,
                            multipleInputValues: null,
                            isDisabled: true,
                        };
                    }
                }

                break;
            }
            case 'shipper-contact-delivery': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'load-modal',
                            value: this.loadModalData(),
                            id: this.selectedDeliveryShipper.id,
                        },
                        type: 'edit-contact',
                        component: ShipperModalComponent,
                        size: 'small',
                    });
                } else {
                    if (event) {
                        this.selectedDeliveryShipperContact = {
                            ...event,
                            name: event?.name?.concat(' ', event?.phone),
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
                                customClass: 'load-shipper-contact',
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
            }
            case 'shipper-extra-stops': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'load-modal',
                            value: this.loadModalData(),
                        },
                        type: 'new',
                        component: ShipperModalComponent,
                        size: 'small',
                    });
                } else {
                    this.selectedExtraStopShipper[index] = event;

                    this.drawStopOnMap();

                    // 4. If Load Stop Exist (shipper), just return
                    const existLoadStop = this.selectedExtraStopShipper.find(
                        (item) => {
                            return (
                                item?.id === this.selectedPickupShipper?.id ||
                                item?.id === this.selectedDeliveryShipper?.id
                            );
                        }
                    );

                    if (existLoadStop) {
                        setTimeout(() => {
                            this.loadExtraStops()
                                .at(index)
                                .get('shipperId')
                                .patchValue(null);
                            this.selectedExtraStopShipper[index] = null;

                            this.loadExtraStopsShipperInputConfig[index] = {
                                ...this.loadExtraStopsShipperInputConfig[index],
                                multipleInputValues: null,
                            };
                            return;
                        }, 30);
                    }

                    // Select Extra Stop Shipper
                    if (this.selectedExtraStopShipper[index]) {
                        this.loadExtraStopsShipperInputConfig[index] = {
                            ...this.loadExtraStopsShipperInputConfig[index],
                            multipleInputValues: {
                                options: [
                                    {
                                        value: this.selectedExtraStopShipper[
                                            index
                                        ].businessName,
                                        logoName: null,
                                    },
                                    {
                                        value: this.selectedExtraStopShipper[
                                            index
                                        ].address,
                                        logoName: null,
                                    },
                                    {
                                        value: this.selectedExtraStopShipper[
                                            index
                                        ].loadsCount,
                                        logoName: null,
                                        isCounter: true,
                                    },
                                ],
                                customClass: 'load-shipper',
                            },
                        };

                        this.labelsShipperContacts = this.originShipperContacts
                            .map((el) => {
                                return {
                                    ...el,
                                    contacts: el?.contacts?.filter(
                                        (subEl) =>
                                            subEl.shipperId ===
                                            this.selectedExtraStopShipper[index]
                                                .id
                                    ),
                                };
                            })
                            .filter((item) => item.contacts?.length);

                        this.labelsShipperContacts.unshift({
                            id: 7655,
                            name: 'ADD NEW',
                        });

                        if (this.labelsShipperContacts[1]?.contacts[0]) {
                            this.selectedExtraStopShipperContact[index] =
                                this.labelsShipperContacts[1].contacts[0];

                            this.loadExtraStops()
                                .at(index)
                                .get('shipperContactId')
                                .patchValue(
                                    this.selectedExtraStopShipperContact[index]
                                        ?.fullName
                                );

                            this.loadExtraStopsShipperContactsInputConfig[
                                index
                            ] = {
                                ...this
                                    .loadExtraStopsShipperContactsInputConfig[
                                    index
                                ],
                                multipleInputValues: {
                                    options: [
                                        {
                                            value: this
                                                .selectedExtraStopShipperContact[
                                                index
                                            ].name,
                                            logoName: null,
                                        },
                                        {
                                            value: this
                                                .selectedExtraStopShipperContact[
                                                index
                                            ].originalPhone,
                                            second_value: this
                                                .selectedExtraStopShipperContact[
                                                index
                                            ].phoneExtension
                                                ? `#${this.selectedExtraStopShipperContact[index].phoneExtension}`
                                                : null,
                                            logoName: null,
                                        },
                                    ],
                                    customClass: 'load-shipper-contact',
                                },
                                isDisabled: false,
                            };
                        } else {
                            this.labelsShipperContacts = [
                                { id: 7655, name: 'ADD NEW' },
                            ];

                            this.selectedExtraStopShipperContact[index] = null;

                            this.loadExtraStops()
                                .at(index)
                                .get('shipperContactId')
                                .patchValue(null);

                            this.loadExtraStopsShipperContactsInputConfig[
                                index
                            ] = {
                                ...this
                                    .loadExtraStopsShipperContactsInputConfig[
                                    index
                                ],
                                multipleInputValues: null,
                                isDisabled: false,
                            };
                        }
                    }
                    // Restart value if clear
                    else {
                        this.labelsShipperContacts = this.originShipperContacts;

                        this.loadExtraStopsShipperInputConfig[index] = {
                            ...this.loadExtraStopsShipperInputConfig[index],
                            multipleInputValues: null,
                        };

                        this.selectedExtraStopShipperContact[index] = null;

                        this.loadExtraStops()
                            .at(index)
                            .get('shipperContactId')
                            .patchValue(null);

                        this.loadExtraStopsShipperContactsInputConfig[index] = {
                            ...this.loadExtraStopsShipperContactsInputConfig[
                                index
                            ],
                            multipleInputValues: null,
                            isDisabled: true,
                        };
                    }
                }

                break;
            }
            case 'shipper-contact-extra-stops': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();

                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'load-modal',
                            value: this.loadModalData(),
                            id: this.selectedExtraStopShipper[index].id,
                        },
                        type: 'edit-contact',
                        component: ShipperModalComponent,
                        size: 'small',
                    });
                } else {
                    if (event) {
                        this.selectedExtraStopShipperContact[index] = {
                            ...event,
                            name: event?.name?.concat(' ', event?.phone),
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
                                customClass: 'load-shipper-contact',
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
            }
            case 'truck-req': {
                this.selectedTruckReq = event;
                break;
            }
            case 'trailer-req': {
                this.selectedTrailerReq = event;
                break;
            }
            case 'door-type': {
                this.selectedDoorType = event;
                break;
            }
            case 'suspension': {
                this.selectedSuspension = event;
                break;
            }
            case 'length': {
                this.selectedTrailerLength = event;
                break;
            }
            case 'year': {
                this.selectedYear = event;
                break;
            }
            case 'units': {
                this.selectedLoadDetailsUnits[index] = event;
                break;
            }
            case 'stackable': {
                this.selectedLoadDetailsStackable[index] = event;
                break;
            }
            case 'tarp': {
                this.selectedLoadDetailsTarps[index] = event;
                break;
            }
            case 'driverAssis': {
                this.selectedLoadDetailsDriverAssis[index] = event;
                break;
            }
            case 'strapChain': {
                this.selectedLoadDetailsStrapChain[index] = event;
                break;
            }
            case 'hazardous': {
                this.selectedLoadDetailsHazardous[index] = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    // Documents
    public onFilesEvent(event: any) {
        switch (event.action) {
            case 'add': {
                this.documents = event.files;
                this.loadForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.documents = event.files;
                this.loadForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.fileModified = true;
                break;
            }
            case 'tag': {
                let changedTag = false;
                event.files.map((item) => {
                    if (item.tagChanged) {
                        changedTag = true;
                    }
                });

                this.loadForm.get('tags').patchValue(changedTag ? true : null);
                break;
            }
            default: {
                break;
            }
        }
    }

    // First Pickup and Last Delivery Stop Toggling
    public toggleStopActivity(event: boolean, action: string, indx?: number) {
        switch (action) {
            case 'first-pickup': {
                this.isActivePickupStop = event;
                this.isActiveDeliveryStop = false;
                this.loadExtraStops().controls.filter((item) => {
                    item.get('openClose').patchValue(false);
                });
                break;
            }
            case 'first-delivery': {
                if (!this.selectedPickupShipper) {
                    return;
                }

                this.isActiveDeliveryStop = event;
                this.isActivePickupStop = false;
                this.loadExtraStops().controls.filter((item) => {
                    item.get('openClose').patchValue(false);
                });
                break;
            }
            case 'extra-stops': {
                this.closeAllLoadExtraStopExceptActive(
                    this.loadExtraStops().at(indx)
                );

                break;
            }
            default: {
                break;
            }
        }
    }

    // ****************  Billing Payment ****************
    public additionalBillings(): UntypedFormArray {
        return this.loadForm.get('additionalBillings') as UntypedFormArray;
    }

    public createAdditionaBilling(data: {
        id: number;
        name: string;
        billingValue: any;
    }) {
        return this.formBuilder.group({
            id: [data?.id ? data.id : null],
            name: [data?.name ? data.name : null],
            billingValue: [data?.billingValue ? data.billingValue : null],
        });
    }

    public addAdditionalBilling(event: any) {
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
        this.loadForm.get('billingDropdown').patchValue(null);
    }

    public removeAdditionalBilling(type: string, index: number) {
        if (type === 'adjusted') {
            this.selectedAdditionalBillings[0].checked = false;
            this.additionalBillingTypes.unshift(
                this.selectedAdditionalBillings[0]
            );
            this.selectedAdditionalBillings.pop();
            this.inputService.changeValidators(
                this.loadForm.get('adjustedRate'),
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
                case 'Layover': {
                    this.loadModalBill.layover = 0;
                    break;
                }
                case 'Lumper': {
                    this.loadModalBill.lumper = 0;
                    break;
                }
                case 'Fuel Surcharge': {
                    this.loadModalBill.fuelSurcharge = 0;
                    break;
                }
                case 'Escort': {
                    this.loadModalBill.escort = 0;
                    break;
                }
                case 'Detention': {
                    this.loadModalBill.detention = 0;
                    break;
                }
                default: {
                    break;
                }
            }

            this.loadModalBill = Object.assign({}, this.loadModalBill);

            this.additionalBillings().removeAt(index);
        }
    }

    public onFinancialAction(data: { type: string; action: boolean }) {
        if (data.action) {
            switch (data.type) {
                case 'billing': {
                    this.isVisibleBillDropdown = true;

                    break;
                }
                case 'payment': {
                    this.isVisiblePayment = true;
                    this.inputService.changeValidators(
                        this.loadForm.get('advancePay')
                    );

                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    public trackBillingPayment() {
        this.loadForm
            .get('baseRate')
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
                        this.loadForm.get('adjustedRate'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.loadForm.get('driverRate'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.loadForm.get('advancePay'),
                        false
                    );
                } else {
                    this.loadModalBill = {
                        ...this.loadModalBill,
                        baseRate: value,
                    };
                }
            });

        // Adjusted Rate
        this.loadForm
            .get('adjustedRate')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    if (
                        !this.loadForm.get('baseRate').value ||
                        convertThousanSepInNumber(value) >
                            convertThousanSepInNumber(
                                this.loadForm.get('baseRate').value
                            )
                    ) {
                        this.loadForm.get('adjustedRate').reset();
                    }
                }
            });

        // Driver Rate
        this.loadForm
            .get('driverRate')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    if (
                        !this.loadForm.get('baseRate').value ||
                        convertThousanSepInNumber(value) >
                            convertThousanSepInNumber(
                                this.loadForm.get('baseRate').value
                            )
                    ) {
                        this.loadForm.get('driverRate').reset();
                        this.loadForm
                            .get('driverRate')
                            .setErrors({ invalid: true });
                    } else {
                        this.loadForm.get('driverRate').setErrors(null);
                    }
                }
            });

        // Advance Rate
        this.loadForm
            .get('advancePay')
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
                            'billing'
                        )
                    ) {
                        this.loadForm
                            .get('advancePay')
                            .setErrors({ invalid: true });
                    } else {
                        this.loadForm.get('advancePay').setErrors(null);
                    }
                } else {
                    this.loadModalPayment = {
                        ...this.loadModalPayment,
                        advance: 0,
                    };
                }
            });

        // Additional Billings
        this.additionalBillings()
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((arr) => {
                arr.forEach((value) => {
                    switch (value.name) {
                        case 'Layover': {
                            this.loadModalBill.layover = value.billingValue;
                            break;
                        }
                        case 'Lumper': {
                            this.loadModalBill.lumper = value.billingValue;
                            break;
                        }
                        case 'Fuel Surcharge': {
                            this.loadModalBill.fuelSurcharge =
                                value.billingValue;
                            break;
                        }
                        case 'Escort': {
                            this.loadModalBill.escort = value.billingValue;
                            break;
                        }
                        case 'Detention': {
                            this.loadModalBill.detention = value.billingValue;
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                });

                this.loadModalBill = Object.assign({}, this.loadModalBill);
            });
    }

    public removeAdditionalPayment() {
        this.isVisiblePayment = false;
        this.inputService.changeValidators(
            this.loadForm.get('advancePay'),
            false
        );
    }

    // **************** end ****************

    // Load Stop
    public createNewExtraStop() {
        // 1. Set Config For Shipper in Extra Stop
        this.loadExtraStopsShipperInputConfig.push({
            id: `${this.loadExtraStops().length}-extra-stop-shipper`,
            name: 'Input Dropdown',
            type: 'text',
            multipleLabel: {
                labels: ['Shipper', 'City, State, Zip', 'Loads'],
                customClass: 'load-shipper',
            },
            isDropdown: true,
            isRequired: true,
            blackInput: true,
            textTransform: 'uppercase',
            dropdownWidthClass: 'w-col-608',
        });

        // 2. Set Config For Shipper Contacts in Extra Stop
        this.loadExtraStopsShipperContactsInputConfig.push({
            id: `${this.loadExtraStops().length}-extra-stop-shipper-contact`,
            name: 'Input Dropdown',
            type: 'text',
            multipleLabel: {
                labels: ['Contact', 'Phone'],
                customClass: 'load-shipper-contact',
            },
            isDropdown: true,
            isDisabled: true,
            blackInput: true,
            textTransform: 'capitalize',
            dropdownWidthClass: 'w-col-330',
        });

        // 3. Selected arrays
        this.selectedExtraStopShipper.push(null);
        this.selectedExtraStopShipperContact.push(null);
        this.loadExtraStopsDateRange.push(false);
        this.selectExtraStopType.push(3000);
        this.selectedExtraStopTime.push(7000);

        if (!this.selectedPickupShipper) {
            return;
        }

        this.addLoadExtraStop();
    }

    public addLoadExtraStop() {
        this.loadExtraStops().push(this.newLoadExtraStop());

        this.closeAllLoadExtraStopExceptActive(
            this.loadExtraStops().controls[this.loadExtraStops().length - 1]
        );

        setTimeout(() => {
            const obj = this.numberOfLoadExtraStops();

            this.loadExtraStops()
                .at(this.loadExtraStops().length - 1)
                .get('stopOrder')
                .patchValue(obj.numberOfPickups);

            if (this.loadExtraStops().length > 1) {
                this.typeOfExtraStops.push([
                    {
                        id: 3000 + this.loadExtraStops().length,
                        name: 'Pickup',
                        checked: true,
                        color: '26A690',
                    },
                    {
                        id: 4000 + this.loadExtraStops().length,
                        name: 'Delivery',
                        checked: false,
                        color: 'EF5350',
                    },
                ]);

                this.stopTimeTabsExtraStops.push([
                    {
                        id: 7900 + this.loadExtraStops().length,
                        name: 'WORK HOURS',
                        checked: true,
                        color: '3074D3',
                    },
                    {
                        id: 9000 + this.loadExtraStops().length,
                        name: 'APPOINTMENT',
                        checked: false,
                        color: '3074D3',
                    },
                ]);
            }
        }, 100);
    }

    public newLoadExtraStop(): UntypedFormGroup {
        return this.formBuilder.group({
            id: [null],
            stopType: ['Pickup'],
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
            items: this.formBuilder.array([]),
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
            if (item.get('stopType').value === 'Pickup') {
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
        return this.loadForm.get('extraStops') as UntypedFormArray;
    }

    public removeLoadExtraStop(index: number) {
        this.loadExtraStops().removeAt(index);
        // 1. Set Config For Shipper in Extra Stop
        this.loadExtraStopsShipperInputConfig.splice(index, 1);

        // 2. Set Config For Shipper Contacts in Extra Stop
        this.loadExtraStopsShipperContactsInputConfig.splice(index, 1);

        // 3. Selected arrays
        this.selectedExtraStopShipper.splice(index, 1);
        this.selectedExtraStopShipperContact.splice(index, 1);
        this.selectExtraStopType.splice(index, 1);
        this.loadExtraStopsDateRange.splice(index, 1);
        this.selectedExtraStopTime.splice(index, 1);

        this.drawStopOnMap();
    }

    public closeAllLoadExtraStopExceptActive(loadStop: AbstractControl) {
        this.isActivePickupStop = false;
        this.isActiveDeliveryStop = false;
        if (this.loadExtraStops().length) {
            this.loadExtraStops().controls.map((item) => {
                if (
                    item.get('stopOrder').value ===
                    loadStop.get('stopOrder').value
                ) {
                    item.get('openClose').patchValue(true);
                } else {
                    item.get('openClose').patchValue(false);
                }
            });
        }
    }

    // ********************** Load Stop Items **********************
    public createNewRowInStopItems(action: string, loadStopIndex?: number) {
        switch (action) {
            case 'pickup': {
                this.loadPickupStopItems().push(this.newLoadStopItems());
                break;
            }
            case 'delivery': {
                this.loadDeliveryStopItems().push(this.newLoadStopItems());
                break;
            }
            case 'extra-stop': {
                this.loadExtraStopItems(loadStopIndex).push(
                    this.newLoadStopItems()
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    showTableModal(isOpen: boolean, stopType: string) {
        this.tableModalOpen = isOpen ? stopType : '';

        this.modalInitialization();
    }

    public loadPickupStopItems(): UntypedFormArray {
        return this.loadForm.get('pickupItems') as UntypedFormArray;
    }

    public loadDeliveryStopItems(): UntypedFormArray {
        return this.loadForm.get('deliveryItems') as UntypedFormArray;
    }

    public loadExtraStopItems(loadStopIndex: number): UntypedFormArray {
        return this.loadExtraStops()
            .at(loadStopIndex)
            .get('items') as UntypedFormArray;
    }

    public removeLoadStopItem(
        action: string,
        loadStopIndex?: number,
        loadStopItemIndex?: number
    ) {
        switch (action) {
            case 'pickup': {
                this.loadPickupStopItems().removeAt(loadStopIndex);
                break;
            }
            case 'delivery': {
                this.loadDeliveryStopItems().removeAt(loadStopIndex);
                break;
            }
            case 'extra-stop': {
                this.loadExtraStopItems(loadStopIndex).removeAt(
                    loadStopItemIndex
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    // Common fields
    public newLoadStopItems(): UntypedFormGroup {
        return this.formBuilder.group({
            id: [null],
            bolNumber: [null],
            appointmentNumber: [null],
            pickupNumber: [null],
            poNumber: [null],
            sealNumber: [null],
            weight: [null],
            length: [null],
            height: [null],
            temperature: [null],
            description: [null, descriptionValidation],
            code: [null],
            quantity: [null],
            units: [null],
            secure: [null],
            tarp: [null],
            stackable: [null],
            driverAssist: [null],
            hazardousMaterialId: [null],
        });
    }

    // ********************** end **********************

    // Draw Routes on Map
    public drawStopOnMap() {
        const routes: IStopRoutes[] = [];

        // Dispatches
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
        // Pickup Shipper
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
        // Extra Stops
        if (this.loadExtraStops().length) {
            this.loadExtraStops().controls.map((item, index) => {
                routes.push({
                    longitude: this.selectedExtraStopShipper[index]?.longitude,
                    latitude: this.selectedExtraStopShipper[index]?.latitude,
                    pickup: this.selectExtraStopType[index]
                        .toString()
                        .startsWith('3'),
                    delivery: this.selectExtraStopType[index]
                        .toString()
                        .startsWith('4'),
                    stopNumber: item.get('stopOrder').value,
                });
            });
        }
        // Delivery Shipper
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
            this.routingService
                .apiRoutingGet(
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

                        // Render on map routes
                        this.loadStopRoutes[0] = {
                            routeColor: '#919191',
                            stops: routes.map((route, index) => {
                                return {
                                    lat: route.latitude,
                                    long: route.longitude,
                                    stopColor: route.pickup
                                        ? '#26A690'
                                        : route.delivery
                                        ? '#EF5350'
                                        : '#919191',
                                    stopNumber: route.stopNumber.toString(),
                                    empty:
                                        this.selectedDispatches
                                            ?.currentLocationCoordinates &&
                                        index === 1,
                                    zIndex: 99 + index,
                                };
                            }),
                        };

                        // Store in form values
                        if (res?.legs?.length) {
                            res.legs.forEach((item, index) => {
                                // Pickup
                                if (index === 0) {
                                    this.loadForm
                                        .get('loadMiles')
                                        .patchValue(
                                            res?.totalMiles - item.miles
                                        );

                                    this.loadForm
                                        .get('pickuplegMiles')
                                        .patchValue(item.miles);
                                    this.loadForm
                                        .get('pickuplegHours')
                                        .patchValue(item.hours);
                                    this.loadForm
                                        .get('pickuplegMinutes')
                                        .patchValue(item.minutes);

                                    this.loadForm
                                        .get('pickuplegCost')
                                        .patchValue(item.cost);
                                }
                                // Extra Stops
                                if (
                                    index > 0 &&
                                    this.loadExtraStops().length === index
                                ) {
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get('legMiles')
                                        .patchValue(item.miles);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get('legHours')
                                        .patchValue(item.hours);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get('legMinutes')
                                        .patchValue(item.minutes);
                                    this.loadExtraStops()
                                        .at(index - 1)
                                        .get('legCost')
                                        .patchValue(item.cost);
                                }
                                // Delivery Stop
                                else {
                                    if (index > 0) {
                                        this.loadForm
                                            .get('deliverylegMiles')
                                            .patchValue(res?.legs[index].miles);
                                        this.loadForm
                                            .get('deliverylegHours')
                                            .patchValue(res?.legs[index].hours);
                                        this.loadForm
                                            .get('deliverylegMinutes')
                                            .patchValue(
                                                res?.legs[index].minutes
                                            );
                                        this.loadForm
                                            .get('deliverylegCost')
                                            .patchValue(res?.legs[index].cost);
                                    }
                                }
                            });

                            this.loadForm
                                .get('totalMiles')
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

    // Toggle Additional Part of Load Visibility
    public additionalPartVisibility(event: {
        action: string;
        isOpen: boolean;
    }) {
        this.loadModalSize = event.isOpen
            ? 'modal-container-load'
            : 'modal-container-M';

        switch (event.action) {
            case 'hazardous': {
                this.isHazardousVisible = event.isOpen;
                break;
            }
            case 'map': {
                this.isHazardousVisible = false;
                break;
            }
            default: {
                break;
            }
        }
    }

    // CRUD OPERATIONS
    private getLoadDropdowns(id?: number) {
        this.loadService
            .getLoadDropdowns(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: LoadModalResponse) => {
                    console.log('load modal: ', res);
                    this.loadNumber = res.loadNumber;
                    this.tags = res.tags;

                    // Dispatcher
                    this.labelsDispatcher = res.dispatchers.map((item) => {
                        return {
                            ...item,
                            name: item?.fullName,
                            logoName: item?.avatar,
                        };
                    });

                    const initialDispatcher = this.labelsDispatcher.find(
                        (item) =>
                            item?.name ===
                            this.companyUser?.firstName?.concat(
                                ' ',
                                this.companyUser?.lastName
                            )
                    );

                    this.loadForm
                        .get('dispatcherId')
                        .patchValue(initialDispatcher.name);

                    this.selectedDispatcher = initialDispatcher;

                    // Division Companies
                    this.labelsCompanies = res.companies.map((item) => {
                        return {
                            ...item,
                            name: item?.companyName,
                        };
                    });

                    if (this.labelsCompanies.length > 1) {
                        this.selectedCompany = this.labelsCompanies.find(
                            (item) => item.name === this.companyUser.companyName
                        );
                    }

                    // Dispatches
                    this.labelsDispatches = this.originLabelsDispatches =
                        res.dispatches.map((item, index) => {
                            return {
                                ...item,
                                driver: {
                                    ...item.driver,
                                    name: item.driver?.firstName?.concat(
                                        ' ',
                                        item.driver?.lastName
                                    ),
                                    logoName: item.driver?.avatar,
                                    owner: !!item.driver?.owner,
                                },
                                coDriver: {
                                    ...item.coDriver,
                                    name: item.coDriver?.firstName?.concat(
                                        ' ',
                                        item.coDriver?.lastName
                                    ),
                                    logoName: item.coDriver?.avatar,
                                },
                                truck: {
                                    ...item.truck,
                                    name: item.truck?.truckNumber,
                                    logoType: item.truck?.truckType?.name,
                                    logoName: item.truck?.truckType?.logoName,
                                    folder: 'common',
                                    subFolder: 'trucks',
                                },
                                trailer: {
                                    ...item.trailer,
                                    name: item.trailer?.trailerNumber,
                                    logoType: item.trailer?.trailerType?.name,
                                    logoName:
                                        item.trailer?.trailerType?.logoName,
                                    folder: 'common',
                                    subFolder: 'trailers',
                                },
                                itemIndex: index,
                                fullName: item.truck?.truckNumber
                                    .concat(' ', item.trailer?.trailerNumber)
                                    .concat(
                                        ' ',
                                        item.driver?.firstName.concat(
                                            ' ',
                                            item.driver?.lastName
                                        )
                                    ),
                            };
                        });

                    this.labelsDispatches = this.labelsDispatches.filter(
                        (item) =>
                            item?.dispatcherId === this.selectedDispatcher.id
                    );

                    // Brokers
                    this.labelsBroker = res.brokers.map((item) => {
                        return {
                            ...item,
                            name: item?.businessName,
                            status: item.availableCreditType?.name,
                            logoName:
                                item?.dnu || item?.ban
                                    ? 'ic_load-broker-dnu-ban.svg'
                                    : item?.status === 0
                                    ? 'ic_load-broker-closed-business.svg'
                                    : null,
                        };
                    });

                    // Broker Contacts
                    this.labelsBrokerContacts = this.originBrokerContacts =
                        res.brokerContacts.map((item) => {
                            return {
                                ...item,
                                contacts: item.contacts.map((item) => {
                                    return {
                                        ...item,
                                        name: item?.contactName,
                                        phone: item?.phone?.concat(
                                            ' ',
                                            item?.extensionPhone
                                                ? `x${item.extensionPhone}`
                                                : ''
                                        ),
                                        originalPhone: item.phone,
                                        phoneExtension: item.extensionPhone,
                                        fullName: item?.contactName.concat(
                                            ' ',
                                            item?.phone?.concat(
                                                ' ',
                                                item?.extensionPhone
                                                    ? `x${item.extensionPhone}`
                                                    : ''
                                            )
                                        ),
                                    };
                                }),
                            };
                        });

                    // Door Type
                    this.labelsDoorType = res.doorTypes;

                    // General Commmodity
                    this.labelsGeneralCommodity = res.generalCommodities.map(
                        (item) => {
                            if (item.name.toLowerCase() === 'hazardous') {
                                return {
                                    ...item,
                                    logoName: 'ic_hazardous.svg',
                                    folder: 'common',
                                    subFolder: 'load',
                                };
                            }
                            return { ...item };
                        }
                    );

                    // Labels Suspension
                    this.labelsSuspension = res.suspensions;

                    // Labels Template
                    this.labelsTemplate = res.templates;

                    // Trailer Length
                    this.labelsTrailerLength = res.trailerLengths;

                    // Trailer Req
                    this.labelsTrailerReq = res.trailerTypes.map((item) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'trailers',
                        };
                    });

                    // Truck Req
                    this.labelsTruckReq = res.truckTypes.map((item) => {
                        return {
                            ...item,
                            folder: 'common',
                            subFolder: 'trucks',
                        };
                    });

                    // Years
                    this.labelsYear = res.years.map((item, index) => {
                        return {
                            id: index + 1,
                            name: item.toString(),
                        };
                    });

                    // Shipper
                    this.labelsShippers = res.shippers.map((item) => {
                        return {
                            ...item,
                            name: item?.businessName,
                            address: item.address?.city
                                ?.concat(', ', item.address?.stateShortName)
                                ?.concat(' ', item.address?.zipCode),
                            logoName:
                                item.status === 0
                                    ? 'ic_load-broker-closed-business.svg'
                                    : null,
                        };
                    });

                    // Shipper Contacts
                    this.labelsShipperContacts = this.originShipperContacts =
                        res.shipperContacts.map((item) => {
                            return {
                                ...item,
                                contacts: item.contacts.map((item) => {
                                    return {
                                        ...item,
                                        name: item?.contactName,
                                        phone: item?.phone?.concat(
                                            ' ',
                                            item?.extensionPhone
                                                ? `x${item.extensionPhone}`
                                                : ''
                                        ),
                                        originalPhone: item.phone,
                                        phoneExtension: item.extensionPhone,
                                        fullName: item?.contactName.concat(
                                            ' ',
                                            item?.phone?.concat(
                                                ' ',
                                                item?.extensionPhone
                                                    ? `x${item.extensionPhone}`
                                                    : ''
                                            )
                                        ),
                                    };
                                }),
                            };
                        });

                    // Units
                    this.labelsloadDetailsUnits = res.loadItemUnits;

                    // Stackable
                    this.labelsLoadDetailsStackable = res.stackable;

                    // Tarps
                    this.labelsLoadDetailsTarps = res.tarps;

                    // Driver Assis
                    this.labelsLoadDetailsDriverAssis = res.driverAssist;

                    // Strap/Chain
                    this.labelsLoadDetailsStrapChain = res.secures;

                    // Hazardous
                    this.labelsLoadDetailsHazardous =
                        res.hazardousMaterials.map((item) => {
                            return {
                                ...item,
                                name: item?.description,
                                logoName: item?.logoName?.includes('explosives')
                                    ? 'ic_explosives.svg'
                                    : item.logoName,
                                folder: 'common',
                                subFolder: 'load',
                            };
                        });

                    // Additional Billing Types
                    this.additionalBillingTypes = [
                        ...res.additionalBillingTypes.map((item) => {
                            return { ...item, checked: false };
                        }),
                    ];
                    this.originalAdditionalBillingTypes =
                        this.additionalBillingTypes;

                    this.populateLoadModalData();
                },

                error: () => {},
            });
    }

    private getLoadById(id: number) {
        setTimeout(() => {
            this.disableCardAnimation = false;
        }, 1000);
    }

    private populateLoadModalData() {
        if (this.editData?.storageData) {
            const loadData = this.editData?.storageData;

            this.loadForm.patchValue({
                referenceNumber: loadData.referenceNumber,
                weight: loadData.weight,
                liftgate: loadData.loadRequirements?.liftgate,
                note: loadData.note,
                baseRate: loadData.baseRate,
                driverRate: loadData.driverRate,
                adjustedRate: loadData.adjustedRate,
                advancePay: loadData.advancePay,
                // Pickup Shipper
                pickupDateFrom: loadData.pickupDateFrom,
                pickupDateTo: loadData.pickupDateTo,
                pickupTimeFrom: loadData.pickupTimeFrom,
                pickupTimeTo: loadData.pickupTimeTo,
                pickuplegMiles: loadData.pickuplegMiles,
                pickuplegHours: loadData.pickuplegHours,
                pickuplegMinutes: loadData.pickuplegMinutes,
                pickuplegCost: loadData.pickuplegCost,
                // Delivery Shipper
                deliveryDateFrom: loadData.deliveryDateFrom,
                deliveryDateTo: loadData.deliveryDateTo,
                deliveryTimeFrom: loadData.deliveryTimeFrom,
                deliveryTimeTo: loadData.deliveryTimeTo,
                deliverylegMiles: loadData.deliverylegMiles,
                deliverylegHours: loadData.deliverylegHours,
                deliverylegMinutes: loadData.deliverylegMinutes,
                deliverylegCost: loadData.deliverylegCost,
                // Extra Stop
                totalMiles: loadData.totalLegMiles,
                totalHours: loadData.totalLegHours,
                totalMinutes: loadData.totalLegMinutes,
                driverMessage: loadData.loadRequirements?.driverMessage,
            });

            this.tabs = this.tabs.map((item) => {
                return {
                    ...item,
                    checked: item.name === loadData.type,
                };
            });

            this.isVisiblePayment = !!loadData.advancePay;

            this.requirementsSectionOpened = Object.keys(
                loadData.loadRequirements
            ).some(
                (key) =>
                    loadData.loadRequirements[key] !== undefined &&
                    loadData.loadRequirements[key] !== null
            );

            this.selectedTemplate = loadData.loadTemplateId;
            this.selectedDispatcher = loadData.dispatcherId;
            this.selectedCompany = loadData.companyId;
            this.selectedGeneralCommodity = loadData.generalCommodity;
            this.selectedTruckReq = loadData.loadRequirements.truckTypeId;
            this.selectedTrailerReq = loadData.loadRequirements.trailerTypeId;
            this.selectedDoorType = loadData.loadRequirements.doorType;
            this.selectedSuspension = loadData.loadRequirements.suspension;
            this.selectedTrailerLength =
                loadData.loadRequirements.trailerLengthId;
            this.selectedYear = loadData.loadRequirements.year;

            this.onSelectDropdown(loadData.dispatchId, 'dispatches');
            this.onSelectDropdown(loadData.brokerId, 'broker');
            this.onSelectDropdown(loadData.brokerContactId, 'broker-contact');
            this.onSelectDropdown(loadData.pickupShipper, 'shipper-pickup');
            this.onSelectDropdown(
                loadData.pickupShipperContact,
                'shipper-contact-pickup'
            );
            this.onSelectDropdown(loadData.deliveryShipper, 'shipper-delivery');
            this.onSelectDropdown(
                loadData.deliveryShipperContact,
                'shipper-contact-delivery'
            );

            //----------- Pickup Shipper -----------
            this.stopTimeTabsPickup = this.stopTimeTabsPickup.map((item) => {
                return {
                    ...item,
                    checked: item.id === loadData.selectedStopTimePickup,
                };
            });

            if (loadData.selectedStopTimePickup) {
                this.selectedStopTimePickup = loadData.selectedStopTimePickup;
                this.inputService.changeValidators(
                    this.loadForm.get('pickupTimeTo'),
                    this.selectedStopTimePickup === 6 ? false : true
                );
            }

            //----------- Delivery Shipper -----------
            this.stopTimeTabsDelivery = this.stopTimeTabsDelivery.map(
                (item) => {
                    return {
                        ...item,
                        checked: item.id === loadData.selectedStopTimeDelivery,
                    };
                }
            );

            if (loadData.selectedStopTimeDelivery) {
                this.selectedStopTimeDelivery =
                    loadData.selectedStopTimeDelivery;
                this.inputService.changeValidators(
                    this.loadForm.get('deliveryTimeTo'),
                    this.selectedStopTimePickup === 8 ? false : true
                );
            }

            //----------- Extra Stops -----------
            if (loadData.extraStops?.length) {
                loadData.extraStops.forEach((item, index) => {
                    this.createNewExtraStop();

                    setTimeout(() => {
                        this.loadExtraStops().at(index).patchValue({
                            id: item.id,
                            stopType: item.stopType,
                            stopOrder: item.stopOrder,
                            shipperId: item.shipperId,
                            shipperContactId: item.shipperContactId,
                            dateFrom: item.dateFrom,
                            dateTo: item.dateTo,
                            timeType: item.timeType,
                            timeFrom: item.timeFrom,
                            timeTo: item.timeTo,
                            arrive: item.arrive,
                            depart: item.depart,
                            longitude: item.longitude,
                            latitude: item.latitude,
                            legMiles: item.legMiles,
                            legHours: item.legHours,
                            legMinutes: item.legMinutes,
                            legCost: item.legCost,
                            items: [],
                            openClose: item.openClose,
                        });

                        this.onSelectDropdown(
                            loadData.extraStopShipper[index],
                            'shipper-extra-stops',
                            index
                        );

                        this.onSelectDropdown(
                            loadData.selectedExtraStopTime[index],
                            'extra-stops-time',
                            index
                        );
                    }, 200);
                });
            }

            this.documents = loadData.files;

            loadData.additionalBillingTypes.map((item) => {
                if (item.billingValue) {
                    this.addAdditionalBilling(item);
                }
            });
        }
    }

    private loadModalData() {
        const { ...form } = this.loadForm.value;

        return {
            type: this.tabs.find((item) => item.id === this.selectedTab)
                .name as any,
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
            // Pickup Shipper
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
            // Delivery Shipper
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
            // Extra Stop Shipper
            extraStopShipper: this.selectedExtraStopShipper,
            extraStopShipperContact: this.selectedExtraStopShipperContact,
            selectedExtraStopTime: this.selectedExtraStopTime,
            extraStops: this.loadExtraStops().value,
            //----
            note: form.note,
            baseRate: form.baseRate,
            driverRate: form.driverRate,
            adjustedRate: form.adjustedRate,
            advancePay: form.advancePay,
            additionalBillingTypes: this.additionalBillings().value,
            totalMiles: this.totalLegMiles,
            totalHours: this.totalLegHours,
            totalMinutes: this.totalLegMinutes,
            files: this.documents,
        };
    }

    private addLoad() {
        const { ...form } = this.loadForm.value;

        let documents = [];
        let tagsArray = [];
        this.documents.map((item) => {
            if (item.tagId?.length)
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        if (!tagsArray.length) {
            tagsArray = null;
        }

        let newData: any = {
            type: this.tabs.find((item) => item.id === this.selectedTab)
                .name as any,
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
                    : this.selectedCompany
                    ? this.selectedCompany.id
                    : null,
            dispatchId: this.selectedDispatches
                ? this.selectedDispatches.id
                : null,
            dateCreated: moment(new Date()).toISOString(true),
            brokerId: this.selectedBroker ? this.selectedBroker.id : null,
            brokerContactId: this.selectedBrokerContact
                ? this.selectedBrokerContact.id
                : null,
            referenceNumber: form.referenceNumber,
            generalCommodity: this.selectedGeneralCommodity
                ? this.selectedGeneralCommodity.id
                : null,
            weight: convertThousanSepInNumber(form.weight),
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
                liftgate: form.liftgate,
            },
            note: form.note,
            baseRate: convertThousanSepInNumber(form.baseRate),
            driverRate: form.driverRate
                ? convertThousanSepInNumber(form.driverRate)
                : null,
            adjustedRate: form.adjustedRate
                ? convertThousanSepInNumber(form.adjustedRate)
                : null,
            advancePay: convertThousanSepInNumber(form.advancePay),
            additionalBillingRates:
                this.premmapedAdditionalBillingRate('create'),
            stops: this.premmapedStops() as any,
            totalMiles: this.totalLegMiles,
            totalHours: this.totalLegHours,
            totalMinutes: this.totalLegMinutes,
            files: documents,
            tags: tagsArray,
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

    private updateLoad(id: number) {}

    private saveLoadTemplate() {
        const { ...form } = this.loadForm.value;
        const newData: CreateLoadTemplateCommand = {
            name: 'Novi template',
            type: this.tabs.find((item) => item.id === this.selectedTab)
                .name as any,
            dispatcherId: this.selectedDispatcher
                ? this.selectedDispatcher.id
                : null,
            companyId:
                this.labelsCompanies.length === 1
                    ? this.labelsCompanies[0].id
                    : this.selectedCompany
                    ? this.selectedCompany.id
                    : null,
            dispatchId: this.selectedDispatches
                ? this.selectedDispatches.id
                : null,
            dateCreated: moment(new Date()).toISOString(true),
            brokerId: this.selectedBroker ? this.selectedBroker.id : null,
            brokerContactId: this.selectedBrokerContact
                ? this.selectedBrokerContact.id
                : null,
            referenceNumber: form.referenceNumber,
            generalCommodity: this.selectedGeneralCommodity
                ? this.selectedGeneralCommodity.id
                : null,
            weight: convertThousanSepInNumber(form.weight),
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
                liftgate: form.liftgate,
            },
            note: form.note,
            baseRate: convertThousanSepInNumber(form.baseRate),
            driverRate: form.driverRate
                ? convertThousanSepInNumber(form.driverRate)
                : null,
            adjustedRate: form.adjustedRate
                ? convertThousanSepInNumber(form.adjustedRate)
                : null,
            advancePay: convertThousanSepInNumber(form.advancePay),
            additionalBillingRates:
                this.premmapedAdditionalBillingRate('create'),
            stops: this.premmapedStops() as any,
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
                        action: 'load-template',
                        status: false,
                        close: false,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'load-template',
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private premmapedAdditionalBillingRate(action: string) {
        return this.originalAdditionalBillingTypes
            .map((item) => {
                const biilingRate = this.additionalBillings().controls.find(
                    (control) => control.get('name').value === item.name
                );
                return {
                    id: action === 'update' ? item.id : null,
                    additionalBillingType: item.id,
                    rate: biilingRate
                        ? biilingRate.get('billingValue').value
                        : null,
                };
            })
            .filter((item) => item.additionalBillingType !== 6);
    }

    private premmapedStops() {
        const stops: any[] = [];

        // Pickup
        if (this.selectedPickupShipper) {
            stops.push({
                id: null,
                stopType: this.loadForm.get('pickupStop').value,
                stopOrder: stops.length + 1,
                stopLoadOrder: this.loadForm.get('pickupStopOrder').value,
                shipperId: this.selectedPickupShipper.id,
                shipperContactId: this.selectedPickupShipperContact?.id
                    ? this.selectedPickupShipperContact.id
                    : null,
                dateFrom: convertDateToBackend(
                    this.loadForm.get('pickupDateFrom').value
                ),
                dateTo: this.loadForm.get('pickupDateTo').value
                    ? convertDateToBackend(
                          this.loadForm.get('pickupDateTo').value
                      )
                    : null,
                timeType:
                    this.stopTimeTabsPickup.find((item) => item.checked)
                        .name === 'APPOINTMENT'
                        ? 2
                        : 1,
                timeFrom: this.loadForm.get('pickupTimeFrom').value,
                timeTo: this.loadForm.get('pickupTimeTo').value,
                arrive: null,
                depart: null,
                legMiles: this.loadForm.get('pickuplegMiles').value,
                legHours: this.loadForm.get('pickuplegHours').value,
                legMinutes: this.loadForm.get('pickuplegMinutes').value,
                items: [],
                // this.loadStopsDetails(index).controls.map(
                //     (item, index) => {
                //         return {
                //             id: item.get('id').value,
                //             bolNumber: item.get('bolNumber').value,
                //             appointmentNumber:
                //                 item.get('appointmentNumber').value,
                //             pickupNumber: item.get('pickupNumber').value,
                //             poNumber: item.get('poNumber').value,
                //             sealNumber: item.get('sealNumber').value,
                //             weight: item.get('weight').value
                //                 ? convertThousanSepInNumber(
                //                       item.get('weight').value
                //                   )
                //                 : null,
                //             length: item.get('length').value
                //                 ? convertThousanSepInNumber(
                //                       item.get('length').value
                //                   )
                //                 : null,
                //             height: item.get('height').value
                //                 ? convertThousanSepInNumber(
                //                       item.get('height').value
                //                   )
                //                 : null,
                //             temperature: item.get('temperature').value
                //                 ? convertThousanSepInNumber(
                //                       item.get('temperature').value
                //                   )
                //                 : null,
                //             description: item.get('description').value,
                //             code: item.get('code').value,
                //             quantity: item.get('quantity').value
                //                 ? convertThousanSepInNumber(
                //                       item.get('quantity').value
                //                   )
                //                 : null,
                //             units: this.selectedLoadDetailsUnits[index]
                //                 ? this.selectedLoadDetailsUnits[index].id
                //                 : null,
                //             secure: this.selectedLoadDetailsStrapChain[index]
                //                 ? this.selectedLoadDetailsStrapChain[index].id
                //                 : null,
                //             tarp: this.selectedLoadDetailsTarps[index]
                //                 ? this.selectedLoadDetailsTarps[index].id
                //                 : null,
                //             stackable: this.selectedLoadDetailsStackable[index]
                //                 ? this.selectedLoadDetailsStackable[index].id
                //                 : null,
                //             driverAssist: this.selectedLoadDetailsDriverAssis[
                //                 index
                //             ]
                //                 ? this.selectedLoadDetailsDriverAssis[index].id
                //                 : null,
                //             hazardousMaterialId: this
                //                 .selectedLoadDetailsHazardous[index]
                //                 ? this.selectedLoadDetailsHazardous[index].id
                //                 : null,
                //         };
                //     }
                // ),
            });
        }

        // Extra Stops
        if (this.loadExtraStops().length) {
            this.loadExtraStops().controls.forEach((item, index) => {
                stops.push({
                    id: null,
                    stopType: item.get('stopType').value,
                    stopOrder: stops.length + 1,
                    stopLoadOrder: item.get('stopOrder').value,
                    shipperId: this.selectedExtraStopShipper[index].id,
                    dateFrom: convertDateToBackend(item.get('dateFrom').value),
                    dateTo: item.get('dateTo').value
                        ? convertDateToBackend(item.get('dateTo').value)
                        : null,
                    timeType:
                        this.stopTimeTabsPickup.find((item) => item.checked)
                            .name === 'APPOINTMENT'
                            ? 2
                            : 1,
                    timeFrom: item.get('timeFrom').value,
                    timeTo: item.get('timeTo').value,
                    arrive: null,
                    depart: null,
                    // From legs
                    legMiles: item.get('legMiles').value,
                    legHours: item.get('legHours').value,
                    legMinutes: item.get('legMinutes').value,
                    items: [],
                });
            });
        }

        // Delivery
        if (this.selectedDeliveryShipper) {
            stops.push({
                id: null,
                stopType: this.loadForm.get('deliveryStop').value,
                stopOrder: stops.length + 1,
                stopLoadOrder: this.loadForm.get('deliveryStopOrder').value,
                shipperId: this.selectedDeliveryShipper.id,
                shipperContactId: this.selectedDeliveryShipperContact?.id
                    ? this.selectedDeliveryShipperContact.id
                    : null,
                dateFrom: convertDateToBackend(
                    this.loadForm.get('deliveryDateFrom').value
                ),
                dateTo: this.loadForm.get('deliveryDateTo').value
                    ? convertDateToBackend(
                          this.loadForm.get('deliveryDateTo').value
                      )
                    : null,
                timeType:
                    this.stopTimeTabsDelivery.find((item) => item.checked)
                        .name === 'APPOINTMENT'
                        ? 2
                        : 1,
                timeFrom: this.loadForm.get('deliveryTimeFrom').value,
                timeTo: this.loadForm.get('deliveryTimeTo').value,
                arrive: null,
                depart: null,
                legMiles: this.loadForm.get('deliverylegMiles').value,
                legHours: this.loadForm.get('deliverylegHours').value,
                legMinutes: this.loadForm.get('deliverylegMinutes').value,
                items: [],
            });
        }

        return stops;
    }

    /* Comments */
    public changeCommentsEvent(comments: ReviewCommentModal) {
        switch (comments.action) {
            case 'delete': {
                this.deleteComment(comments);
                break;
            }
            case 'add': {
                this.addComment(comments);
                break;
            }
            case 'update': {
                this.updateComment(comments);
                break;
            }
            default: {
                break;
            }
        }
    }

    public createComment() {
        if (this.comments.some((item) => item.isNewReview)) {
            return;
        }
        // ------------------------ PRODUCTION MODE -----------------------------
        // this.reviews.unshift({
        //   companyUser: {
        //     fullName: this.companyUser.firstName.concat(' ', this.companyUser.lastName),
        //     avatar: this.companyUser.avatar,
        //   },
        //   commentContent: '',
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString(),
        //   isNewReview: true,
        // });
        // -------------------------- DEVELOP MODE --------------------------------
        this.comments.unshift({
            companyUser: {
                fullName: this.companyUser.firstName.concat(
                    ' ',
                    this.companyUser.lastName
                ),
                avatar: this.companyUser.avatar,
            },
            commentContent: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isNewReview: true,
        });
    }

    public addComment(comments: ReviewCommentModal) {
        const comment: CreateCommentCommand = {
            entityTypeCommentId: 2,
            entityTypeId: this.editData.id,
            commentContent: comments.data.commentContent,
        };

        this.commentsService
            .createComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.comments = comments.sortData.map((item, index) => {
                        if (index === 0) {
                            return {
                                ...item,
                                id: res.id,
                            };
                        }
                        return item;
                    });
                },
                error: () => {},
            });
    }

    public deleteComment(comments: ReviewCommentModal) {
        this.comments = comments.sortData;
        this.commentsService
            .deleteCommentById(comments.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public updateComment(comments: ReviewCommentModal) {
        this.comments = comments.sortData;

        const comment: UpdateCommentCommand = {
            id: comments.data.id,
            commentContent: comments.data.commentContent,
        };

        this.commentsService
            .updateComment(comment)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public identity(index: number, item: any): number {
        return index;
    }

    public onBlurDescription(action: string, ind?: number) {
        switch (action) {
            case 'pickup': {
                const description = this.loadPickupStopItems()
                    .at(ind)
                    .get('description').value;

                if (description) {
                    this.loadService
                        .autocompleteLoadByDescription(description)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (
                                res: LoadStopItemAutocompleteDescriptionResponse
                            ) => {
                                console.log('autocomplete pickup: ', res);
                            },
                            error: () => {},
                        });
                }

                break;
            }
            case 'delivery': {
                const description = this.loadDeliveryStopItems()
                    .at(ind)
                    .get('description').value;

                if (description) {
                    this.loadService
                        .autocompleteLoadByDescription(description)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (
                                res: LoadStopItemAutocompleteDescriptionResponse
                            ) => {
                                console.log('autocomplete delivery: ', res);
                            },
                            error: () => {},
                        });
                }

                break;
            }
            case 'extra-stop': {
                const description = this.loadExtraStopItems(ind)
                    .at(ind)
                    .get('description').value;

                if (description) {
                    this.loadService
                        .autocompleteLoadByDescription(description)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (
                                res: LoadStopItemAutocompleteDescriptionResponse
                            ) => {
                                console.log('autocomplete extra stop: ', res);
                            },
                            error: () => {},
                        });
                }

                break;
            }
        }
    }

    updateTags() {
        let tags = [];

        this.documents.map((item) => {
            if (item?.tagChanged && item?.fileId) {
                var tagsData = {
                    storageId: item.fileId,
                    tagId: item.tagId?.length ? item.tagId[0] : null,
                };
                tags.push(tagsData);
            }
        });

        if (tags.length) {
            this.tagsService.updateTag({ tags: tags }).subscribe();
        }
    }

    // MODAL TABLE
    public testControl: UntypedFormGroup = new UntypedFormGroup({
        email: new UntypedFormControl(null),
        password: new UntypedFormControl(null),
        phone: new UntypedFormControl(null),
    });
    modalColumns: any[] = [];
    modalViewData: any[] = [];

    modalInitialization() {
        this.modalColumns = [];
        this.modalViewData = [];

        this.modalColumns = getLoadModalColumnDefinition();

        for (let i = 0; i < 3; i++) {
            this.modalViewData.push({
                tableDescription: {
                    text: 'Jaffa Cakes',
                    extraText: '',
                },
                tableQuantity: {
                    text: 230,
                    extraText: 'Boxes',
                },
                tableBolNo: {
                    text: 1598550,
                    extraText: '',
                },
                tableWeight: {
                    text: '2,360',
                    extraText: 'lbs',
                },
                tableAction: 'delete',
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
