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
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';

import { FormService } from '../../../services/form/form.service';
import { LoadTService } from '../../load/state/load.service';
import { LoadModalResponse } from '../../../../../../appcoretruckassist';
import { NotificationService } from '../../../services/notification/notification.service';
import { CommentsService } from '../../../services/comments/comments.service';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import { ITaInput } from '../../shared/ta-input/ta-input.config';

import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { descriptionValidation } from '../../shared/ta-input/ta-input.regex-validations';
import { ILoadStatus } from './load-modal-statuses/load-modal-statuses.component';
import {
    convertDateToBackend,
    convertThousanSepInNumber,
} from '../../../utils/methods.calculations';
import moment from 'moment';
import { CreateLoadTemplateCommand } from '../../../../../../appcoretruckassist/model/createLoadTemplateCommand';
import { convertTimeFromBackend } from '../../../utils/methods.calculations';
@Component({
    selector: 'app-load-modal',
    templateUrl: './load-modal.component.html',
    styleUrls: ['./load-modal.component.scss'],
    providers: [ModalService, FormService],
})
export class LoadModalComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('originTab') originRef: ElementRef;
    @Input() editData: any;

    public loadForm: FormGroup;
    public isFormDirty: boolean;

    public selectedTab: number = 1;
    public headerTabs = [
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

    public selectedStopTab: number = 3;
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

    public selectedStopTime: number = 5;
    public stopTimeTabs = [
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
    public labelsBroker: any[] = [];
    public labelsBrokerContacts: any[] = [];
    public originBrokerContacts: any[] = [];
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
    public selectedBroker: any = null;
    public selectedBrokerContact: any = null;
    public selectedTruckReq: any = null;
    public selectedTrailerReq: any = null;
    public selectedDoorType: any = null;
    public selectedSuspension: any = null;
    public selectedTrailerLength: any = null;
    public selectedYear: any = null;
    public selectedShipper: any = null;

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

    public loadBrokerContactsInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Contact', 'Phone', 'Ext'],
            customClass: 'load-broker-contact',
        },
        textTransform: 'uppercase',
        isDropdown: true,
        dropdownWidthClass: 'w-col-391',
    };

    public loadDispatchesTTDInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Truck #', 'Trailer #', 'Driver'],
            customClass: 'load-dispatches-ttd',
        },
        textTransform: 'capitalize',
        isDropdown: true,
        dropdownWidthClass: 'w-col-397',
    };

    public loadShipperInputConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        multipleLabel: {
            labels: ['Shipper', 'Location'],
            customClass: 'load-shipper',
        },
        textTransform: 'uppercase',
        isDropdown: true,
        isRequired: true,
        dropdownWidthClass: 'w-col-696',
    };

    public additionalBillingTypes: any[] = [];

    public isAvailableAdjustedRate: boolean = false;
    public isAvailableAdvanceRate: boolean = false;

    public documents: any[] = [];
    public comments: any[] = [];

    public loadStopRoutes: {
        routeColor: string;
        stops: {
            lat: number;
            long: number;
            stopColor: string;
            empty: boolean;
        }[];
    }[] = [];

    public loadCreateStatuses: ILoadStatus[] = [
        {
            id: 1,
            name: 'BOOKED',
            active: true,
            color: '#C1C1C1',
        },
        {
            id: 2,
            name: 'UNASSIGNED',
            active: false,
            color: '#C1C1C1',
        },
        {
            id: 3,
            name: 'ASSIGNED',
            active: false,
            color: '#9F9F9F',
        },
    ];

    public companyUser: SignInResponse = null;

    public isDateRange: boolean = false;

    public isHazardousPicked: boolean = false;
    public isHazardousVisible: boolean = false;

    public additionalPartHeight: any;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private commentsService: CommentsService,
        private routingService: RoutingService,
        private loadService: LoadTService,
        private notificationService: NotificationService,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.companyUser = JSON.parse(localStorage.getItem('user'));
        this.createForm();
        this.getLoadDropdowns();

        this.trackBillingPayment();
        this.trackStopInformation();
    }

    ngAfterViewInit(): void {
        const timeout = setTimeout(() => {
            this.additionalPartHeight =
                this.originRef?.nativeElement?.clientHeight + 118 + 'px';
            clearTimeout(timeout);
        }, 150);
    }

    private createForm() {
        this.loadForm = this.formBuilder.group({
            loadTemplateId: [null],
            dispatcherId: [null],
            companyId: [this.companyUser.companyName, Validators.required],
            dispatchId: [null],
            referenceNumber: [null, Validators.required],
            generalCommodity: [null],
            weight: [null], // convert in number
            brokerId: [null, Validators.required],
            brokerContactId: [null],
            // loadRequirements
            truckTypeId: [null],
            trailerTypeId: [null],
            doorType: [null],
            suspension: [null],
            trailerLengthId: [null],
            year: [null],
            liftgate: [null],
            // ----------------
            shipper: [null, Validators.required],
            dateFrom: [null, Validators.required],
            dateTo: [null],
            timeFrom: [null, Validators.required],
            timeTo: [null, Validators.required],
            baseRate: [null, Validators.required], // convert in number
            adjustedRate: [null], // convert in number
            advancePay: [null], // convert in number
            layoverRate: [null],
            lumperRate: [null],
            fuelSurchargeRate: [null],
            escortRate: [null],
            detentionRate: [null],
            stops: this.formBuilder.array([]),
            note: [null],
        });

        this.formService.checkFormChange(this.loadForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalHeaderTabChange(event: any): void {
        this.selectedTab = event.id;
    }

    public onTabChange(event: any, action: string) {
        switch (action) {
            case 'stop-tab': {
                this.selectedStopTab = event.id;
                break;
            }
            case 'stop-time': {
                this.selectedStopTime = event.id;
                if (this.selectedStopTime === 6) {
                    this.inputService.changeValidators(
                        this.loadForm.get('timeTo'),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.loadForm.get('timeTo')
                    );
                }
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
            case 'delete': {
                if (this.editData) {
                    this.deleteLoadById(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
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
            case 'template': {
                this.selectedTemplate = event;
                break;
            }
            case 'dispatcher': {
                this.selectedDispatcher = event;

                if (this.selectedDispatcher) {
                    this.loadCreateStatuses = this.loadCreateStatuses.map(
                        (item) => {
                            return {
                                ...item,
                                active: item.name === 'UNASSIGNED',
                            };
                        }
                    );
                    this.labelsDispatches = this.originLabelsDispatches.filter(
                        (item) =>
                            item.dispatcherId === this.selectedDispatcher.id
                    );
                    this.selectedDispatches = null;
                    this.loadForm.get('dispatchId').patchValue(null);
                } else {
                    this.labelsDispatches = this.originLabelsDispatches;
                    this.loadCreateStatuses = this.loadCreateStatuses.map(
                        (item) => {
                            return {
                                ...item,
                                active:
                                    item.name === 'BOOKED' &&
                                    !this.selectedDispatches,
                            };
                        }
                    );
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
            case 'broker': {
                this.selectedBroker = event;

                if (this.selectedBroker) {
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

                    this.selectedBrokerContact = {
                        ...this.labelsBrokerContacts[1].contacts[0],
                        name: this.labelsBrokerContacts[1].contacts[0]?.contactName
                            ?.concat(
                                ' ',
                                this.labelsBrokerContacts[1].contacts[0]?.phone
                            )
                            .concat(
                                ' ',
                                this.labelsBrokerContacts[1].contacts[0]
                                    ?.extensionPhone
                            ),
                    };

                    this.loadForm
                        .get('brokerContactId')
                        .patchValue(this.selectedBrokerContact.name);

                    this.loadBrokerContactsInputConfig = {
                        ...this.loadBrokerContactsInputConfig,
                        multipleInputValues: {
                            options: [
                                {
                                    value: this.labelsBrokerContacts[1]
                                        .contacts[0].name,
                                    logoName: null,
                                },
                                {
                                    value: this.labelsBrokerContacts[1]
                                        .contacts[0].phone,
                                    logoName: null,
                                },
                                {
                                    value: this.labelsBrokerContacts[1]
                                        .contacts[0].extensionPhone,
                                    logoName: null,
                                },
                            ],
                            customClass: 'load-broker-contact',
                        },
                    };
                } else {
                    this.labelsBrokerContacts = this.originBrokerContacts;
                }
                break;
            }
            case 'broker-contact': {
                if (event) {
                    this.selectedBrokerContact = {
                        ...event,
                        name: event?.name
                            ?.concat(' ', event?.phone)
                            .concat(' ', event?.extensionPhone),
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
                                    value: event.phone,
                                    logoName: null,
                                },
                                {
                                    value: event.extensionPhone,
                                    logoName: null,
                                },
                            ],
                            customClass: 'load-broker-contact',
                        },
                        blackInput: true,
                    };
                } else {
                    this.loadBrokerContactsInputConfig.multipleInputValues =
                        null;
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

                    this.loadCreateStatuses = this.loadCreateStatuses.map(
                        (item) => {
                            return {
                                ...item,
                                active:
                                    item.name === 'ASSIGNED' &&
                                    this.selectedDispatcher,
                            };
                        }
                    );

                    this.loadDispatchesTTDInputConfig = {
                        ...this.loadDispatchesTTDInputConfig,
                        multipleInputValues: {
                            options: [
                                {
                                    value: event?.truck?.name,
                                    logoName: null,
                                },
                                {
                                    value: event?.trailer?.name,
                                    logoName: null,
                                },
                                {
                                    value: event?.driver?.name,
                                    logoName: event?.driver?.logoName
                                        ? event?.driver?.logoName
                                        : 'no-url',
                                },
                            ],
                            customClass: 'load-dispatches-ttd',
                        },
                        blackInput: true,
                    };
                } else {
                    this.loadDispatchesTTDInputConfig.multipleInputValues =
                        null;
                    this.loadCreateStatuses = this.loadCreateStatuses.map(
                        (item) => {
                            return {
                                ...item,
                                active: item.name === 'UNASSIGNED',
                            };
                        }
                    );
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
            case 'shipper': {
                if (event) {
                    // If Load Stops Doesn't exist, but 'delivery' is first picked just return

                    if (
                        !this.loadStops().length &&
                        this.selectedStopTab === 4
                    ) {
                        return;
                    } else {
                        this.selectedShipper = event;
                        this.createNewStop();
                    }
                } else {
                    this.loadShipperInputConfig.multipleInputValues = null;
                }
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

    public commandEvent() {
        this.isHazardousVisible = !this.isHazardousVisible;
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
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
                    this.notificationService.success(
                        'Comment successfully created.',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Comment can't be created.",
                        'Error:'
                    );
                },
            });
    }

    public deleteComment(comments: ReviewCommentModal) {
        this.comments = comments.sortData;
        this.commentsService
            .deleteCommentById(comments.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Comment successfully deleted.',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Comment cant't be deleted.",
                        'Error:'
                    );
                },
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
                next: () => {
                    this.notificationService.success(
                        'Comment successfully updated.',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Comment cant't be updated.",
                        'Error:'
                    );
                },
            });
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    public onSelectAdditionalOption(option: any) {
        if (!this.loadForm.get('baseRate').value) {
            return;
        }
        option.active = !option.active;
    }

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

    public trackStopInformation() {
        this.loadForm
            .get('dateFrom')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const stop = this.loadStops().controls.find(
                    (item) =>
                        item.get('shipperId').value === this.selectedShipper.id
                );

                if (stop && !stop.get('dateFrom').value) {
                    stop.get('dateFrom').patchValue(value);
                }
            });

        this.loadForm
            .get('dateTo')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const stop = this.loadStops().controls.find(
                    (item) =>
                        item.get('shipperId').value === this.selectedShipper.id
                );
                if (stop && !stop.get('dateTo').value) {
                    stop.get('dateTo').patchValue(value);
                }
            });

        this.loadForm
            .get('timeFrom')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const stop = this.loadStops().controls.find(
                    (item) =>
                        item.get('shipperId').value === this.selectedShipper.id
                );
                if (stop && !stop.get('timeFrom').value) {
                    stop.get('timeFrom').patchValue(value);
                }
            });

        this.loadForm
            .get('timeTo')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                const stop = this.loadStops().controls.find(
                    (item) =>
                        item.get('shipperId').value === this.selectedShipper.id
                );
                if (stop && !stop.get('timeTo').value) {
                    stop.get('timeTo').patchValue(value);
                }
            });
    }

    public closeAllLoadStopExceptActive(loadStop: AbstractControl) {
        this.loadStops().controls.map((item) => {
            if (
                item.get('stopOrder').value === loadStop.get('stopOrder').value
            ) {
                item.get('openClose').patchValue(true);
            } else {
                item.get('openClose').patchValue(false);
            }
        });
    }

    public toggleLoadStop(loadStop: AbstractControl) {
        loadStop.get('openClose').patchValue(!loadStop.get('openClose').value);

        if (loadStop.get('openClose').value) {
            this.closeAllLoadStopExceptActive(loadStop);

            this.selectedShipper = this.labelsShippers.find(
                (item) => item.id === loadStop.get('shipperId').value
            );
            this.loadShipperInputConfig = {
                ...this.loadShipperInputConfig,
                multipleInputValues: {
                    options: [
                        {
                            value: this.selectedShipper.name,
                            logoName: null,
                        },
                        {
                            value: this.selectedShipper.address,
                            logoName: null,
                        },
                    ],
                    customClass: 'load-shipper',
                },
            };

            this.loadForm
                .get('dateFrom')
                .patchValue(loadStop.get('dateFrom').value);
            this.loadForm
                .get('dateTo')
                .patchValue(loadStop.get('dateTo').value);

            if (loadStop.get('timeFrom').value) {
                this.loadForm
                    .get('timeFrom')
                    .patchValue(
                        convertTimeFromBackend(loadStop.get('timeFrom').value)
                    );
            }
            if (loadStop.get('timeTo').value) {
                this.loadForm
                    .get('timeTo')
                    .patchValue(
                        convertTimeFromBackend(loadStop.get('timeTo').value)
                    );
            }
        } else {
            this.selectedShipper = null;
            this.loadShipperInputConfig = {
                ...this.loadShipperInputConfig,
                multipleInputValues: {
                    options: [
                        {
                            value: null,
                            logoName: null,
                        },
                        {
                            value: null,
                            logoName: null,
                        },
                    ],
                    customClass: 'load-shipper',
                },
            };
            this.loadForm
                .get('shipperId')
                .patchValue(null, { emitEvent: false });
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

    public drawStopOnMap() {
        if (this.loadStops().length > 1) {
            this.routingService
                .apiRoutingGet(
                    JSON.stringify(
                        this.loadStops()
                            .controls.filter((item) => item)
                            .map((item) => {
                                return {
                                    longitude: item.get('longitude').value,
                                    latitude: item.get('latitude').value,
                                };
                            })
                    )
                )
                .pipe(debounceTime(1000), takeUntil(this.destroy$))
                .subscribe({
                    next: (res: RoutingResponse) => {
                        // TODO: Populate lat and long with routesPoints
                        this.loadStopRoutes[0] = {
                            routeColor: '#919191',
                            stops: this.loadStops()
                                .controls.filter((item) => item)
                                .map((item, index) => {
                                    return {
                                        lat: item.get('latitude').value,
                                        long: item.get('longitude').value,
                                        stopColor:
                                            item.get('stopType').value ===
                                            'Pickup'
                                                ? '#4db6a2'
                                                : '#ef5350',
                                        empty: index === 0,
                                    };
                                }),
                        };

                        this.loadStops().controls.forEach(
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
                    error: (err: any) => {
                        console.log(err);
                    },
                });
        }
    }

    // Load Stop
    public createNewStop() {
        if (this.selectedShipper) {
            this.loadShipperInputConfig = {
                ...this.loadShipperInputConfig,
                multipleInputValues: {
                    options: [
                        {
                            value: this.selectedShipper.name,
                            logoName: null,
                        },
                        {
                            value: this.selectedShipper.address,
                            logoName: null,
                        },
                    ],
                    customClass: 'load-shipper',
                },
            };

            // If Load Stop Exist , just return
            const existLoadStop = this.loadStops().controls.find(
                (item) =>
                    item.get('shipperId').value === this.selectedShipper.id
            );

            if (existLoadStop) {
                this.loadForm
                    .get('dateFrom')
                    .patchValue(existLoadStop.get('dateFrom').value, {
                        emitEvent: false,
                    });

                this.loadForm
                    .get('dateTo')
                    .patchValue(existLoadStop.get('dateTo').value, {
                        emitEvent: false,
                    });

                this.loadForm
                    .get('timeFrom')
                    .patchValue(existLoadStop.get('timeFrom').value, {
                        emitEvent: false,
                    });

                this.loadForm
                    .get('timeTo')
                    .patchValue(existLoadStop.get('timeTo').value, {
                        emitEvent: false,
                    });

                return;
            }

            this.addLoadStop();
        }
    }

    public addLoadStop() {
        this.loadStops().push(this.newLoadStop());
        this.drawStopOnMap();
        this.closeAllLoadStopExceptActive(
            this.loadStops().controls[this.loadStops().length - 1]
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

    public newLoadStop(): FormGroup {
        return this.formBuilder.group({
            id: [null],
            stopType: [this.selectedStopTab === 3 ? 'Pickup' : 'Delivery'],
            stopOrder: [this.loadStops().length + 1],
            shipperId: [this.selectedShipper.id],
            dateFrom: [null], // convert for backend
            dateTo: [null], // convert for backend
            timeType: [
                this.stopTimeTabs.find(
                    (item) => item.id === this.selectedStopTime
                ).name,
            ],
            timeFrom: [null],
            timeTo: [null],
            arrive: [null], // null when create mode
            depart: [null], // null when create mode
            longitude: [this.selectedShipper.longitude],
            latitude: [this.selectedShipper.latitude],
            // From legs
            legMiles: [null],
            legHours: [null],
            legMinutes: [null],
            totalLegMiles: [null],
            totalLegHours: [null],
            totalLegMinutes: [null],
            // -----------
            // Shipper Contact information
            address: ['3905 Elliot Ave, Springdale, GA 72762, USA'],
            contact: ['A. Djordjevic'],
            phone: ['(987) 654-3210'],
            extensionPhone: ['444'],
            // -----------
            items: this.formBuilder.array([]),
            openClose: [true],
        });
    }

    public loadStops(): FormArray {
        return this.loadForm.get('stops') as FormArray;
    }

    public removeLoadStop(index: number) {
        this.loadStops().removeAt(index);
        this.loadStopRoutes[0] = {
            routeColor: '#919191',
            stops: this.loadStops()
                .controls.filter((item) => item)
                .map((item) => {
                    return {
                        lat: item.get('latitude').value,
                        long: item.get('longitude').value,
                        stopColor:
                            item.get('stopType').value === 'Pickup'
                                ? '#4db6a2'
                                : '#ef5350',
                        empty: true,
                    };
                }),
        };
    }

    // Load Stop Details
    public addLoadStopDetails(id: number) {
        this.loadStopsDetails(id).push(this.newLoadStopDetails());
    }

    public loadStopsDetails(loadStopIndex: number): FormArray {
        return this.loadStops().at(loadStopIndex).get('items') as FormArray;
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

    private getLoadDropdowns(id?: number) {
        this.loadService
            .getLoadDropdowns(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: LoadModalResponse) => {
                    this.loadNumber = res.loadNumber;

                    // Brokers
                    this.labelsBroker = res.brokers.map((item) => {
                        return {
                            ...item,
                            name: item?.businessName,
                            status: item.availableCreditType?.name,
                            logoName:
                                item?.dnu || item?.ban
                                    ? 'ic_load-broker-dnu-ban.svg'
                                    : 'ic_load-broker-credit.svg',
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
                                        extensionPhone: item.extensionPhone
                                            ? item.extensionPhone
                                            : '321',
                                    };
                                }),
                            };
                        });

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

                    if (this.selectedDispatcher) {
                        this.loadCreateStatuses = this.loadCreateStatuses.map(
                            (item) => {
                                return {
                                    ...item,
                                    active: item.name === 'UNASSIGNED',
                                };
                            }
                        );
                    }

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
                        res.dispatches.map((item) => {
                            return {
                                ...item,
                                driver: {
                                    ...item.driver,
                                    name: item.driver?.firstName?.concat(
                                        ' ',
                                        item.driver?.lastName
                                    ),
                                    logoName: item.driver?.avatar,
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
                                    name: `# ${item.truck?.truckNumber}`,
                                },
                                trailer: {
                                    ...item.trailer,
                                    name: `# ${item.trailer?.trailerNumber}`,
                                },
                            };
                        });

                    this.labelsDispatches = this.labelsDispatches.filter(
                        (item) =>
                            item?.dispatcherId === this.selectedDispatcher.id
                    );

                    // Door Type
                    this.labelsDoorType = res.doorTypes;
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
                            address: item.address?.address,
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
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
                },
            });
    }

    private getLoadById(id: number) {}

    private addLoad() {
        const { ...form } = this.loadForm.value;
        let newData: any = {
            type: this.headerTabs.find((item) => item.id === this.selectedTab)
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
        };

        this.loadService
            .createLoad(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Successfully created load',
                        'Success'
                    );
                },
                error: (error: any) => {
                    this.notificationService.success(
                        `Error: ${error}`,
                        'Error'
                    );
                },
            });
    }
    private updateLoad(id: number) {}

    private deleteLoadById(id: number) {}

    private saveLoadTemplate() {
        const { ...form } = this.loadForm.value;
        const newData: CreateLoadTemplateCommand = {
            name: '',
            type: this.headerTabs.find((item) => item.id === this.selectedTab)
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
                    this.notificationService.success(
                        'Successfully create load template.',
                        'Success'
                    );
                    this.modalService.setModalSpinner({
                        action: 'load-template',
                        status: false,
                    });
                },
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
                },
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
        const timeTypePicked = this.stopTimeTabs.find(
            (item) => item.id === this.selectedStopTime
        ).name;
        return this.loadStops().controls.map((item, index) => {
            return {
                id: null,
                stopType: item.get('stopType').value,
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
