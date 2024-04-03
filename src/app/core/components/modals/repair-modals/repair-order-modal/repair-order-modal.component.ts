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
import {
    NgbActiveModal,
    NgbModule,
    NgbPopover,
} from '@ng-bootstrap/ng-bootstrap';
import { distinctUntilChanged, Subject, takeUntil, throttleTime } from 'rxjs';
import { CommonModule } from '@angular/common';

//moment
import moment from 'moment';

// helpers
import {
    convertDateFromBackend,
    convertDateToBackend,
    convertNumberInThousandSep,
    convertThousanSepInNumber,
} from '../../../../utils/methods.calculations';

// pipes
import { PriceCalculationArraysPipe } from '../../../../pipes/price-calculation-arrays.pipe';
import { ActiveItemsPipe } from 'src/app/core/pipes/activeItems.pipe';
import { formatPhonePipe } from '../../../../pipes/formatPhone.pipe';

// services
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { DetailsDataService } from '../../../../services/details-data/details-data.service';
import { FormService } from '../../../../services/form/form.service';
import { EditTagsService } from 'src/app/core/services/shared/editTags.service';

// models
import {
    EnumValue,
    RepairModalResponse,
    RepairShopResponse,
} from 'appcoretruckassist';
import { RepairResponse } from '../../../../../../../appcoretruckassist/model/repairResponse';
import { RepairTypes } from './state/models/repair.model';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// validators
import {
    invoiceValidation,
    repairOdometerValidation,
    vehicleUnitValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

// constants
import { RepairOrder } from './state/constants/repair-order.constant';

// components
import { TruckModalComponent } from '../../../../../pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '../../../../../pages/trailer/pages/trailer-modal/trailer-modal.component';
import { RepairShopModalComponent } from '../repair-shop-modal/repair-shop-modal.component';
import { AppTooltipComponent } from '../../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaCustomCardComponent } from '../../../shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../../shared/ta-input-note/ta-input-note.component';
import { TaCopyComponent } from '../../../shared/ta-copy/ta-copy.component';
import { RepairData, Subtotal } from './state/models/repair.model';
import { TaModalTableComponent } from '../../../standalone-components/ta-modal-table/ta-modal-table.component';
import { RepairTService } from 'src/app/pages/repair/services/repair.service';

@Component({
    selector: 'app-repair-order-modal',
    templateUrl: './repair-order-modal.component.html',
    styleUrls: ['./repair-order-modal.component.scss'],
    providers: [PriceCalculationArraysPipe, ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        AngularSvgIconModule,

        // Component
        AppTooltipComponent,
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
        formatPhonePipe,
        PriceCalculationArraysPipe,
    ],
})
export class RepairOrderModalComponent implements OnInit, OnDestroy {
    @ViewChild('t2') public popoverRef: NgbPopover;
    @Input() editData: any;
    public disableCardAnimation: boolean = false;
    public repairOrderForm: UntypedFormGroup;
    public selectedHeaderTab: number = 1;

    public headerTabs: RepairData[] = JSON.parse(
        JSON.stringify(RepairOrder.HEADER_TABS)
    );

    public typeOfRepair: RepairData[] = JSON.parse(
        JSON.stringify(RepairOrder.TYPE_OF_REPAIR)
    );

    // Unit
    public labelsUnit: any[] = [];
    // Paid
    public paid: { id: number; name: string }[] = RepairOrder.PAID;
    public unitTrucks: any[] = [];
    public unitTrailers: any[] = [];
    public selectedUnit: any = null;
    // Repair Shop
    public labelsRepairShop: any = [];
    public selectedRepairShop: any = null;
    public services: any[] = [];
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];
    // Sum of items
    public subtotal: { id: number; value: number }[] = [];
    public itemsCounter: number = 0;
    // PMs
    public selectedPM: any[] = [];
    public selectedPMIndex: number;
    public isFormDirty: boolean;
    public selectedRepairType: string = null;
    public addNewAfterSave: boolean = false;
    public tags: any[] = [];
    private destroy$ = new Subject<void>();

    public isTruckOrTrailer: string;

    public isDescriptionRowCreated: boolean = false;

    public payTypeSelected: boolean = true;

    //hide icon copy
    public hideIconIndex: number = 0;

    public unitId: number;
    public drivers: EnumValue[] = [];
    public selectedDriver: EnumValue;
    public isDriverSelected: boolean = true;

    public isEachDescriptionRowValid: boolean = true;
    public isRepairShopSelected: boolean = true;

    public selectedPayType: string;
    public descriptions: Subtotal[] = [];

    public repairTypes: RepairTypes[] = RepairOrder.REPAIR_TYPES;
    public isSelectedRepairType: RepairTypes = null;

    public total: number = 0;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private repairService: RepairTService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        private priceArrayPipe: PriceCalculationArraysPipe,
        private formService: FormService,
        private DetailsDataService: DetailsDataService,
        private tagsService: EditTagsService,
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.createForm();

        this.monitorDateInput();

        // If open with trailer tab
        if (this.editData?.type?.toLowerCase().includes('trailer')) {
            this.onTypeOfRepair(this.typeOfRepair[1]);
            this.getRepairDropdowns(null, null, 'Trailers', false);
        }
        // If open with truck tab
        else {
            this.onTypeOfRepair(this.typeOfRepair[0]);
            this.getRepairDropdowns(null, null, 'Trucks', false);
        }
    }

    public getDrivers(): void {
        const formatedDate = moment(
            this.repairOrderForm.get('date').value,
            'MM/DD/YY'
        ).format('YYYY-MM-DD');

        let truckId;
        let trailerId;

        if (this.isTruckOrTrailer === 'Truck') {
            truckId = this.selectedUnit.id;
        } else {
            trailerId = this.selectedUnit.id;
        }

        this.repairService
            .getDriver(truckId, trailerId, formatedDate)
            .pipe(takeUntil(this.destroy$))
            .subscribe((driversList) => {
                if (driversList.length) {
                    this.drivers = driversList.map((item) => {
                        return {
                            ...item,
                            name: item.firstName + ' ' + item.lastName,
                        };
                    });

                    this.selectedDriver = this.drivers[this.drivers.length - 1];

                    this.isDriverSelected = false;
                } else {
                    this.isDriverSelected = true;
                    this.selectedDriver = null;
                    this.repairOrderForm.get('driver').reset();
                }
            });
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save and add new': {
                if (this.repairOrderForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.repairOrderForm);
                    return;
                }
                this.addRepair();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;

                break;
            }
            case 'save': {
                if (this.repairOrderForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.repairOrderForm);
                    return;
                }
                if (this.editData.type.includes('edit')) {
                    this.updateRepair(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addRepair();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case 'delete': {
                if (this.editData) {
                    this.deleteRepair(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public onModalHeaderTabChange(event: any): void {
        this.selectedHeaderTab = event.id;

        if (event.id === 1) {
            setTimeout(() => {
                this.DetailsDataService.setUnitValue(
                    this.repairOrderForm.get('unit')?.value
                );
            }, 100);

            this.inputService.changeValidators(
                this.repairOrderForm.get('repairShopId'),
                false
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get('date'),
                false
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get('odometer'),
                false
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get('invoice'),
                false
            );

            this.repairOrderForm.get('repairType').patchValue('Order');
        } else {
            this.inputService.changeValidators(
                this.repairOrderForm.get('repairShopId')
            );
            this.inputService.changeValidators(
                this.repairOrderForm.get('date')
            );

            this.inputService.changeValidators(
                this.repairOrderForm.get('invoice')
            );
            this.repairOrderForm.get('repairType').patchValue('Bill');

            if (this.selectedPMIndex) {
                this.inputService.changeValidators(
                    this.repairOrderForm.get('odometer'),
                    false
                );
            }
        }

        this.headerTabs = this.headerTabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });

        if (this.headerTabs[1].checked) {
            this.inputService.changeValidators(
                this.repairOrderForm.get('repairShopId')
            );
        } else {
            this.inputService.changeValidators(
                this.repairOrderForm.get('repairShopId'),
                false
            );
        }
    }

    public onTypeOfRepair(event: any, action?: string) {
        this.isTruckOrTrailer = event.name;
        setTimeout(() => {
            this.typeOfRepair = this.typeOfRepair.map((item) => {
                if (item.id === event.id) {
                    this.repairOrderForm.get('unitType').patchValue(item.name);
                }
                return {
                    ...item,
                    checked: item.id === event.id,
                };
            });

            this.labelsUnit =
                event.name === 'Trailer'
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

            this.repairOrderForm.get('unit').patchValue(null);
            this.selectedUnit = null;
            this.selectedPM = [];
            this.selectedPMIndex = null;
        }, 100);
    }

    public monitorDateInput(): void {
        this.repairOrderForm
            .get('date')
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged(),
                throttleTime(2)
            )
            .subscribe((res) => {
                if (!res) {
                    this.selectedDriver = null;
                    this.isDriverSelected = false;
                    this.repairOrderForm.get('driver').reset();
                } else {
                    if (this.selectedUnit) {
                        this.getDrivers();
                    }
                }
            });
    }

    public rapairShopRemovedClearServiceTypes() {
        this.services = this.services.map((service) => {
            return {
                ...service,
                active: false,
            };
        });
    }

    public onSelectDropDown(event: any, action: string) {
        const { items, ...form } = this.repairOrderForm.value;
        switch (action) {
            case 'repair-unit':
                if (event?.truckNumber) {
                    this.DetailsDataService.setUnitValue(event.truckNumber);
                } else if (event?.trailerNumber) {
                    this.DetailsDataService.setUnitValue(event.trailerNumber);
                }

                if (event?.canOpenModal) {
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
                                typeOfRepair: this.typeOfRepair,
                                // subtotal: this.subtotal,
                                selectedPM: this.selectedPM,
                                selectedPMIndex: this.selectedPMIndex,
                            },
                        },
                        component:
                            this.repairOrderForm.get('unitType').value ===
                            'Truck'
                                ? TruckModalComponent
                                : TrailerModalComponent,
                        size: 'small',
                        type: this.repairOrderForm.get('unitType').value,
                    });
                } else {
                    this.selectedUnit = event;

                    if (event.trailerType) {
                        this.selectedUnit = {
                            ...this.selectedUnit,
                            logoName: event.trailerType?.logoName,
                        };
                    } else {
                        this.selectedUnit = {
                            ...this.selectedUnit,
                            logoName: event.truckType?.logoName,
                        };
                    }

                    if (!event) {
                        this.selectedPM = [];

                        this.selectedDriver = null;
                        this.isDriverSelected = true;

                        this.repairOrderForm.get('driver').reset();

                        this.selectedPMIndex = null;
                        this.inputService.changeValidators(
                            this.repairOrderForm.get('odometer'),
                            false,
                            [],
                            false
                        );
                    }

                    this.typeOfRepair.find((item) => item.checked).name ===
                    'Truck'
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
                        this.repairOrderForm.get('date').value &&
                        this.repairOrderForm.get('date').valid &&
                        event
                    )
                        this.getDrivers();
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
                                typeOfRepair: this.typeOfRepair,
                                selectedPM: this.selectedPM,
                                selectedPMIndex: this.selectedPMIndex,
                            },
                        },
                        component: RepairShopModalComponent,
                        size: 'small',
                        type: this.repairOrderForm.get('unitType').value,
                    });
                } else {
                    this.selectedRepairShop = event;
                    if (this.selectedRepairShop) {
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

                                this.services = res.serviceTypes.map(
                                    (service) => {
                                        return {
                                            id: service.serviceType.id,
                                            serviceType:
                                                service.serviceType.name,
                                            svg: `assets/svg/common/repair-services/${service.logoName}`,
                                            active: service.active,
                                            notExistInRepairSHop: true,
                                        };
                                    }
                                );
                            });
                    }
                }
                break;
            case 'paid-type':
                if (event) {
                    this.selectedPayType = event;

                    this.payTypeSelected = false;

                    this.repairOrderForm
                        .get('datePaid')
                        .setValidators(Validators.required);

                    this.repairOrderForm
                        .get('datePaid')
                        .updateValueAndValidity();
                } else {
                    this.payTypeSelected = true;

                    this.repairOrderForm.get('datePaid').reset();

                    this.repairOrderForm.get('datePaid').clearValidators();

                    this.repairOrderForm
                        .get('datePaid')
                        .updateValueAndValidity();
                }

                break;
            default: {
                break;
            }
        }
    }

    public activeRepairService(service) {
        service.userSelected = !service.userSelected;
        this.services = [...this.services];

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
            case 'delete': {
                this.documents = event.files;
                this.repairOrderForm
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
                    typeOfRepair: this.typeOfRepair,
                    selectedPM: this.selectedPM,
                    selectedPMIndex: this.selectedPMIndex,
                    editRepairShop: true,
                },
                id: this.selectedRepairShop.id,
            },
            component: RepairShopModalComponent,
            size: 'small',
            type: this.repairOrderForm.get('unitType').value,
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

    private createForm() {
        this.repairOrderForm = this.formBuilder.group({
            repairType: [null],
            repairTypeService: [null],
            orderNo: [null],
            unitType: ['Truck'],
            unit: [null, [Validators.required, ...vehicleUnitValidation]],
            payType: [null],
            odometer: [null, repairOdometerValidation],
            driver: [null],
            date: [null, Validators.required],
            dateOrder: [null],
            datePaid: [null],
            invoice: [null, [Validators.required, ...invoiceValidation]],
            repairShopId: [null, Validators.required],
            descriptions: [null],
            note: [null],
            servicesHelper: [null],
            files: [null],
            tags: [null],
        });
    }

    public totalValue(event$: Subtotal[]): void {
        let total = 0;
        event$.forEach((item: Subtotal) => {
            total += item.subtotal;
        });
        this.total = total;
    }

    public addItem(_: { check: boolean; action: string }): void {
        if (!this.isEachDescriptionRowValid) return;

        this.isDescriptionRowCreated = true;

        setTimeout(() => {
            this.isDescriptionRowCreated = false;
        }, 400);

        this.changeDetector.detectChanges();
    }

    public handleModalTableValueEmit(modalTableDataValue: Subtotal[]): void {
        this.descriptions = modalTableDataValue;

        this.repairOrderForm.get('descriptions').patchValue(this.descriptions);
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
                    if (onlyPMS) {
                        return;
                    }

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
                    this.labelsUnit =
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
                            notExistInRepairSHop: true,
                        };
                    });

                    this.repairOrderForm
                        .get('servicesHelper')
                        .patchValue(JSON.stringify(this.services));

                    // Repair Shops
                    this.labelsRepairShop = [...res.repairShops];

                    this.tags = res.tags;

                    // ------------- EDIT --------------
                    // storage data
                    if (this.editData?.storageData) {
                        this.disableCardAnimation = true;
                        this.populateForm(this.editData?.storageData);
                    }

                    // Edit mode
                    if (this.editData?.type?.includes('edit')) {
                        this.disableCardAnimation = true;
                        this.editRepairById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }

                    // Repair Modal opened from repair shop details
                    if (this.editData?.type === 'specific-repair-shop') {
                        this.selectedRepairShop = this.labelsRepairShop.find(
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
        const { date, unit, odometer, invoice, servicesHelper, ...form } =
            this.repairOrderForm.value;

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

        let newData: any = null;

        if (this.selectedHeaderTab === 2) {
            newData = {
                ...form,
                repairType: 'Order',
                truckId:
                    this.repairOrderForm.get('unitType').value === 'Truck'
                        ? this.selectedUnit.id
                        : null,
                trailerId:
                    this.repairOrderForm.get('unitType').value === 'Trailer'
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
                files: documents,
                tags: tagsArray,
            };
        } else {
            newData = {
                ...form,
                repairType: 'Bill',
                date: convertDateToBackend(date),
                truckId:
                    this.repairOrderForm.get('unitType').value === 'Truck'
                        ? this.selectedUnit.id
                        : null,
                trailerId:
                    this.repairOrderForm.get('unitType').value === 'Trailer'
                        ? this.selectedUnit.id
                        : null,
                repairShopId: this.selectedRepairShop
                    ? this.selectedRepairShop.id
                    : null,
                odometer: odometer ? convertThousanSepInNumber(odometer) : null,
                invoice: invoice,
                serviceTypes: this.services.map((item) => {
                    return {
                        serviceType: item.serviceType,
                        active: item.active,
                    };
                }),
                files: documents,
                total: this.total,
                tags: tagsArray,
            };
        }

        this.repairService
            .addRepair(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
                        this.formService.resetForm(this.repairOrderForm);

                        this.selectedPM = [];
                        this.selectedPMIndex = null;
                        this.selectedRepairShop = null;
                        this.selectedRepairType = null;
                        this.selectedUnit = null;
                        this.selectedHeaderTab = 1;

                        this.headerTabs = this.headerTabs.map((item, index) => {
                            return {
                                ...item,
                                checked: index === 0,
                            };
                        });

                        this.typeOfRepair = this.typeOfRepair.map(
                            (item, index) => {
                                return {
                                    ...item,
                                    checked: index === 0,
                                };
                            }
                        );

                        this.onModalHeaderTabChange({ id: 1 });
                        this.onTypeOfRepair(this.typeOfRepair[0]);

                        this.services = this.services.map((item) => {
                            return {
                                ...item,
                                active: false,
                            };
                        });

                        this.itemsCounter = 0;
                        // this.subtotal = [];
                        this.selectedPM = [];

                        this.documents = [];
                        this.fileModified = null;
                        this.filesForDelete = [];

                        this.addNewAfterSave = false;

                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
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

    private updateRepair(id: number) {
        const { date, unit, odometer, invoice, servicesHelper, ...form } =
            this.repairOrderForm.value;

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
                repairType: 'Order',
                truckId:
                    this.repairOrderForm.get('unitType').value === 'Truck'
                        ? this.selectedUnit.id
                        : null,
                trailerId:
                    this.repairOrderForm.get('unitType').value === 'Trailer'
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
                repairType: 'Bill',
                date: convertDateToBackend(date),
                truckId:
                    this.repairOrderForm.get('unitType').value === 'Truck'
                        ? this.selectedUnit.id
                        : null,
                trailerId:
                    this.repairOrderForm.get('unitType').value === 'Trailer'
                        ? this.selectedUnit.id
                        : null,
                repairShopId: this.selectedRepairShop
                    ? this.selectedRepairShop.id
                    : null,
                odometer: odometer
                    ? convertThousanSepInNumber(
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
                        action: 'delete',
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private populateForm(res: any) {
        res.typeOfRepair.find((item) => item.checked).name === 'Truck'
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
            this.typeOfRepair = res.typeOfRepair;

            // Items
            this.subtotal = [...res.subtotal];

            // PMS-ovi
            this.selectedPM = [...res.selectedPM];

            if (res.items_array.length) {
                this.itemsCounter = 0;
                for (let i = 0; i < res.items_array.length; i++) {
                    this.selectedPMIndex = 0;
                }
            }

            this.onModalHeaderTabChange(
                this.headerTabs.find((item) => item.name === res.repairType)
            );
            clearTimeout(timeout2);
        }, 250);

        setTimeout(() => {
            this.disableCardAnimation = false;
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
                    this.onTypeOfRepair(
                        this.typeOfRepair.find(
                            (item) => item.name === res.unitType.name
                        ),
                        'edit-mode'
                    );

                    this.selectedUnit =
                        res.unitType.name === 'Truck'
                            ? { ...res.truck, name: res.truck.truckNumber }
                            : {
                                  ...res.trailer,
                                  name: res.trailer.trailerNumber,
                              };

                    this.selectedHeaderTab =
                        res.repairType.name === 'Bill' ||
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
                    this.selectedRepairType = res.repairType.name;

                    // Documents
                    this.documents = res.files;

                    // Patch form
                    this.repairOrderForm.patchValue({
                        repairType: res.repairType ? res.repairType.name : null,
                        unitType: res.unitType ? res.unitType.name : null,
                        unit: {
                            name:
                                res.unitType.name === 'Truck'
                                    ? res.truck.truckNumber
                                    : res.trailer.trailerNumber,
                        },
                        odometer:
                            res.odometer &&
                            res.date &&
                            this.selectedHeaderTab === 2
                                ? convertNumberInThousandSep(res.odometer)
                                : null,
                        date:
                            res.date && this.selectedHeaderTab === 2
                                ? convertDateFromBackend(res.date)
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
                                        .get('repairShopId')
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
                        this.disableCardAnimation = false;
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
