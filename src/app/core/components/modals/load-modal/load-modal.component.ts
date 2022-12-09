import {
    CreateCommentCommand,
    RoutingResponse,
    RoutingService,
    SignInResponse,
    UpdateCommentCommand,
} from 'appcoretruckassist';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
} from '@angular/forms';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';

import { FormService } from '../../../services/form/form.service';
import { LoadTService } from '../../load/state/load.service';
import { LoadModalResponse } from '../../../../../../appcoretruckassist';
import { CommentsService } from '../../../services/comments/comments.service';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import { ITaInput } from '../../shared/ta-input/ta-input.config';

import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { descriptionValidation } from '../../shared/ta-input/ta-input.regex-validations';
import {
    convertDateToBackend,
    convertThousanSepInNumber,
} from '../../../utils/methods.calculations';
import moment from 'moment';
import { CreateLoadTemplateCommand } from '../../../../../../appcoretruckassist/model/createLoadTemplateCommand';
@Component({
    selector: 'app-load-modal',
    templateUrl: './load-modal.component.html',
    styleUrls: ['./load-modal.component.scss'],
    providers: [ModalService, FormService],
    encapsulation: ViewEncapsulation.None,
})
export class LoadModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public loadForm: FormGroup;
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

    public selectedExtraStopTab: number[] = [];
    public stopTabs = [
        {
            id: 3,
            name: 'Pickup',
            checked: true,
        },
        {
            id: 4,
            name: 'Delivery',
            checked: false,
        },
    ];

    public selectedStopTimePickup: number = 5;
    public stopTimeTabsPickup = [
        {
            id: 5,
            name: 'Open',
            checked: true,
        },
        {
            id: 6,
            name: 'APPT',
            checked: false,
        },
    ];

    public selectedStopTimeDelivery: number = 5;
    public stopTimeTabsDelivery = [
        {
            id: 7,
            name: 'Open',
            checked: true,
        },
        {
            id: 8,
            name: 'APPT',
            checked: false,
        },
    ];

    public loadNumber: string;

    public loadModalBill: {
        baseRate: number;
        adjusted: number;
        advance: number;
        layover: number;
        lumper: number;
        fuelSurcharge: number;
        escort: number;
        detention: number;
    } = {
        baseRate: 0,
        adjusted: 0,
        advance: 0,
        layover: 0,
        lumper: 0,
        fuelSurcharge: 0,
        escort: 0,
        detention: 0,
    };

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
    public originShipperContacts: any[] = [];
    public labelsShipperContacts: any[] = [];

    // Requirements LAbels
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

    // Load Details Labels
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
        dropdownWidthClass: 'w-col-606',
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
        dropdownWidthClass: 'w-col-344',
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
        dropdownWidthClass: 'w-col-606',
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
        dropdownWidthClass: 'w-col-344',
    };

    // Extra Stop Configuration
    public selectedExtraStopShipper: any[] = [];
    public selectedExtraStopShipperContact: any[] = [];
    public loadExtraStopsShipperInputConfig: ITaInput[] = [];
    public loadExtraStopsShipperContactsInputConfig: ITaInput[] = [];

    // Billing
    public additionalBillingTypes: any[] = [];
    public isAvailableAdjustedRate: boolean = false;
    public isAvailableAdvanceRate: boolean = false;

    // Documents
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    // Comments
    public comments: any[] = [];

    // Map Routes
    public loadStopRoutes: {
        routeColor: string;
        stops: {
            lat: number;
            long: number;
            empty: boolean;
        }[];
    }[] = [];

    // Hazardous Dropdown
    public isHazardousPicked: boolean = false;
    public isHazardousVisible: boolean = false;

    // Pickup Stops
    public pickupDateRange: boolean = false;
    public isActivePickupStop: boolean = false;

    // Delivery Stops
    public deliveryDateRange: boolean = false;
    public isActiveDeliveryStop: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private commentsService: CommentsService,
        private routingService: RoutingService,
        private loadService: LoadTService,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.companyUser = JSON.parse(localStorage.getItem('user'));
        this.createForm();
        this.getLoadDropdowns();

        // this.trackBillingPayment();
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
            pickupShipper: [null, Validators.required],
            pickupShipperContactId: [null],
            pickupDateFrom: [null, Validators.required],
            pickupDateTo: [null],
            pickupTimeFrom: [null, Validators.required],
            pickupTimeTo: [null, Validators.required],
            pickupItems: this.formBuilder.array([]),
            // -------------
            // Delivery Stop
            deliveryStop: ['Delivery'],
            deliveryShipper: [null, Validators.required],
            deliveryShipperContactId: [null],
            deliveryDateFrom: [null, Validators.required],
            deliveryDateTo: [null],
            deliveryTimeFrom: [null, Validators.required],
            deliveryTimeTo: [null, Validators.required],
            deliveryItems: this.formBuilder.array([]),
            // -------------
            // Extra Stops
            extraStops: this.formBuilder.array([]),
            // -------------
            // Billing
            baseRate: [null, Validators.required],
            adjustedRate: [null],
            advancePay: [null],
            layoverRate: [null],
            lumperRate: [null],
            fuelSurchargeRate: [null],
            escortRate: [null],
            detentionRate: [null],
            // -------------
            note: [null],
            files: [null],
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
                this.selectedExtraStopTab[indx] = event.id;
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
                if (this.selectedStopTimePickup === 6) {
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
                    });
                } else {
                    this.addLoad();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
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

                    this.loadDispatchesTTDInputConfig = {
                        ...this.loadDispatchesTTDInputConfig,
                        multipleInputValues: {
                            options: [
                                {
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
                } else {
                    this.loadDispatchesTTDInputConfig = {
                        ...this.loadDispatchesTTDInputConfig,
                        multipleInputValues: null,
                    };

                    this.selectedDispatches = null;
                }
                break;
            }
            case 'broker': {
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
                                    second_value: 10000,
                                    logoName: null,
                                    isProgressBar: true,
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

                    this.labelsBrokerContacts = this.originBrokerContacts.map(
                        (el) => {
                            return {
                                ...el,
                                contacts: el?.contacts?.filter(
                                    (subEl) =>
                                        subEl.brokerId ===
                                        this.selectedBroker.id
                                ),
                            };
                        }
                    );

                    this.selectedBrokerContact =
                        this.labelsBrokerContacts[1].contacts[0];

                    if (this.selectedBrokerContact) {
                        this.loadForm
                            .get('brokerContactId')
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
                                        second_value: `#${this.selectedBrokerContact.phoneExtension}`,
                                        logoName: null,
                                    },
                                ],
                                customClass: 'load-broker-contact',
                            },
                            isDisabled: false,
                            blackInput: false,
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
                break;
            }
            case 'broker-contact': {
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
                                    second_value: `#${event.phoneExtension}`,
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
                break;
            }
            case 'shipper-pickup': {
                this.selectedPickupShipper = event;
                console.log('selected shipper: ', this.selectedPickupShipper);
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
                                    value: this.selectedPickupShipper.address,
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

                    this.labelsShipperContacts = this.originShipperContacts.map(
                        (el) => {
                            return {
                                ...el,
                                contacts: el?.contacts?.filter(
                                    (subEl) =>
                                        subEl.shipperId ===
                                        this.selectedPickupShipper.id
                                ),
                            };
                        }
                    );

                    this.selectedPickupShipperContact =
                        this.labelsShipperContacts[1].contacts[0];

                    console.log(
                        this.selectedPickupShipper,
                        this.selectedPickupShipperContact
                    );
                    this.loadForm
                        .get('pickupShipperContactId')
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
                                    second_value: `#${this.selectedPickupShipperContact.phoneExtension}`,
                                    logoName: null,
                                },
                            ],
                            customClass: 'load-shipper-contact',
                        },
                        isDisabled: false,
                    };
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

                    console.log(this.loadPickupShipperContactsInputConfig);
                }
                break;
            }
            case 'shipper-contact-pickup': {
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
                                    second_value: `#${event.phoneExtension}`,
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
                break;
            }

            case 'shipper-delivery': {
                this.selectedDeliveryShipper = event;
                console.log('selected shipper: ', this.selectedDeliveryShipper);
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
                                    value: this.selectedDeliveryShipper
                                        .loadsCount,
                                    logoName: null,
                                    isCounter: true,
                                },
                            ],
                            customClass: 'load-shipper',
                        },
                    };

                    this.labelsShipperContacts = this.originShipperContacts.map(
                        (el) => {
                            return {
                                ...el,
                                contacts: el?.contacts?.filter(
                                    (subEl) =>
                                        subEl.shipperId ===
                                        this.selectedDeliveryShipper.id
                                ),
                            };
                        }
                    );

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
                                    value: this.selectedDeliveryShipperContact
                                        .name,
                                    logoName: null,
                                },
                                {
                                    value: this.selectedDeliveryShipperContact
                                        .originalPhone,
                                    second_value: `#${this.selectedDeliveryShipperContact.phoneExtension}`,
                                    logoName: null,
                                },
                            ],
                            customClass: 'load-shipper-contact',
                        },
                        isDisabled: false,
                    };
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
                break;
            }
            case 'shipper-contact-delivery': {
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
                                    second_value: `#${event.phoneExtension}`,
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
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.loadForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
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
                break;
            }
            case 'first-delivery': {
                this.isActiveDeliveryStop = event;
                this.isActivePickupStop = false;
                break;
            }
            case 'extra-stops': {
                this.selectedExtraStopShipperContact[indx].openClose = event;

                this.closeAllLoadExtraStopExceptActive(
                    this.loadExtraStops[indx]
                );

                break;
            }
            default: {
                break;
            }
        }

        this.loadExtraStops().controls.filter((item) => {
            item.get('openClose').patchValue(false);
        });
    }

    // Billing Payment
    public trackBillingPayment() {
        this.loadForm
            .get('baseRate')
            .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((value) => {
                if (!value) {
                    this.isAvailableAdjustedRate = false;
                    this.isAvailableAdvanceRate = false;

                    this.loadForm.get('adjustedRate').reset();
                    this.loadForm.get('advancePay').reset();
                    this.loadForm.get('layoverRate').reset();
                    this.loadForm.get('lumperRate').reset();
                    this.loadForm.get('fuelSurchargeRate').reset();
                    this.loadForm.get('escortRate').reset();
                    this.loadForm.get('detentionRate').reset();
                    this.additionalBillingTypes.filter(
                        (item) => (item.active = false)
                    );
                } else {
                    this.loadModalBill.baseRate =
                        convertThousanSepInNumber(value);
                }
            });

        this.loadForm
            .get('adjustedRate')
            .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((value) => {
                if (!this.loadForm.get('baseRate').value || !value) {
                    return;
                }

                if (
                    convertThousanSepInNumber(value) >
                    convertThousanSepInNumber(
                        this.loadForm.get('baseRate').value
                    )
                ) {
                    this.loadModalBill.adjusted = 0;
                    this.loadForm.get('adjustedRate').reset();
                } else {
                    this.loadModalBill.adjusted =
                        convertThousanSepInNumber(value);
                }
            });

        this.loadForm
            .get('advancePay')
            .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((value) => {
                if (!this.loadForm.get('baseRate').value || !value) {
                    return;
                }

                if (
                    convertThousanSepInNumber(value) >
                    convertThousanSepInNumber(
                        this.loadForm.get('baseRate').value
                    )
                ) {
                    this.loadModalBill.advance = 0;
                    this.loadForm.get('advancePay').reset();
                    return;
                } else {
                    this.loadModalBill.advance =
                        convertThousanSepInNumber(value);
                }
            });

        this.loadForm
            .get('layoverRate')
            .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((value) => {
                this.loadModalBill.layover = convertThousanSepInNumber(value);
            });

        this.loadForm
            .get('lumperRate')
            .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((value) => {
                this.loadModalBill.lumper = convertThousanSepInNumber(value);
            });

        this.loadForm
            .get('fuelSurchargeRate')
            .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((value) => {
                this.loadModalBill.fuelSurcharge =
                    convertThousanSepInNumber(value);
            });

        this.loadForm
            .get('escortRate')
            .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((value) => {
                this.loadModalBill.escort = convertThousanSepInNumber(value);
            });

        this.loadForm
            .get('detentionRate')
            .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
            .subscribe((value) => {
                this.loadModalBill.detention = convertThousanSepInNumber(value);
            });
    }

    public onSelectAdditionalOption(option: any) {
        if (!this.loadForm.get('baseRate').value) {
            return;
        }
        option.active = !option.active;
    }

    // Load Stop
    public createNewExtraStop() {
        // 1. Set Config For Shipper in Extra Stop
        this.loadExtraStopsShipperInputConfig[this.loadExtraStops.length] = {
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
            dropdownWidthClass: 'w-col-606',
        };

        // 2. Set Config For Shipper Contacts in Extra Stop
        this.loadExtraStopsShipperContactsInputConfig[
            this.loadExtraStops.length
        ] = {
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
            dropdownWidthClass: 'w-col-344',
        };

        // If Load Stop Exist , just return
        // const existLoadStop = this.loadExtraStops().controls.find(
        //     (item) =>
        //         item.get('shipperId').value ===
        //         this.selectedPickupShipper.id
        // );

        // if (existLoadStop) {
        //     this.loadForm
        //         .get('dateFrom')
        //         .patchValue(existLoadStop.get('dateFrom').value, {
        //             emitEvent: false,
        //         });

        //     this.loadForm
        //         .get('dateTo')
        //         .patchValue(existLoadStop.get('dateTo').value, {
        //             emitEvent: false,
        //         });

        //     this.loadForm
        //         .get('timeFrom')
        //         .patchValue(existLoadStop.get('timeFrom').value, {
        //             emitEvent: false,
        //         });

        //     this.loadForm
        //         .get('timeTo')
        //         .patchValue(existLoadStop.get('timeTo').value, {
        //             emitEvent: false,
        //         });

        //     return;
        // }

        this.addLoadExtraStop();
    }

    public addLoadExtraStop() {
        // if (!this.selectedPickupShipper) {
        //     return;
        // }

        this.loadExtraStops().push(this.newLoadExtraStop());

        this.drawStopOnMap();

        this.closeAllLoadExtraStopExceptActive(
            this.loadExtraStops().controls[this.loadExtraStops().length - 1]
        );

        if (
            this.loadForm.get('dateFrom').value ||
            this.loadForm.get('dateTo').value ||
            this.loadForm.get('timeFrom').value ||
            this.loadForm.get('timeTo').value
        ) {
            this.loadForm
                .get('dateFrom')
                .patchValue(null, { emitEvent: false });
            this.loadForm.get('dateTo').patchValue(null, { emitEvent: false });
            this.loadForm
                .get('timeFrom')
                .patchValue(null, { emitEvent: false });
            this.loadForm.get('timeTo').patchValue(null, { emitEvent: false });
        }
    }

    public newLoadExtraStop(): FormGroup {
        return this.formBuilder.group({
            id: [null],
            stopType: ['Pickup'],
            stopOrder: [this.loadExtraStops().length + 1],
            shipperId: [null],
            dateFrom: [null],
            dateTo: [null],
            timeType: [null],
            timeFrom: [null],
            timeTo: [null],
            arrive: [null],
            depart: [null],
            longitude: [null], //this.selectedPickupShipper.longitude],
            latitude: [null], //this.selectedPickupShipper.latitude],
            // From legs
            legMiles: [null],
            legHours: [null],
            legMinutes: [null],
            totalLegMiles: [null],
            totalLegHours: [null],
            totalLegMinutes: [null],
            // -----------
            // Shipper Contact information
            address: [null],
            contact: [null],
            phone: [null],
            extensionPhone: [null],
            // -----------
            items: this.formBuilder.array([]),
            openClose: [true],
        });
    }

    public loadExtraStops(): FormArray {
        return this.loadForm.get('extraStops') as FormArray;
    }

    public removeLoadExtraStop(index: number) {
        this.loadExtraStops().removeAt(index);
        this.loadStopRoutes[0] = {
            routeColor: '#919191',
            stops: this.loadExtraStops()
                .controls.filter((item) => item)
                .map((item) => {
                    return {
                        lat: item.get('latitude').value,
                        long: item.get('longitude').value,
                        empty: true,
                    };
                }),
        };
    }

    public closeAllLoadExtraStopExceptActive(loadStop: AbstractControl) {
        this.isActivePickupStop = false;
        this.isActiveDeliveryStop = false;

        this.loadExtraStops().controls.map((item) => {
            if (
                item.get('stopOrder').value === loadStop.get('stopOrder').value
            ) {
                item.get('openClose').patchValue(true);
            } else {
                item.get('openClose').patchValue(false);
            }
        });
    }

    // Load Stop Details (Items)
    public addLoadStopDetails(id: number) {
        this.loadStopsDetails(id).push(this.newLoadStopDetails());
    }

    public loadStopsDetails(loadStopIndex: number): FormArray {
        return this.loadExtraStops()
            .at(loadStopIndex)
            .get('items') as FormArray;
    }

    public newLoadStopDetails(): FormGroup {
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

    public removeLoadStopDetails(
        loadStopIndex: number,
        loadStopDetailsIndex: number
    ) {
        this.loadStopsDetails(loadStopIndex).removeAt(loadStopDetailsIndex);
    }

    // Draw Routes on Map
    public drawStopOnMap() {
        this.routingService
            .apiRoutingGet(
                this.loadExtraStops().length > 1
                    ? JSON.stringify(
                          this.loadExtraStops()
                              .controls.filter((item) => item)
                              .map((item) => {
                                  return {
                                      longitude: item.get('longitude').value,
                                      latitude: item.get('latitude').value,
                                  };
                              })
                      )
                    : JSON.stringify({
                          longitude: this.selectedPickupShipper.longitude,
                          latitude: this.selectedPickupShipper.latitude,
                      })
            )
            .pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe({
                next: (res: RoutingResponse) => {
                    // TODO: Populate lat and long with routesPoints
                    this.loadStopRoutes[0] = {
                        routeColor: '#919191',
                        stops: this.loadExtraStops()
                            .controls.filter((item) => item)
                            .map((item, index) => {
                                return {
                                    lat: item.get('latitude').value,
                                    long: item.get('longitude').value,
                                    empty: index === 0,
                                };
                            }),
                    };

                    this.loadExtraStops().controls.forEach(
                        (element: FormGroup, index: number) => {
                            if (index === 0) {
                                element.get('legMiles').patchValue(null);
                                element.get('legHours').patchValue(null);
                                element.get('legMinutes').patchValue(null);
                                return;
                            }
                            // index - 1, because firstStop was skipped
                            element
                                .get('legMiles')
                                .patchValue(res.legs[index - 1].miles);
                            element
                                .get('legHours')
                                .patchValue(res.legs[index - 1].hours);
                            element
                                .get('legMinutes')
                                .patchValue(res.legs[index - 1].minutes);

                            if (!element.get('totalLegMiles').value) {
                                element.get('totalLegMiles').patchValue(
                                    res.legs
                                        .map((item) => item.miles)
                                        .reduce((accumulator, item) => {
                                            return (accumulator += item);
                                        }, 0)
                                );

                                element.get('totalLegHours').patchValue(
                                    res.legs
                                        .map((item) => item.hours)
                                        .reduce((accumulator, item) => {
                                            return (accumulator += item);
                                        }, 0)
                                );

                                element.get('totalLegMinutes').patchValue(
                                    res.legs
                                        .map((item) => item.minutes)
                                        .reduce((accumulator, item) => {
                                            return (accumulator += item);
                                        }, 0)
                                );
                            }
                        }
                    );
                },
                error: () => {},
            });
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
                    console.log('dropdown load: ', res);
                    this.loadNumber = res.loadNumber;

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
                                    owner: index === 1 || index === 3,
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
                                fullName: item.driver?.firstName
                                    ?.concat(' ', item.driver?.lastName)
                                    .concat(
                                        ' ',
                                        item.coDriver?.firstName?.concat(
                                            ' ',
                                            item.coDriver?.lastName
                                        )
                                    )
                                    .concat(' ', item.truck?.truckNumber)
                                    .concat(' ', item.trailer?.trailerNumber),
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
                            name: item,
                        };
                    });

                    // Shipper
                    this.labelsShippers = res.shippers.map((item) => {
                        return {
                            ...item,
                            name: item?.businessName,
                            address: item.address?.city
                                .concat(', ', item.address?.stateShortName)
                                .concat(' ', item.address?.zipCode),
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
                    this.additionalBillingTypes =
                        res.additionalBillingTypes.map((item) => {
                            return {
                                id: null,
                                additionalBillingType: item.id,
                                name: item.name,
                                active: false,
                            };
                        });
                },
                error: () => {},
            });
    }

    private getLoadById(id: number) {
        console.log('id: ', id);
    }

    private addLoad() {
        const { ...form } = this.loadForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

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
            adjustedRate: convertThousanSepInNumber(form.adjustedRate),
            advancePay: convertThousanSepInNumber(form.advancePay),
            additionalBillingRates: this.premmapedAdditionalBillingRate(),
            stops: this.premmapedStops() as any,
            files: documents,
        };

        this.loadService
            .createLoad(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private updateLoad(id: number) {
        console.log(id);
    }

    private saveLoadTemplate() {
        const { ...form } = this.loadForm.value;
        const newData: CreateLoadTemplateCommand = {
            name: '',
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
            dateCreated: moment(new Date()).toISOString(true),
            dispatchId: this.selectedDispatches
                ? this.selectedDispatches.id
                : null,
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
            adjustedRate: convertThousanSepInNumber(form.adjustedRate),
            advancePay: convertThousanSepInNumber(form.advancePay),
            additionalBillingRates: this.premmapedAdditionalBillingRate(),
            stops: this.premmapedStops() as any,
        };

        this.loadService
            .createLoadTemplate(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'load-template',
                        status: false,
                    });
                },
                error: () => {},
            });
    }

    private premmapedAdditionalBillingRate() {
        return this.additionalBillingTypes.map((item) => {
            return {
                id: item.id ? item.id : null,
                additionalBillingType: item.additionalBillingType,
                rate:
                    item.additionalBillingType === 1
                        ? this.loadForm.get('layoverRate').value
                            ? convertThousanSepInNumber(
                                  this.loadForm.get('layoverRate').value
                              )
                            : null
                        : item.additionalBillingType === 2
                        ? this.loadForm.get('lumperRate').value
                            ? convertThousanSepInNumber(
                                  this.loadForm.get('lumperRate').value
                              )
                            : null
                        : item.additionalBillingType === 3
                        ? this.loadForm.get('fuelSurchargeRate').value
                            ? convertThousanSepInNumber(
                                  this.loadForm.get('fuelSurchargeRate').value
                              )
                            : null
                        : item.additionalBillingType === 4
                        ? this.loadForm.get('escortRate').value
                            ? convertThousanSepInNumber(
                                  this.loadForm.get('escortRate').value
                              )
                            : null
                        : item.additionalBillingType === 5
                        ? this.loadForm.get('detentionRate').value
                            ? convertThousanSepInNumber(
                                  this.loadForm.get('detentionRate').value
                              )
                            : null
                        : null,
            };
        });
    }

    private premmapedStops() {
        const timeTypePicked = null;
        // this.stopTimeTabs.find(
        //     (item) => item.id === this.selectedStopTime
        // ).name;
        return this.loadExtraStops().controls.map((item, index) => {
            return {
                id: null,
                stopOrder: item.get('stopOrder').value,
                shipperId: item.get('shipperId').value,
                dateFrom: convertDateToBackend(item.get('dateFrom').value),
                dateTo: item.get('dateTo').value
                    ? convertDateToBackend(item.get('dateTo').value)
                    : null,
                timeType:
                    timeTypePicked === 'APPT' ? 'Appointment' : timeTypePicked,
                timeFrom: item.get('timeFrom').value,
                timeTo: item.get('timeTo').value,
                arrive: null,
                depart: null,
                // From legs
                legMiles: item.get('legMiles').value,
                legHours: item.get('legHours').value,
                legMinutes: item.get('legMinutes').value,
                totalLegMiles: item.get('totalLegMiles').value,
                totalLegHours: item.get('totalLegHours').value,
                totalLegMinutes: item.get('totalLegMinutes').value,
                // -----------
                // Shipper Contact information
                // address: ['3905 Elliot Ave, Springdale, GA 72762, USA'],
                // contact: ['A. Djordjevic'],
                // phone: ['(987) 654-3210'],
                // extensionPhone: ['444'],
                // -----------
                items: this.loadStopsDetails(index).controls.map(
                    (item, index) => {
                        return {
                            id: item.get('id').value,
                            bolNumber: item.get('bolNumber').value,
                            appointmentNumber:
                                item.get('appointmentNumber').value,
                            pickupNumber: item.get('pickupNumber').value,
                            poNumber: item.get('poNumber').value,
                            sealNumber: item.get('sealNumber').value,
                            weight: item.get('weight').value
                                ? convertThousanSepInNumber(
                                      item.get('weight').value
                                  )
                                : null,
                            length: item.get('length').value
                                ? convertThousanSepInNumber(
                                      item.get('length').value
                                  )
                                : null,
                            height: item.get('height').value
                                ? convertThousanSepInNumber(
                                      item.get('height').value
                                  )
                                : null,
                            temperature: item.get('temperature').value
                                ? convertThousanSepInNumber(
                                      item.get('temperature').value
                                  )
                                : null,
                            description: item.get('description').value,
                            code: item.get('code').value,
                            quantity: item.get('quantity').value
                                ? convertThousanSepInNumber(
                                      item.get('quantity').value
                                  )
                                : null,
                            units: this.selectedLoadDetailsUnits[index]
                                ? this.selectedLoadDetailsUnits[index].id
                                : null,
                            secure: this.selectedLoadDetailsStrapChain[index]
                                ? this.selectedLoadDetailsStrapChain[index].id
                                : null,
                            tarp: this.selectedLoadDetailsTarps[index]
                                ? this.selectedLoadDetailsTarps[index].id
                                : null,
                            stackable: this.selectedLoadDetailsStackable[index]
                                ? this.selectedLoadDetailsStackable[index].id
                                : null,
                            driverAssist: this.selectedLoadDetailsDriverAssis[
                                index
                            ]
                                ? this.selectedLoadDetailsDriverAssis[index].id
                                : null,
                            hazardousMaterialId: this
                                .selectedLoadDetailsHazardous[index]
                                ? this.selectedLoadDetailsHazardous[index].id
                                : null,
                        };
                    }
                ),
            };
        });
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
            .subscribe({
                next: () => {},
                error: () => {},
            });
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
            .subscribe({
                next: () => {},
                error: () => {},
            });
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
