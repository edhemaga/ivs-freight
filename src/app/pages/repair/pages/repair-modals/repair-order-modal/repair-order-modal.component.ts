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

// models
import {
    RepairModalResponse,
    RepairShopResponse,
    RepairResponse,
    RepairDriverResponse,
    TruckMinimalResponse,
    TrailerMinimalResponse,
    EnumValue,
    RepairShopShortResponse,
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
    public isFormDirty: boolean;

    public isAddNewAfterSave: boolean = false;

    public hideIconIndex: number = 0;

    // cards
    public isCardanimationDisabled: boolean = false;

    // tabs
    public headerTabs: Tabs[] = [];
    public typeOfRepairTabs: Tabs[] = [];
    public serviceTabs: Tabs[] = [];

    public selectedHeaderTab: number = 1;
    public selectedRepairTypeTab: string;

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

    // items
    public isRepairBillRowCreated: boolean = false;
    public isRepairOrderRowCreated: boolean = false;

    public isEachDescriptionRowValid: boolean = true;

    public repairItems = [];
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
        this.createForm();

        this.getConstantData();

        this.monitorDateInput();

        this.checkIfTruckOrTrailerInit();

        setTimeout(() => {
            this.addItem();
        }, 500);
    }

    private createForm() {
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
            orderNo: [null],
        });
    }

    private getConstantData(): void {
        this.headerTabs = JSON.parse(
            JSON.stringify(RepairOrderConstants.HEADER_TABS)
        );

        this.typeOfRepairTabs = JSON.parse(
            JSON.stringify(RepairOrderConstants.TYPE_OF_REPAIR_TABS)
        );

        this.serviceTabs = JSON.parse(
            JSON.stringify(RepairOrderConstants.SERVICE_TABS)
        );
    }

    private checkIfTruckOrTrailerInit(): void {
        // if open with trailer tab
        if (this.editData?.type?.toLowerCase().includes('trailer')) {
            this.onTabChange(this.typeOfRepairTabs[1]);

            this.getRepairDropdowns(null, null, 'Trailers', false);
        }
        // if open with truck tab
        else {
            this.onTabChange(this.typeOfRepairTabs[0]);

            this.getRepairDropdowns(null, null, 'Trucks', false);
        }
    }

    public getDrivers(): void {
        const formatedDate = moment(
            this.repairOrderForm.get(RepairOrderModalStringEnum.DATE).value,
            'MM/DD/YY'
        ).format('YYYY-MM-DD');

        let truckId;
        let trailerId;

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
                } else {
                    this.selectedDriver = null;

                    this.repairOrderForm.get('driver').reset();
                }
            });
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case RepairOrderModalStringEnum.CLOSE:
                break;
            case RepairOrderModalStringEnum.SVE_AND_ADD_NEW:
                if (this.repairOrderForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.repairOrderForm);

                    return;
                }

                this.addRepair();

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
                    this.updateRepair(this.editData.id);
                } else {
                    this.addRepair();
                }

                break;
            case RepairOrderModalStringEnum.DELETE:
                if (this.editData) {
                    this.deleteRepair(this.editData.id);
                }
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
                this.repairOrderForm.get(RepairOrderModalStringEnum.ORDER_NO),
                false
            );
        } else {
            this.inputService.changeValidators(
                this.repairOrderForm.get(RepairOrderModalStringEnum.ORDER_NO)
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

    public onTabChange(event: Tabs, action?: string, type?: string) {
        if (type === RepairOrderModalStringEnum.SERVICE) {
            this.repairOrderForm
                .get(RepairOrderModalStringEnum.SHOP_SERVICE_TYPE)
                .patchValue(event.id);
        } else {
            this.truckOrTrailer = event.name;

            setTimeout(() => {
                this.typeOfRepairTabs = this.typeOfRepairTabs.map((item) => {
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

                // If Edit Mode, don't go below
                if (action) {
                    return;
                }

                this.inputService.changeValidators(
                    this.repairOrderForm.get('odometer'),
                    false,
                    [],
                    false
                );

                this.repairOrderForm
                    .get(RepairOrderModalStringEnum.UNIT)
                    .patchValue(null);
                this.selectedUnit = null;
            }, 100);
        }
    }

    public monitorDateInput(): void {
        this.repairOrderForm
            .get(RepairOrderModalStringEnum.DATE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (!res) {
                    this.selectedDriver = null;

                    this.repairOrderForm.get('driver').reset();
                } else {
                    if (this.selectedUnit) this.getDrivers();
                }
            });
    }

    public rapairShopRemovedClearServiceTypes() {
        this.services = this.services.map((service) => {
            return {
                ...service,
                active: false,
                isSelected: false,
            };
        });
    }

    public onSelectDropDown(event: any, action: string) {
        const { ...form } = this.repairOrderForm.value;

        switch (action) {
            case 'paid-type':
                if (event) {
                    this.selectedPayType = event;

                    this.repairOrderForm
                        .get('datePaid')
                        .setValidators(Validators.required);

                    this.repairOrderForm
                        .get('datePaid')
                        .updateValueAndValidity();
                } else {
                    this.repairOrderForm.get('datePaid').reset();

                    this.repairOrderForm.get('datePaid').clearValidators();

                    this.repairOrderForm
                        .get('datePaid')
                        .updateValueAndValidity();
                }

                break;
            case 'repair-unit':
                if (event?.truckNumber) {
                    this.detailsDataService.setUnitValue(event.truckNumber);
                } else if (event?.trailerNumber) {
                    this.detailsDataService.setUnitValue(event.trailerNumber);
                }

                this.selectedUnit = event;

                this.typeOfRepairTabs.find((item) => item.checked).name ===
                RepairOrderModalStringEnum.TRUCK
                    ? this.getRepairDropdowns(
                          this.selectedUnit?.id,
                          null,
                          'Trucks',
                          true
                      )
                    : this.getRepairDropdowns(
                          null,
                          this.selectedUnit?.id,
                          'Trailers',
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

                    this.repairOrderForm.get('driver').reset();

                    this.inputService.changeValidators(
                        this.repairOrderForm.get('odometer'),
                        false,
                        [],
                        false
                    );
                }

                break;
            case 'driver':
                if (event) {
                    this.selectedDriver = event;
                } else {
                    this.selectedDriver = null;
                }

                break;
            case 'repair-shop':
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();
                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'repair-modal',
                            value: {
                                ...form,
                                selectedUnit: this.selectedUnit,
                                services: this.services,
                                selectedRepairShop: this.selectedRepairShop,
                                headerTabs: this.headerTabs,
                                selectedHeaderTab: this.selectedHeaderTab,
                                typeOfRepair: this.typeOfRepairTabs,
                            },
                        },
                        component: RepairShopModalComponent,
                        size: 'small',
                        type: this.repairOrderForm.get(
                            RepairOrderModalStringEnum.UNIT_TYPE
                        ).value,
                    });
                } else {
                    this.selectedRepairShop = event;

                    if (this.selectedRepairShop) {
                        this.repairOrderForm
                            .get(RepairOrderModalStringEnum.SHOP_SERVICE_TYPE)
                            .patchValue(1);

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
                                    pinned: res.pinned,
                                };

                                this.serviceTabs = this.serviceTabs.map(
                                    (serviceTab, index) => {
                                        if (index === 0) {
                                            return {
                                                ...serviceTab,
                                                checked:
                                                    serviceTab.id ===
                                                    res.shopServiceType.id,
                                            };
                                        }

                                        return serviceTab;
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

    public activeRepairService(service) {
        service.isSelected = !service.isSelected;

        this.repairOrderForm
            .get('servicesHelper')
            .patchValue(JSON.stringify(this.services));
    }

    public onFilesEvent(event: any) {
        switch (event.action) {
            case 'add': {
                this.documents = event.files;
                this.repairOrderForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case RepairOrderModalStringEnum.DELETE: {
                this.documents = event.files;
                this.repairOrderForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.isFileModified = true;
                break;
            }
            case 'tag': {
                let changedTag = false;
                event.files.map((item) => {
                    if (item.tagChanged) {
                        changedTag = true;
                    }
                });

                this.repairOrderForm
                    .get('tags')
                    .patchValue(changedTag ? true : null);
                break;
            }
            default: {
                break;
            }
        }
    }

    public openRepairShop(): void {
        this.ngbActiveModal.close();
        this.modalService.setProjectionModal({
            action: 'open',
            payload: {
                key: 'repair-modal',
                value: {
                    ...this.repairOrderForm.value,
                    selectedUnit: this.selectedUnit,
                    services: this.services,
                    selectedRepairShop: this.selectedRepairShop,
                    headerTabs: this.headerTabs,
                    selectedHeaderTab: this.selectedHeaderTab,
                    typeOfRepair: this.typeOfRepairTabs,
                    editRepairShop: true,
                },
                id: this.selectedRepairShop.id,
            },
            component: RepairShopModalComponent,
            size: 'small',
            type: this.repairOrderForm.get(RepairOrderModalStringEnum.UNIT_TYPE)
                .value,
        });
    }

    public updateTags(): void {
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

    public getTotalCostValueEmit(event: RepairSubtotal[]): void {
        let total = 0;

        event.forEach((item: RepairSubtotal) => {
            total += item.subtotal;
        });

        this.total = total;
    }

    public addItem(_?: { check: boolean; action: string }): void {
        if (!this.isEachDescriptionRowValid) return;

        this.isRepairBillRowCreated = true;
        this.isRepairOrderRowCreated = true;

        setTimeout(() => {
            this.isRepairBillRowCreated = false;
            this.isRepairOrderRowCreated = false;
        }, 400);

        this.changeDetector.detectChanges();
    }

    public handleModalTableValueEmit(
        modalTableDataValue: RepairSubtotal[]
    ): void {
        this.repairItems = modalTableDataValue;

        const anyDescriptionItemHasPmSelected = this.repairItems.some(
            (description) => description.pmTruckId || description.pmTrailerId
        );

        if (anyDescriptionItemHasPmSelected)
            this.inputService.changeValidators(
                this.repairOrderForm.get(RepairOrderModalStringEnum.ODOMETER)
            );
        else {
            this.inputService.changeValidators(
                this.repairOrderForm.get(RepairOrderModalStringEnum.ODOMETER),
                false
            );
        }

        this.repairOrderForm
            .get(RepairOrderModalStringEnum.REPAIR_ITEMS)
            .patchValue(this.repairItems);
    }

    public handleModalTableValidStatusEmit(validStatus: boolean): void {
        this.isEachDescriptionRowValid = validStatus;
    }

    private getRepairDropdowns(
        truckId?: number,
        trailerId?: number,
        unitType?: string,
        onlyPMS?: boolean
    ) {
        this.repairService
            .getRepairModalDropdowns(truckId, trailerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairModalResponse) => {
                    // items
                    const truckPmDropdownList = res?.pmTrucks?.map(
                        (pmTruck) => {
                            return {
                                ...pmTruck,
                                name: pmTruck.title,
                                folder: 'common',
                                subFolder: 'repair-pm',
                            };
                        }
                    );

                    const trailerPmDropdownList = res?.pmTrailers?.map(
                        (pmTrailer) => {
                            return {
                                ...pmTrailer,
                                name: pmTrailer.title,
                                folder: 'common',
                                subFolder: 'repair-pm',
                            };
                        }
                    );

                    this.truckTrailerPmDropdownLists = {
                        truckPmDropdownList,
                        trailerPmDropdownList,
                    };

                    if (onlyPMS) return;

                    // pay types
                    this.payTypeDropdownList = res.payTypes;

                    // Unit Trucks
                    this.unitTrucks = res.trucks.map((item) => {
                        return {
                            ...item,
                            name: item.truckNumber,
                        };
                    });

                    // Unit Trailers
                    this.unitTrailers = res.trailers.map((item) => {
                        return {
                            ...item,
                            name: item.trailerNumber,
                        };
                    });

                    // Labels Unit
                    this.unitDropdownList =
                        unitType === 'Trailers'
                            ? this.unitTrailers
                            : this.unitTrucks;

                    // Services
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
                        .get('servicesHelper')
                        .patchValue(JSON.stringify(this.services));

                    // Repair Shops
                    this.repairShopDropdownList = res.repairShops.map(
                        (repairShop) => {
                            return {
                                ...repairShop,
                                additionalText: repairShop.address.address,
                            };
                        }
                    );

                    // tags
                    this.tags = res.tags;

                    // ------------- EDIT --------------
                    // storage data
                    if (this.editData?.storageData) {
                        this.isCardanimationDisabled = true;
                        this.populateForm(this.editData?.storageData);
                    }

                    // Edit mode
                    if (
                        this.editData?.type?.includes(
                            RepairOrderModalStringEnum.EDIT
                        )
                    ) {
                        this.isCardanimationDisabled = true;
                        this.editRepairById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }

                    // Repair Modal opened from repair shop details
                    if (this.editData?.type === 'specific-repair-shop') {
                        this.selectedRepairShop =
                            this.repairShopDropdownList.find(
                                (item) => item.id === this.editData.shopId
                            );
                        this.selectedRepairShop = {
                            ...this.selectedRepairShop,
                            address: this.selectedRepairShop?.address?.address,
                        };
                    }
                },
                error: () => {},
            });
    }

    private addRepair() {
        const {
            date,
            odometer,
            invoice, // eslint-disable-next-line no-unused-vars
            payType,
            datePaid, // eslint-disable-next-line no-unused-vars
            repairItems, // eslint-disable-next-line no-unused-vars
            driver, // eslint-disable-next-line no-unused-vars
            orderNo, // eslint-disable-next-line no-unused-vars
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
                invoice: orderNo,
                repairType: RepairOrderModalStringEnum.ORDER,
                truckId,
                trailerId,
                date: convertedDate,
                repairShopId,
                serviceTypes,
                items: this.repairItems.map(
                    ({ description, qty, pmTruckId, pmTrailerId }) => ({
                        description,
                        quantity: qty,
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
                driverId: this.selectedDriver?.driverId ?? null,
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
                        qty,
                        subtotal,
                        pmTruckId,
                        pmTrailerId,
                    }) => ({
                        description,
                        price,
                        quantity: qty,
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

        console.log('newData', newData);

        this.repairService
            .addRepair(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.isAddNewAfterSave) {
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

    private updateRepair(id: number) {
        const { date, odometer, invoice, ...form } = this.repairOrderForm.value;

        let documents = [];
        let tagsArray = [];
        this.documents.map((item) => {
            if (item.tagId?.length && item?.realFile?.name)
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

        let newData: any = null;

        if (this.selectedHeaderTab === 2) {
            newData = {
                id: id,
                ...form,
                repairType: RepairOrderModalStringEnum.ORDER,
                truckId:
                    this.repairOrderForm.get(
                        RepairOrderModalStringEnum.UNIT_TYPE
                    ).value === RepairOrderModalStringEnum.TRUCK
                        ? this.selectedUnit.id
                        : null,
                trailerId:
                    this.repairOrderForm.get(
                        RepairOrderModalStringEnum.UNIT_TYPE
                    ).value === RepairOrderModalStringEnum.TRAILER
                        ? this.selectedUnit.id
                        : null,
                repairShopId: this.selectedRepairShop
                    ? this.selectedRepairShop.id
                    : null,
                serviceTypes: this.services.map((item) => {
                    return {
                        serviceType: item.serviceType,
                        active: item.active,
                    };
                }),
                files: documents ? documents : this.repairOrderForm.value.files,
                filesForDeleteIds: this.filesForDelete,
                tags: tagsArray,
            };
        } else {
            newData = {
                id: id,
                ...form,
                repairType: RepairOrderModalStringEnum.BILL,
                date: MethodsCalculationsHelper.convertDateToBackend(date),
                truckId:
                    this.repairOrderForm.get(
                        RepairOrderModalStringEnum.UNIT_TYPE
                    ).value === RepairOrderModalStringEnum.TRUCK
                        ? this.selectedUnit.id
                        : null,
                trailerId:
                    this.repairOrderForm.get(
                        RepairOrderModalStringEnum.UNIT_TYPE
                    ).value === RepairOrderModalStringEnum.TRAILER
                        ? this.selectedUnit.id
                        : null,
                repairShopId: this.selectedRepairShop
                    ? this.selectedRepairShop.id
                    : null,
                odometer: odometer
                    ? MethodsCalculationsHelper.convertThousanSepInNumber(
                          this.repairOrderForm.get('odometer').value
                      )
                    : null,
                total: this.subtotal
                    ? this.priceArrayPipe.transform(this.subtotal).slice(1)
                    : null,
                invoice: invoice,
                serviceTypes: this.services.map((item) => {
                    return {
                        serviceType: item.serviceType,
                        active: item.active,
                    };
                }),
                files: documents ? documents : this.repairOrderForm.value.files,
                filesForDeleteIds: this.filesForDelete,
                tags: tagsArray,
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

    private deleteRepair(id: number) {
        this.repairService
            .deleteRepairById(
                id,
                this.editData.type === 'edit-trailer' ? 'inactive' : 'active'
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: RepairOrderModalStringEnum.DELETE,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: RepairOrderModalStringEnum.DELETE,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private populateForm(res: any) {
        res.typeOfRepair.find((item) => item.checked).name ===
        RepairOrderModalStringEnum.TRUCK
            ? this.getRepairDropdowns(
                  res.selectedUnit?.id,
                  null,
                  'Trucks',
                  true
              )
            : this.getRepairDropdowns(
                  null,
                  res.selectedUnit?.id,
                  'Trailers',
                  true
              );

        const timeout2 = setTimeout(() => {
            this.repairOrderForm.patchValue({
                repairType: res.repairType,
                unitType: res.unitType,
                unit: res.unit,
                odometer: res.odometer,
                date: res.date,
                invoice: res.invoice,
                repairShopId: res?.editRepairShop ? null : res.repairShopId,
                note: res.note,
            });

            // Truck/Trailer Unit number
            this.selectedUnit = res.selectedUnit;

            // Repair Services
            this.services = res.services;

            // Repair Shop
            this.selectedRepairShop = res?.editRepairShop
                ? null
                : res.selectedRepairShop;

            // Header Tabs
            this.headerTabs = res.headerTabs;
            this.selectedHeaderTab = res.selectedHeaderTab;

            // Repair Type
            this.typeOfRepairTabs = res.typeOfRepair;

            // Items
            this.subtotal = [...res.subtotal];

            this.onModalHeaderTabChange(
                this.headerTabs.find((item) => item.name === res.repairType)
            );
            clearTimeout(timeout2);
        }, 250);

        setTimeout(() => {
            this.isCardanimationDisabled = false;
        }, 1000);
    }

    private editRepairById(id: number) {
        this.repairService
            .getRepairById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairResponse) => {
                    // Header Tab
                    this.onModalHeaderTabChange(
                        this.headerTabs.find(
                            (item) => item.name === res.repairType.name
                        )
                    );

                    // Repair Type
                    this.onTabChange(
                        this.typeOfRepairTabs.find(
                            (item) => item.name === res.unitType.name
                        ),
                        'edit-mode'
                    );

                    this.selectedUnit =
                        res.unitType.name === RepairOrderModalStringEnum.TRUCK
                            ? { ...res.truck, name: res.truck.truckNumber }
                            : {
                                  ...res.trailer,
                                  name: res.trailer.trailerNumber,
                              };

                    this.selectedHeaderTab =
                        res.repairType.name ===
                            RepairOrderModalStringEnum.BILL ||
                        this.editData?.type.includes('edit-fo')
                            ? this.headerTabs[1].id
                            : this.headerTabs[0].id;

                    this.getRepairDropdowns(
                        res.truckId,
                        res.trailerId,
                        res.unitType.name,
                        true
                    );

                    // Storage repair type bill / order
                    this.selectedRepairTypeTab = res.repairType.name;

                    // Documents
                    this.documents = res.files;

                    // Patch form
                    this.repairOrderForm.patchValue({
                        repairType: res.repairType ? res.repairType.name : null,
                        unitType: res.unitType ? res.unitType.name : null,
                        unit: {
                            name:
                                res.unitType.name ===
                                RepairOrderModalStringEnum.TRUCK
                                    ? res.truck.truckNumber
                                    : res.trailer.trailerNumber,
                        },
                        odometer:
                            res.odometer &&
                            res.date &&
                            this.selectedHeaderTab === 2
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      res.odometer
                                  )
                                : null,
                        date:
                            res.date && this.selectedHeaderTab === 2
                                ? MethodsCalculationsHelper.convertDateFromBackend(
                                      res.date
                                  )
                                : null,
                        invoice:
                            res.date && this.selectedHeaderTab === 2
                                ? res.invoice
                                : null,
                        items: [],
                        note: res.note,
                    });

                    // Repair Services
                    this.services = [
                        ...res.serviceTypes.map((item) => {
                            return {
                                id: item.serviceType.id,
                                serviceType: item.serviceType.name,
                                svg: `assets/svg/common/repair-services/${item.logoName}`,
                                active: item.active,
                                isSelcted: item.isSelected,
                            };
                        }),
                    ];

                    this.repairOrderForm
                        .get('servicesHelper')
                        .patchValue(JSON.stringify(this.services));

                    // Repair Shop
                    if (res.repairShop?.id) {
                        this.repairService
                            .getRepairShopById(res.repairShop.id)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe({
                                next: (res: RepairShopResponse) => {
                                    this.selectedRepairShop = {
                                        id: res.id,
                                        name: res.name,
                                        phone: res.phone,
                                        email: res.email,
                                        address: res.address.address,
                                        pinned: res.pinned,
                                    };
                                    this.repairOrderForm
                                        .get(
                                            RepairOrderModalStringEnum.REPAIR_SHOP_ID
                                        )
                                        .patchValue(
                                            this.selectedRepairShop.id,
                                            { emitEvent: false }
                                        );
                                },
                                error: () => {},
                            });
                    }

                    setTimeout(() => {
                        this.startFormChanges();
                        this.isCardanimationDisabled = false;
                    }, 1000);
                },
                error: () => {},
            });
    }
    private startFormChanges() {
        this.formService.checkFormChange(this.repairOrderForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public identity(index: number, item: any): string {
        return item.value;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
