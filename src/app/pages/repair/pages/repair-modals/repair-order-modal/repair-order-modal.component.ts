import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// bootstrap
import {
    NgbActiveModal,
    NgbModule,
    NgbPopover,
} from '@ng-bootstrap/ng-bootstrap';

// moment
import moment from 'moment';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// pipes
import { PriceCalculationArrayPipe } from '@pages/repair/pages/repair-modals/repair-order-modal/pipes/price-calculation-array.pipe';
import { ActiveItemsPipe } from '@shared/pipes/active-Items.pipe';
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { FormService } from '@shared/services/form.service';
import { EditTagsService } from '@shared/services/edit-tags.service';
import { RepairService } from '@shared/services/repair.service';

// validators
import {
    invoiceValidation,
    repairOdometerValidation,
    vehicleUnitValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// constants
import { RepairOrderConstants } from '@pages/repair/pages/repair-modals/repair-order-modal/utils/constants/repair-order.constant';

// enums
import { RepairOrderModalStringEnum } from '@pages/repair/pages/repair-modals/repair-order-modal/enums/repair-order-modal-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// components
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// models
import {
    RepairModalResponse,
    RepairResponse,
    RepairDriverResponse,
    TruckMinimalResponse,
    TrailerMinimalResponse,
    EnumValue,
    RepairShopShortResponse,
    RepairItemResponse,
} from 'appcoretruckassist';
import { RepairSubtotal } from '@pages/repair/pages/repair-modals/repair-order-modal/models/repair-subtotal.model';
import { Tabs } from '@shared/models/tabs.model';
import { TruckTrailerPmDropdownLists } from '@shared/models/truck-trailer-pm-dropdown-lists.model';
import { Subtotal } from '@pages/repair/pages/repair-modals/repair-order-modal/models/subtotal.model';

@Component({
    selector: 'app-repair-order-modal',
    templateUrl: './repair-order-modal.component.html',
    styleUrls: ['./repair-order-modal.component.scss'],
    providers: [PriceCalculationArrayPipe, ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        AngularSvgIconModule,

        // components
        TaAppTooltipV2Component,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputDropdownComponent,
        TaInputComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCopyComponent,
        TaModalTableComponent,

        // Pipe
        ActiveItemsPipe,
        FormatPhonePipe,
        PriceCalculationArrayPipe,
    ],
})
export class RepairOrderModalComponent implements OnInit, OnDestroy {
    @ViewChild('t2') public popoverRef: NgbPopover;

    @Input() editData: any;

    private destroy$ = new Subject<void>();

    public repairOrderForm: UntypedFormGroup;
    public isFormDirty: boolean = false;

    public isAddNewAfterSave: boolean = false;
    public isFinishOrder: boolean = false;

    public hideIconIndex: number = 0;

    // cards
    public isCardanimationDisabled: boolean = false;

    // tabs
    public headerTabs: Tabs[] = [];
    public unitTabs: Tabs[] = [];
    public serviceTabs: Tabs[] = [];

    public selectedHeaderTab: number = 1;

    public truckOrTrailer: string;

    // dropdowns
    public unitDropdownList: TruckMinimalResponse[] | TrailerMinimalResponse[] =
        [];
    public payTypeDropdownList: EnumValue[] = [];
    public driversDropdownList: RepairDriverResponse[] = [];
    public repairShopDropdownList: RepairShopShortResponse[] = [];
    public truckTrailerPmDropdownLists: TruckTrailerPmDropdownLists;

    public unitTrucks: TruckMinimalResponse[] = [];
    public unitTrailers: TrailerMinimalResponse[] = [];

    public selectedUnit: any = null;
    public selectedPayType: EnumValue;
    public selectedDriver: RepairDriverResponse;
    public selectedRepairShop: any = null;

    public isDriverSelected: boolean = false;

    // items
    public isRepairBillRowCreated: boolean = false;
    public isRepairOrderRowCreated: boolean = false;

    public isEachRepairRowValid: boolean = true;
    public isAnyRepairItemHasPmSelected: boolean = true;

    public repairItems: RepairItemResponse[] = [];
    public updateRepairItems: RepairItemResponse[] = [];
    public subtotal: Subtotal[] = [];
    public total: number = 0;

    // services
    public services: any[] = [];

    // documents
    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public isFileModified: boolean = false;

    public tags: any[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,

        // bootstrap
        private ngbActiveModal: NgbActiveModal,

        // change detector
        private changeDetector: ChangeDetectorRef,

        // services
        private inputService: TaInputService,
        private repairService: RepairService,
        private modalService: ModalService,
        private formService: FormService,
        private detailsDataService: DetailsDataService,
        private tagsService: EditTagsService,

        // pipes
        private priceArrayPipe: PriceCalculationArrayPipe
    ) {}

    ngOnInit() {
        console.log('editData', this.editData);
        this.createForm();

        this.getConstantData();

        this.monitorDateInput();

        this.checkIfTruckOrTrailerInit();

        if (!this.editData.data)
            setTimeout(() => {
                this.addItem();
            }, 500);
    }

    public trackByIdentity(_: number, item: any): string {
        return item.value;
    }

    private createForm(): void {
        this.repairOrderForm = this.formBuilder.group({
            repairType: [null],
            invoice: [null, [Validators.required, ...invoiceValidation]],
            date: [null, Validators.required],
            payType: [null],
            datePaid: [null],
            unitType: [RepairOrderModalStringEnum.TRUCK],
            unit: [null, [Validators.required, ...vehicleUnitValidation]],
            driver: [null],
            odometer: [null, repairOdometerValidation],
            repairShopId: [null, Validators.required],
            repairItems: [null],
            shopServiceType: [null],
            servicesHelper: [null],
            files: [null],
            tags: [null],
            note: [null],
            orderNumber: [null],
        });
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.repairOrderForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    private getConstantData(): void {
        this.headerTabs = JSON.parse(
            JSON.stringify(RepairOrderConstants.HEADER_TABS)
        );

        this.unitTabs = JSON.parse(
            JSON.stringify(RepairOrderConstants.UNIT_TABS)
        );

        this.serviceTabs = JSON.parse(
            JSON.stringify(RepairOrderConstants.SERVICE_TABS)
        );
    }

    private checkIfTruckOrTrailerInit(): void {
        const isTrailer = this.editData?.type
            ?.toLowerCase()
            ?.includes(RepairOrderModalStringEnum.TRAILER_2);

        if (!this.editData.data)
            this.onTabChange(this.unitTabs[isTrailer ? 1 : 0]);

        this.getRepairDropdowns(
            null,
            null,
            isTrailer
                ? RepairOrderModalStringEnum.TRAILERS
                : RepairOrderModalStringEnum.TRUCKS,
            false
        );
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        console.log('data', data);
        switch (data.action) {
            case RepairOrderModalStringEnum.CLOSE:
                break;
            case RepairOrderModalStringEnum.SVE_AND_ADD_NEW:
                if (this.repairOrderForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.repairOrderForm);

                    return;
                }

                this.addRepair();

                this.modalService.setModalSpinner({
                    action: RepairOrderModalStringEnum.SVE_AND_ADD_NEW,
                    status: true,
                    close: false,
                });

                this.isAddNewAfterSave = true;

                break;
            case RepairOrderModalStringEnum.SAVE:
                if (this.repairOrderForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.repairOrderForm);

                    return;
                }

                if (
                    this.editData.type.includes(RepairOrderModalStringEnum.EDIT)
                ) {
                    this.updateRepair(this.editData.data.id);
                } else {
                    this.addRepair();
                }

                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: false,
                });

                break;
            case RepairOrderModalStringEnum.DELETE:
                if (this.editData.data)
                    this.deleteRepairById(this.editData.data.id);

                break;
            case RepairOrderModalStringEnum.FINISH_ORDER:
                this.isFinishOrder = true;

                break;
            default:
                break;
        }
    }

    public onModalHeaderTabChange(event: Tabs): void {
        const previousValues = {
            ...this.repairOrderForm.value,
        };

        this.selectedHeaderTab = event.id;

        this.headerTabs = this.headerTabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });

        setTimeout(() => {
            this.detailsDataService.setUnitValue(
                this.repairOrderForm.get(RepairOrderModalStringEnum.UNIT)?.value
            );
        }, 100);

        if (event.id === 1) {
            this.inputService.changeValidators(
                this.repairOrderForm.get(RepairOrderModalStringEnum.INVOICE)
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get(RepairOrderModalStringEnum.DATE)
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get(
                    RepairOrderModalStringEnum.REPAIR_SHOP_ID
                )
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get(
                    RepairOrderModalStringEnum.ORDER_NUMBER
                ),
                false
            );
        } else {
            this.inputService.changeValidators(
                this.repairOrderForm.get(
                    RepairOrderModalStringEnum.ORDER_NUMBER
                )
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get(RepairOrderModalStringEnum.INVOICE),
                false
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get(RepairOrderModalStringEnum.DATE),
                false
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get(
                    RepairOrderModalStringEnum.REPAIR_SHOP_ID
                ),
                false
            );

            this.repairOrderForm.patchValue({
                date: previousValues.date,
            });
        }
    }

    public onTabChange(event: Tabs, action?: string, type?: string): void {
        if (type === RepairOrderModalStringEnum.SERVICE) {
            this.repairOrderForm
                .get(RepairOrderModalStringEnum.SHOP_SERVICE_TYPE)
                .patchValue(event.id);
        } else {
            this.truckOrTrailer = event.name;

            setTimeout(() => {
                this.unitTabs = this.unitTabs.map((item) => {
                    if (item.id === event.id) {
                        this.repairOrderForm
                            .get(RepairOrderModalStringEnum.UNIT_TYPE)
                            .patchValue(item.name);
                    }

                    return {
                        ...item,
                        checked: item.id === event.id,
                    };
                });

                this.unitDropdownList =
                    event.name === RepairOrderModalStringEnum.TRAILER
                        ? [...this.unitTrailers]
                        : [...this.unitTrucks];

                if (this.selectedHeaderTab === 1 && !action) {
                    this.inputService.changeValidators(
                        this.repairOrderForm.get(
                            RepairOrderModalStringEnum.ODOMETER
                        ),
                        this.isAnyRepairItemHasPmSelected
                    );
                }

                // if edit, return
                if (action) return;

                this.repairOrderForm.patchValue({
                    unit: null,
                    driver: null,
                    odometer: null,
                });

                this.selectedUnit = null;
                this.selectedDriver = null;
                this.driversDropdownList = [];
            }, 100);
        }
    }

    public onSelectDropDown(event: any, action: string): void {
        const { ...form } = this.repairOrderForm.value;

        switch (action) {
            case RepairOrderModalStringEnum.PAY_TYPE:
                if (event) {
                    this.selectedPayType = event;

                    this.inputService.changeValidators(
                        this.repairOrderForm.get(
                            RepairOrderModalStringEnum.DATE_PAID
                        ),
                        true,
                        [],
                        false
                    );
                } else {
                    this.selectedPayType = null;

                    this.repairOrderForm
                        .get(RepairOrderModalStringEnum.DATE_PAID)
                        .reset();

                    this.inputService.changeValidators(
                        this.repairOrderForm.get(
                            RepairOrderModalStringEnum.DATE_PAID
                        ),
                        false
                    );
                }

                break;
            case RepairOrderModalStringEnum.REPAIR_UNIT:
                if (event?.truckNumber) {
                    this.detailsDataService.setUnitValue(event.truckNumber);
                } else if (event?.trailerNumber) {
                    this.detailsDataService.setUnitValue(event.trailerNumber);
                }

                this.selectedUnit = event;

                this.unitTabs.find((item) => item.checked).name ===
                RepairOrderModalStringEnum.TRUCK
                    ? this.getRepairDropdowns(
                          this.selectedUnit?.id,
                          null,
                          RepairOrderModalStringEnum.TRUCKS,
                          true
                      )
                    : this.getRepairDropdowns(
                          null,
                          this.selectedUnit?.id,
                          RepairOrderModalStringEnum.TRAILERS,
                          true
                      );

                if (
                    this.repairOrderForm.get(RepairOrderModalStringEnum.DATE)
                        .value &&
                    this.repairOrderForm.get(RepairOrderModalStringEnum.DATE)
                        .valid &&
                    event
                )
                    this.getDrivers();

                if (!event) {
                    this.selectedDriver = null;

                    this.repairOrderForm
                        .get(RepairOrderModalStringEnum.DRIVER)
                        .reset();

                    this.inputService.changeValidators(
                        this.repairOrderForm.get(
                            RepairOrderModalStringEnum.ODOMETER
                        ),
                        false,
                        [],
                        false
                    );
                }

                break;
            case RepairOrderModalStringEnum.DRIVER:
                if (event) {
                    this.selectedDriver = event;
                } else {
                    this.selectedDriver = null;
                }

                break;
            case RepairOrderModalStringEnum.REPAIR_SHOP:
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();
                    this.modalService.setProjectionModal({
                        action: RepairOrderModalStringEnum.OPEN,
                        payload: {
                            key: RepairOrderModalStringEnum.REPAIR_MODAL,
                            value: {
                                ...form,
                                selectedUnit: this.selectedUnit,
                                services: this.services,
                                selectedRepairShop: this.selectedRepairShop,
                                headerTabs: this.headerTabs,
                                selectedHeaderTab: this.selectedHeaderTab,
                                typeOfRepair: this.unitTabs,
                            },
                        },
                        component: RepairShopModalComponent,
                        size: RepairOrderModalStringEnum.SMALL,
                        type: this.repairOrderForm.get(
                            RepairOrderModalStringEnum.UNIT_TYPE
                        ).value,
                    });
                } else {
                    this.selectedRepairShop = event;

                    if (this.selectedRepairShop) {
                        this.repairOrderForm.patchValue({
                            repairShopId: this.selectedRepairShop.id,
                        });

                        this.repairService
                            .getRepairShopById(this.selectedRepairShop.id)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe((res) => {
                                this.selectedRepairShop = {
                                    id: res.id,
                                    name: res.name,
                                    phone: res.phone,
                                    email: res.email,
                                    address: res.address.address,
                                    shopServiceType: res.shopServiceType,
                                };

                                this.repairOrderForm
                                    .get(
                                        RepairOrderModalStringEnum.SHOP_SERVICE_TYPE
                                    )
                                    .patchValue(
                                        this.selectedRepairShop.shopServiceType
                                            .id
                                    );

                                this.serviceTabs = this.serviceTabs.map(
                                    (serviceTab) => {
                                        return {
                                            ...serviceTab,
                                            checked:
                                                serviceTab.id ===
                                                res.shopServiceType.id,
                                        };
                                    }
                                );

                                this.services = res.serviceTypes.map(
                                    (service) => {
                                        return {
                                            id: service.serviceType.id,
                                            serviceType:
                                                service.serviceType.name,
                                            svg: `assets/svg/common/repair-services/${service.logoName}`,
                                            active: service.active,
                                            isSelected: service.isSelected,
                                        };
                                    }
                                );
                            });
                    }
                }
                break;
            default:
                break;
        }
    }

    public onFilesEvent(event: any): void {
        switch (event.action) {
            case RepairOrderModalStringEnum.ADD:
                this.documents = event.files;

                this.repairOrderForm
                    .get(RepairOrderModalStringEnum.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case RepairOrderModalStringEnum.DELETE:
                this.documents = event.files;

                this.repairOrderForm
                    .get(RepairOrderModalStringEnum.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                if (event.deleteId) this.filesForDelete.push(event.deleteId);

                this.isFileModified = true;

                break;
            case RepairOrderModalStringEnum.TAG:
                let isTagChanged = false;

                event.files.map((item) => {
                    if (item.tagChanged) isTagChanged = true;
                });

                this.repairOrderForm
                    .get(RepairOrderModalStringEnum.TAGS)
                    .patchValue(isTagChanged ? true : null);

                break;
            default:
                break;
        }
    }

    public monitorDateInput(): void {
        this.repairOrderForm
            .get(RepairOrderModalStringEnum.DATE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (!res) {
                    this.selectedDriver = null;

                    this.repairOrderForm
                        .get(RepairOrderModalStringEnum.DRIVER)
                        .reset();
                } else {
                    if (this.selectedUnit) this.getDrivers();
                }
            });
    }

    public addItem(): void {
        if (!this.isEachRepairRowValid) return;

        this.isRepairBillRowCreated = true;
        this.isRepairOrderRowCreated = true;

        setTimeout(() => {
            this.isRepairBillRowCreated = false;
            this.isRepairOrderRowCreated = false;
        }, 400);

        this.changeDetector.detectChanges();
    }

    public handleModalTableValueEmit(
        modalTableDataValue: RepairItemResponse[]
    ): void {
        this.repairItems = modalTableDataValue;

        setTimeout(() => {
            if (this.selectedHeaderTab === 1) {
                this.isAnyRepairItemHasPmSelected = this.repairItems.some(
                    (repairItem) =>
                        repairItem?.pmTruck?.id || repairItem?.pmTrailer?.id
                );

                const odometerControl = this.repairOrderForm.get(
                    RepairOrderModalStringEnum.ODOMETER
                );

                this.inputService.changeValidators(
                    odometerControl,
                    this.isAnyRepairItemHasPmSelected
                );
            }
        }, 300);

        this.repairOrderForm
            .get(RepairOrderModalStringEnum.REPAIR_ITEMS)
            .patchValue(JSON.stringify(this.repairItems));

        this.changeDetector.detectChanges();
    }

    public handleModalTableValidStatusEmit(
        isEachRepairItemsRowValid: boolean
    ): void {
        this.isEachRepairRowValid = isEachRepairItemsRowValid;
    }

    public getTotalCostValueEmit(event: RepairSubtotal[]): void {
        let total = 0;

        event.forEach((item: RepairSubtotal) => {
            total += item.subtotal;
        });

        this.total = total;
    }

    public handleServiceActiveClick(service: any): void {
        service.isSelected = !service.isSelected;

        this.repairOrderForm
            .get(RepairOrderModalStringEnum.SERVICES_HELPER)
            .patchValue(JSON.stringify(this.services));
    }

    public resetActiveServices(): void {
        this.services = this.services.map((service) => {
            return {
                ...service,
                active: false,
                isSelected: false,
            };
        });
    }

    public openRepairShop(): void {
        this.ngbActiveModal.close();

        this.modalService.setProjectionModal({
            action: RepairOrderModalStringEnum.OPEN,
            payload: {
                key: RepairOrderModalStringEnum.REPAIR_MODAL,
                value: {
                    ...this.repairOrderForm.value,
                    selectedUnit: this.selectedUnit,
                    services: this.services,
                    selectedRepairShop: this.selectedRepairShop,
                    headerTabs: this.headerTabs,
                    selectedHeaderTab: this.selectedHeaderTab,
                    typeOfRepair: this.unitTabs,
                    editRepairShop: true,
                },
                id: this.selectedRepairShop.id,
            },
            component: RepairShopModalComponent,
            size: RepairOrderModalStringEnum.SMALL,
            type: this.repairOrderForm.get(RepairOrderModalStringEnum.UNIT_TYPE)
                .value,
        });
    }

    public getDrivers(): void {
        const formatedDate = moment(
            this.repairOrderForm.get(RepairOrderModalStringEnum.DATE).value,
            RepairOrderModalStringEnum.FORMAT_DATE
        ).format(RepairOrderModalStringEnum.FORMAT_DATE_1);

        let truckId: number;
        let trailerId: number;

        if (this.truckOrTrailer === RepairOrderModalStringEnum.TRUCK) {
            truckId = this.selectedUnit.id;
        } else {
            trailerId = this.selectedUnit.id;
        }

        this.repairService
            .getDriver(truckId, trailerId, formatedDate)
            .pipe(takeUntil(this.destroy$))
            .subscribe((driversList) => {
                if (driversList.length) {
                    this.driversDropdownList = driversList.map((item) => {
                        return {
                            ...item,
                            name: item.firstName + ' ' + item.lastName,
                        };
                    });

                    this.selectedDriver =
                        this.driversDropdownList[
                            this.driversDropdownList.length - 1
                        ];

                    this.isDriverSelected = true;
                } else {
                    this.repairOrderForm
                        .get(RepairOrderModalStringEnum.DRIVER)
                        .reset();

                    this.selectedDriver = null;

                    this.isDriverSelected = true;
                }
            });
    }

    private getRepairDropdowns(
        truckId?: number,
        trailerId?: number,
        unitType?: string,
        onlyPMS?: boolean
    ): void {
        this.repairService
            .getRepairModalDropdowns(truckId, trailerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: RepairModalResponse) => {
                // items pm dropdown
                const truckPmDropdownList = res?.pmTrucks?.map((pmTruck) => {
                    return {
                        ...pmTruck,
                        name: pmTruck.title,
                        folder: RepairOrderModalStringEnum.COMMON,
                        subFolder: RepairOrderModalStringEnum.REPAIR_PM,
                    };
                });

                const trailerPmDropdownList = res?.pmTrailers?.map(
                    (pmTrailer) => {
                        return {
                            ...pmTrailer,
                            name: pmTrailer.title,
                            folder: RepairOrderModalStringEnum.COMMON,
                            subFolder: RepairOrderModalStringEnum.REPAIR_PM,
                        };
                    }
                );

                this.truckTrailerPmDropdownLists = {
                    truckPmDropdownList,
                    trailerPmDropdownList,
                };

                // if only pm dropdowns
                if (onlyPMS) return;

                // pay types
                this.payTypeDropdownList = res.payTypes;

                // unit trucks
                this.unitTrucks = res.trucks.map((item) => {
                    return {
                        ...item,
                        name: item.truckNumber,
                    };
                });

                // unit trailers
                this.unitTrailers = res.trailers.map((item) => {
                    return {
                        ...item,
                        name: item.trailerNumber,
                    };
                });

                // unit dropdown
                this.unitDropdownList =
                    unitType === RepairOrderModalStringEnum.TRAILERS
                        ? this.unitTrailers
                        : this.unitTrucks;

                // repair shops
                this.repairShopDropdownList = res.repairShops.map(
                    (repairShop) => {
                        return {
                            ...repairShop,
                            additionalText: repairShop.address.address,
                        };
                    }
                );

                // services
                this.services = res.serviceTypes.map((item) => {
                    return {
                        id: item.serviceType.id,
                        serviceType: item.serviceType.name,
                        svg: `assets/svg/common/repair-services/${item.logoName}`,
                        active: false,
                        isSelected: false,
                    };
                });

                this.repairOrderForm
                    .get(RepairOrderModalStringEnum.SERVICES_HELPER)
                    .patchValue(JSON.stringify(this.services));

                // tags
                this.tags = res.tags;

                // ------------- EDIT --------------
                if (
                    this.editData?.type?.includes(
                        RepairOrderModalStringEnum.EDIT
                    )
                ) {
                    this.isCardanimationDisabled = true;

                    this.editRepairById(this.editData.data);
                } else {
                    this.startFormChanges();
                }

                // repair modal opened from repair shop details
                if (
                    this.editData?.type ===
                    RepairOrderModalStringEnum.SPECIFIC_REPAIR_SHOP
                ) {
                    this.selectedRepairShop = this.repairShopDropdownList.find(
                        (item) => item.id === this.editData.shopId
                    );
                    this.selectedRepairShop = {
                        ...this.selectedRepairShop,
                        address: this.selectedRepairShop?.address?.address,
                    };
                }
            });
    }

    public updateTags(): void {
        let tags = [];

        this.documents.map((item) => {
            if (item?.tagChanged && item?.fileId) {
                const tagsData = {
                    storageId: item.fileId,
                    tagId: item.tagId?.length ? item.tagId[0] : null,
                };

                tags.push(tagsData);
            }
        });

        if (tags.length)
            this.tagsService
                .updateTag({ tags: tags })
                .pipe(takeUntil(this.destroy$))
                .subscribe();
    }

    private addRepair(): void {
        const {
            date,
            odometer,
            invoice, // eslint-disable-next-line no-unused-vars
            payType,
            datePaid, // eslint-disable-next-line no-unused-vars
            repairItems, // eslint-disable-next-line no-unused-vars
            driver, // eslint-disable-next-line no-unused-vars
            orderNumber, // eslint-disable-next-line no-unused-vars
            servicesHelper, // eslint-disable-next-line no-unused-vars
            total, // eslint-disable-next-line no-unused-vars
            unit,
            ...form
        } = this.repairOrderForm.value;

        let documents = [];
        let tagsArray = [];

        // date
        const convertedDate =
            MethodsCalculationsHelper.convertDateToBackend(date);

        // truck & trailer id
        const truckId =
            this.repairOrderForm.get(RepairOrderModalStringEnum.UNIT_TYPE)
                .value === RepairOrderModalStringEnum.TRUCK
                ? this.selectedUnit.id
                : null;
        const trailerId =
            this.repairOrderForm.get(RepairOrderModalStringEnum.UNIT_TYPE)
                .value === RepairOrderModalStringEnum.TRAILER
                ? this.selectedUnit.id
                : null;

        // repair shop id
        const repairShopId = this.selectedRepairShop?.id ?? null;

        // service types
        const serviceTypes = this.services.map((item) => {
            return {
                serviceType: item.serviceType,
                active: item.active,
                isSelected: item.isSelected,
            };
        });

        // documents
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

        // tags
        if (!tagsArray.length) tagsArray = null;

        let newData = null;

        if (this.selectedHeaderTab === 2) {
            newData = {
                ...form,
                orderNumber,
                repairType: RepairOrderModalStringEnum.ORDER,
                truckId,
                trailerId,
                date: convertedDate,
                repairShopId,
                serviceTypes,
                items: this.repairItems.map(
                    ({
                        description,
                        quantity,
                        pmTruck: { id: pmTruckId } = {},
                        pmTrailer: { id: pmTrailerId } = {},
                    }) => ({
                        description,
                        quantity,
                        pmTruckId,
                        pmTrailerId,
                    })
                ),
                files: documents,
                tags: tagsArray,
            };
        } else {
            newData = {
                ...form,
                repairType: RepairOrderModalStringEnum.BILL,
                truckId,
                trailerId,
                driverId: this.selectedDriver?.id ?? null,
                odometer: odometer
                    ? MethodsCalculationsHelper.convertThousanSepInNumber(
                          odometer
                      )
                    : null,
                date: convertedDate,
                invoice,
                repairShopId,
                total: this.total,
                serviceTypes,
                items: this.repairItems.map(
                    ({
                        description,
                        price,
                        quantity,
                        subtotal,
                        pmTruck: { id: pmTruckId } = {},
                        pmTrailer: { id: pmTrailerId } = {},
                    }) => ({
                        description,
                        price,
                        quantity,
                        subtotal,
                        pmTruckId,
                        pmTrailerId,
                    })
                ),
                files: documents,
                tags: tagsArray,
                payType: this.selectedPayType?.id ?? null,
                datePaid: datePaid
                    ? MethodsCalculationsHelper.convertDateToBackend(datePaid)
                    : null,
            };
        }

        this.repairService
            .addRepair(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.isAddNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: RepairOrderModalStringEnum.SVE_AND_ADD_NEW,
                            status: false,
                            close: false,
                        });

                        this.ngbActiveModal.close();

                        this.modalService.openModal(
                            RepairOrderModalComponent,
                            {
                                size: RepairOrderModalStringEnum.LARGE,
                            },
                            {
                                type: RepairOrderModalStringEnum.NEW_TRUCK,
                            }
                        );

                        this.isAddNewAfterSave = false;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
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

    private editRepairById(editData: RepairResponse): void {
        const {
            repairType,
            invoice,
            date,
            payType,
            datePaid,
            driver,
            unitType,
            truck,
            trailer,
            odometer,
            repairShop,
            items,
            truckId,
            trailerId,
            shopServiceType,
            serviceTypes,
            orderNumber,
        } = editData;
        const selectedHeaderTab = {
            id: repairType?.id,
            name: repairType?.name,
            checked: true,
        };
        const selectedTypeOfRepairTab = this.unitTabs.find(
            (item) => item.name === unitType?.name
        );
        const selectedServiceTab = this.serviceTabs.find(
            (serviceTab) => serviceTab.id === shopServiceType?.id
        );

        // header tab
        this.onModalHeaderTabChange(selectedHeaderTab);

        if (this.selectedHeaderTab === 1) {
            // pay type
            this.selectedPayType = payType;

            // driver
            this.selectedDriver = driver;
        }

        // unit type tab
        this.onTabChange(
            selectedTypeOfRepairTab,
            RepairOrderModalStringEnum.EDIT_MODE
        );

        // unit
        this.selectedUnit =
            unitType?.name === RepairOrderModalStringEnum.TRUCK
                ? { ...truck, name: truck?.truckNumber }
                : {
                      ...trailer,
                      name: trailer?.trailerNumber,
                  };

        // repair Shop
        if (repairShop) {
            this.selectedRepairShop = {
                id: repairShop?.id,
                name: repairShop?.name,
                phone: repairShop?.phone,
                email: repairShop?.email,
                address: repairShop?.address?.address,
            };
        }

        // items
        this.updateRepairItems = items.map((repairItem) => {
            return {
                ...repairItem,
                pmTruck: repairItem?.pmTruck && {
                    ...repairItem.pmTruck,
                    truckId: repairItem.pmTruck.id,
                },
                pmTrailer: repairItem?.pmTrailer && {
                    ...repairItem.pmTrailer,
                    trailerId: repairItem.pmTrailer.id,
                },
            };
        });

        this.getRepairDropdowns(truckId, trailerId, unitType.name, true);

        // service tab
        if (shopServiceType) {
            this.serviceTabs.find(
                (serviceTab) => serviceTab?.id === shopServiceType?.id
            ).checked = true;

            this.onTabChange(
                selectedServiceTab,
                null,
                RepairOrderModalStringEnum.SERVICE
            );
        }

        // repair services
        this.services = serviceTypes?.map((service) => {
            return {
                ...service,
                id: service.serviceType.id,
                serviceType: service.serviceType.name,
                svg: `assets/svg/common/repair-services/${service.logoName}`,
            };
        });

        // documents
        this.documents = editData.files;

        // patch form
        this.repairOrderForm.patchValue({
            invoice,
            orderNumber,
            date:
                date && MethodsCalculationsHelper.convertDateFromBackend(date),
            datePaid:
                datePaid &&
                MethodsCalculationsHelper.convertDateFromBackend(datePaid),
            driver:
                driver?.firstName +
                RepairOrderModalStringEnum.EMPTY_SPACE_STRING +
                driver?.lastName,
            odometer:
                odometer &&
                MethodsCalculationsHelper.convertNumberInThousandSep(odometer),
            repairItems: JSON.stringify(this.updateRepairItems),
            repairShopId: repairShop?.id ?? null,
            servicesHelper: JSON.stringify(this.services),
            note: editData.note,
        });

        setTimeout(() => {
            this.startFormChanges();

            this.isCardanimationDisabled = false;
        }, 1000);
    }

    private updateRepair(id: number): void {
        const {
            date,
            odometer,
            invoice, // eslint-disable-next-line no-unused-vars
            payType,
            datePaid, // eslint-disable-next-line no-unused-vars
            repairItems, // eslint-disable-next-line no-unused-vars
            driver, // eslint-disable-next-line no-unused-vars
            orderNumber, // eslint-disable-next-line no-unused-vars
            servicesHelper, // eslint-disable-next-line no-unused-vars
            total, // eslint-disable-next-line no-unused-vars
            unit,
            ...form
        } = this.repairOrderForm.value;

        let documents = [];
        let tagsArray = [];

        // date
        const convertedDate =
            MethodsCalculationsHelper.convertDateToBackend(date);

        // truck & trailer id
        const truckId =
            this.repairOrderForm.get(RepairOrderModalStringEnum.UNIT_TYPE)
                .value === RepairOrderModalStringEnum.TRUCK
                ? this.selectedUnit.id
                : null;
        const trailerId =
            this.repairOrderForm.get(RepairOrderModalStringEnum.UNIT_TYPE)
                .value === RepairOrderModalStringEnum.TRAILER
                ? this.selectedUnit.id
                : null;

        // repair shop id
        const repairShopId = this.selectedRepairShop?.id ?? null;

        // service types
        const serviceTypes = this.services.map((item) => {
            return {
                serviceType: item.serviceType,
                active: item.active,
                isSelected: item.isSelected,
            };
        });

        // documents
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

        // tags
        if (!tagsArray.length) tagsArray = null;

        let newData = null;

        if (this.selectedHeaderTab === 2) {
            newData = {
                ...form,
                id,
                orderNumber,
                repairType: RepairOrderModalStringEnum.ORDER,
                truckId,
                trailerId,
                date: convertedDate,
                repairShopId,
                serviceTypes,
                items: this.repairItems.map(
                    ({
                        description,
                        quantity,
                        pmTruck: { id: pmTruckId } = {},
                        pmTrailer: { id: pmTrailerId } = {},
                    }) => ({
                        description,
                        quantity,
                        pmTruckId,
                        pmTrailerId,
                    })
                ),
                files: documents,
                tags: tagsArray,
            };
        } else {
            newData = {
                ...form,
                id,
                repairType: RepairOrderModalStringEnum.BILL,
                truckId,
                trailerId,
                driverId: this.selectedDriver?.id ?? null,
                odometer: odometer
                    ? MethodsCalculationsHelper.convertThousanSepInNumber(
                          odometer
                      )
                    : null,
                date: convertedDate,
                invoice,
                repairShopId,
                total: this.total,
                serviceTypes,
                items: this.repairItems.map(
                    ({
                        description,
                        price,
                        quantity,
                        subtotal,
                        pmTruck: { id: pmTruckId } = {},
                        pmTrailer: { id: pmTrailerId } = {},
                    }) => ({
                        description,
                        price,
                        quantity,
                        subtotal,
                        pmTruckId,
                        pmTrailerId,
                    })
                ),
                files: documents,
                tags: tagsArray,
                payType: this.selectedPayType?.id ?? null,
                datePaid: datePaid
                    ? MethodsCalculationsHelper.convertDateToBackend(datePaid)
                    : null,
            };
        }

        this.repairService
            .updateRepair(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.updateTags();

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

    private deleteRepairById(id: number): void {
        this.ngbActiveModal.close();

        const data = {
            data: {
                tableUnit: this.repairOrderForm.get(
                    RepairOrderModalStringEnum.INVOICE
                ).value,
                tableCost: RepairOrderModalStringEnum.DOLLAR_SIGN + this.total,
                tableShopName: this.selectedRepairShop?.name,
                repairType: this.headerTabs.find(
                    (headerTab) => headerTab.checked
                ),
            },
            id,
        };

        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.DELETE },
            {
                ...data,
                template: TableStringEnum.REPAIR_2,
                type: TableStringEnum.DELETE,
                subType:
                    this.repairOrderForm.get(
                        RepairOrderModalStringEnum.UNIT_TYPE
                    ).value === TableStringEnum.TRUCK_2
                        ? TableStringEnum.TRUCK
                        : TableStringEnum.TRAILER_2,
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
