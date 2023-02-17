import {
    convertDateFromBackend,
    convertDateToBackend,
    convertNumberInThousandSep,
} from '../../../../utils/methods.calculations';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    FormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { RepairTService } from '../../../repair/state/repair.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { RepairModalResponse, RepairShopResponse } from 'appcoretruckassist';
import {
    NgbActiveModal,
    NgbPopover,
    NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { RepairPmModalComponent } from '../repair-pm-modal/repair-pm-modal.component';
import { TruckModalComponent } from '../../truck-modal/truck-modal.component';
import { TrailerModalComponent } from '../../trailer-modal/trailer-modal.component';
import { RepairShopModalComponent } from '../repair-shop-modal/repair-shop-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../../services/form/form.service';
import { RepairResponse } from '../../../../../../../appcoretruckassist/model/repairResponse';
import { RepairAutocompleteDescriptionResponse } from '../../../../../../../appcoretruckassist/model/repairAutocompleteDescriptionResponse';
import {
    descriptionValidation,
    invoiceValidation,
    priceValidation,
    repairOdometerValidation,
    vehicleUnitValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { DetailsDataService } from '../../../../services/details-data/details-data.service';
import { PriceCalculationArraysPipe } from '../../../../pipes/price-calculation-arrays.pipe';
import {
    convertThousanSepInNumber,
    convertNumberWithCurrencyFormatterToBackend,
} from '../../../../utils/methods.calculations';
import { EditTagsService } from 'src/app/core/services/shared/editTags.service';
import { CommonModule } from '@angular/common';
import { AppTooltipComponent } from '../../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaCustomCardComponent } from '../../../shared/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../../shared/ta-input-note/ta-input-note.component';
import { ActiveItemsPipe } from 'src/app/core/pipes/activeItems.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaCopyComponent } from '../../../shared/ta-copy/ta-copy.component';
import { formatPhonePipe } from '../../../../pipes/formatPhone.pipe';

@Component({
    selector: 'app-repair-order-modal',
    templateUrl: './repair-order-modal.component.html',
    styleUrls: ['./repair-order-modal.component.scss'],
    providers: [PriceCalculationArraysPipe, ModalService, FormService],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AppTooltipComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputDropdownComponent,
        TaInputComponent,
        ReactiveFormsModule,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCopyComponent,
        formatPhonePipe,
        ActiveItemsPipe,
        NgbModule,
        AngularSvgIconModule,
    ],
})
export class RepairOrderModalComponent implements OnInit, OnDestroy {
    @ViewChild('t2') public popoverRef: NgbPopover;
    @Input() editData: any;
    public disableCardAnimation: boolean = false;
    public repairOrderForm: UntypedFormGroup;
    public selectedHeaderTab: number = 1;
    public headerTabs = [
        {
            id: 1,
            name: 'Order',
            checked: true,
        },
        {
            id: 2,
            name: 'Bill',
            checked: false,
        },
    ];
    public typeOfRepair = [
        {
            id: 3,
            name: 'Truck',
            checked: true,
        },
        {
            id: 4,
            name: 'Trailer',
            checked: false,
        },
    ];
    // Unit
    public labelsUnit: any[] = [];
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
    public quantity: any[] = [];
    public itemsCounter: number = 0;
    // PMs
    public selectedPM: any[] = [];
    public selectedPMIndex: number;
    public pmOptions: any[] = []; // this array fill when truck/trailer switch change
    public isFormDirty: boolean;
    public selectedRepairType: any = null;
    public addNewAfterSave: boolean = false;
    public tags: any[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private repairService: RepairTService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        private priceArrayPipe: PriceCalculationArraysPipe,
        private formService: FormService,
        private DetailsDataService: DetailsDataService,
        private tagsService: EditTagsService
    ) {}

    public get items(): UntypedFormArray {
        return this.repairOrderForm.get('items') as UntypedFormArray;
    }

    ngOnInit() {
        this.createForm();

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

    public onModalAction(data: { action: string; bool: boolean }) {
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

    public addItems(event: { check: boolean; action: string }) {
        if (event.check) {
            this.items.push(
                this.createItems({ id: null, orderingId: ++this.itemsCounter })
            );
            this.subtotal = [
                ...this.subtotal,
                { id: this.itemsCounter, value: 0 },
            ];
            this.selectedPM.push({
                id: null,
                logoName: 'assets/svg/common/repair-pm/ic_custom_pm.svg',
            });
        }
    }

    public removeItems(id: number) {
        this.items.removeAt(id);

        const afterDeleting = this.subtotal.splice(id, 1);

        this.subtotal = this.subtotal.filter(
            (item) => item.id !== afterDeleting[0].id
        );

        if (!this.subtotal.length) {
            this.subtotal = [];
            this.itemsCounter = 0;
            this.quantity = [];
        }
    }

    public onChange(formControlName: string, index: number) {
        if (formControlName === 'quantity') {
            this.items
                .at(index)
                .get(formControlName)
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                    if (value) {
                        this.quantity[index] = value;
                        this.subtotal = [...this.subtotal];
                        const price = convertThousanSepInNumber(
                            this.items.at(index).get('price').value
                        );
                        this.subtotal[index].value =
                            this.quantity[index] * price;
                    }
                });
        } else {
            this.items
                .at(index)
                .get(formControlName)
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                    if (value) {
                        if (
                            !this.quantity[index] ||
                            this.quantity[index] === 0
                        ) {
                            this.quantity[index] = 1;
                            this.items.at(index).get('quantity').patchValue(1);
                        }
                        if (!value) {
                            value = 0;
                        }
                        const price = convertThousanSepInNumber(
                            this.items.at(index).get('price').value
                        );
                        this.subtotal = [...this.subtotal];
                        this.subtotal[index].value =
                            this.quantity[index] * price;
                    }
                });
        }
    }

    public onModalHeaderTabChange(event: any) {
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

            if (this.items.length) {
                for (let i = 0; i < this.items.length; i++) {
                    this.inputService.changeValidators(
                        this.items.controls[i].get('description'),
                        false,
                        [],
                        true
                    );
                    this.inputService.changeValidators(
                        this.items.controls[i].get('quantity'),
                        false,
                        [],
                        true
                    );
                    this.inputService.changeValidators(
                        this.items.controls[i].get('price'),
                        false,
                        [],
                        true
                    );
                }
            }

            if (
                this.items.length === 1 &&
                !this.items.controls[0].get('description').value &&
                !this.items.controls[0].get('quantity').value &&
                !this.items.controls[0].get('price').value
            ) {
                this.removeItems(0);
            }
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

            if (!this.items.length) {
                this.addItems({ check: true, action: null });
            }

            if (this.items.length) {
                for (let i = 0; i < this.items.length; i++) {
                    this.inputService.changeValidators(
                        this.items.controls[i].get('description')
                    );
                    this.inputService.changeValidators(
                        this.items.controls[i].get('quantity')
                    );
                    this.inputService.changeValidators(
                        this.items.controls[i].get('price')
                    );
                }
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
            this.pmOptions = [];
            this.selectedPMIndex = null;
        }, 100);
    }

    public onSelectDropDown(event: any, action: string) {
        const { items, ...form } = this.repairOrderForm.value;
        switch (action) {
            case 'repair-unit': {
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
                                items_array: this.items.value,
                                subtotal: this.subtotal,
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
                    if (!event) {
                        this.selectedPM = [];

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
                }
                break;
            }
            case 'repair-shop': {
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
                                items_array: this.items.value,
                                subtotal: this.subtotal,
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
                                },
                                error: () => {},
                            });
                    }
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public activeRepairService(service) {
        service.active = !service.active;
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

    public identity(index: number, item: any): string {
        return item.value;
    }

    public onAction(action: any, index: number) {
        if (action.title !== 'Add New' && this.selectedHeaderTab === 2) {
            this.selectedPM[index] = action;
            this.selectedPMIndex = index;
            this.inputService.changeValidators(
                this.repairOrderForm.get('odometer')
            );
        } else {
            this.inputService.changeValidators(
                this.repairOrderForm.get('odometer'),
                false
            );
        }
        if (action.title === 'Add New') {
            if (!this.editData?.id && !this.selectedUnit?.id) {
                return;
            }
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
                        items_array: this.items.value,
                        subtotal: this.subtotal,
                        selectedPM: this.selectedPM,
                        selectedPMIndex: this.selectedPMIndex,
                        id: this.editData?.id
                            ? this.editData.id
                            : this.selectedUnit.id,
                    },
                },
                component: RepairPmModalComponent,
                size: 'small',
                type: this.repairOrderForm.get('unitType').value,
            });
        }
        this.popoverRef.close();
    }

    private createForm() {
        this.repairOrderForm = this.formBuilder.group({
            repairType: ['Order'],
            unitType: ['Truck'],
            unit: [null, [Validators.required, ...vehicleUnitValidation]],
            odometer: [null, repairOdometerValidation],
            date: [null],
            invoice: [null, invoiceValidation],
            repairShopId: [null],
            items: this.formBuilder.array([]),
            note: [null],
            servicesHelper: [null],
            files: [null],
            tags: [null],
        });

        this.formService.checkFormChange(this.repairOrderForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    private createItems(data?: {
        id: number;
        orderingId: number;
        description?: any;
        price?: any;
        quantity?: any;
        subtotal?: any;
        pmTruckId?: any;
        pmTrailerId?: any;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data.id],
            orderingId: [data.orderingId],
            description: [data.description, [...descriptionValidation]],
            price: [
                data.price === '0' || data.price === 0 ? null : data.price,
                priceValidation,
            ],
            quantity: [
                data.quantity === '0' || data.price == 0 ? null : data.quantity,
            ],
            subtotal: [data.subtotal],
            pmTruckId: [data.pmTruckId],
            pmTrailerId: [data.pmTrailerId],
        });
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
                    // PM Options
                    this.pmOptions = res.pmTrucks?.length
                        ? res.pmTrucks
                        : res.pmTrailers;

                    if (
                        this.pmOptions?.length &&
                        !this.pmOptions?.find(
                            (item) => item.title === 'Add New'
                        )
                    ) {
                        this.pmOptions?.unshift({
                            id: this.pmOptions.length + 1,
                            logoName: null,
                            mileage: null,
                            passedMileage: null,
                            status: null,
                            title: 'Add New',
                        });
                    }

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

        if (this.selectedHeaderTab === 1) {
            newData = {
                ...form,
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
                items: this.premmapedItems(),
                files: documents,
                tags: tagsArray,
            };
        } else {
            newData = {
                ...form,
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
                total:
                    this.repairOrderForm.get('repairType').value === 'Bill'
                        ? this.priceArrayPipe.transform(this.subtotal).slice(1)
                        : null,
                serviceTypes: this.services.map((item) => {
                    return {
                        serviceType: item.serviceType,
                        active: item.active,
                    };
                }),
                items: this.premmapedItems(),
                files: documents,
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

                        this.onTypeOfRepair(this.typeOfRepair[0]);

                        this.services = this.services.map((item) => {
                            return {
                                ...item,
                                active: false,
                            };
                        });

                        this.itemsCounter = 0;
                        this.quantity = [];
                        this.subtotal = [];
                        this.selectedPM = [];
                        this.items.controls = [];
                        setTimeout(() => {
                            this.addItems({ check: true, action: null });
                        }, 100);

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

        if (this.selectedHeaderTab === 1) {
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
                items: this.premmapedItems(),
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
                items: this.premmapedItems(),
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
                    this.items.push(
                        this.createItems({
                            id: res.items_array[i].id,
                            orderingId: ++this.itemsCounter,
                            description: res.items_array[i].description,
                            price: res.items_array[i].price,
                            quantity: res.items_array[i].quantity,
                            subtotal: res.items_array[i].subtotal,
                            pmTruckId: res.items_array[i].pmTruck,
                            pmTrailerId: res.items_array[i].pmTrailer,
                        })
                    );
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
                        unit:
                            res.unitType.name === 'Truck'
                                ? res.truck.truckNumber
                                : res.trailer.trailerNumber,
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

                    // Repair Items
                    if (res.items.length) {
                        for (let i = 0; i < res.items.length; i++) {
                            this.items.push(
                                this.createItems({
                                    id: res.items[i].id,
                                    orderingId: ++this.itemsCounter,
                                    description: res.items[i].description,
                                    price: res.items[i].price
                                        ? convertNumberWithCurrencyFormatterToBackend(
                                              res.items[i].price
                                          )
                                        : null,
                                    quantity: res.items[i].price
                                        ? res.items[i].quantity
                                            ? res.items[i].quantity
                                            : 1
                                        : res.items[i].quantity,
                                    subtotal: res.items[i].subtotal
                                        ? convertNumberWithCurrencyFormatterToBackend(
                                              res.items[i].subtotal
                                          )
                                        : null,
                                    pmTruckId: res.items[i].pmTruck,
                                    pmTrailerId: res.items[i].pmTrailer,
                                })
                            );

                            if (this.selectedHeaderTab === 2) {
                                this.inputService.changeValidators(
                                    this.repairOrderForm.get('odometer'),
                                    !!res.items[i].pmTruck ||
                                        !!res.items[i].pmTrailer,
                                    [],
                                    false
                                );
                            }

                            this.subtotal = [
                                ...this.subtotal,
                                {
                                    id: res.items[i].id,
                                    value: res.items[i].subtotal
                                        ? res.items[i].subtotal
                                        : 0,
                                },
                            ];

                            if (res.unitType.name === 'Truck') {
                                this.selectedPM.push({
                                    id: res.items[i].pmTruck?.id,
                                    logoName: `assets/svg/common/repair-pm/${
                                        res.items[i].pmTruck?.logoName
                                            ? res.items[i].pmTruck.logoName
                                            : 'ic_custom_pm.svg'
                                    }`,
                                });
                            } else {
                                this.selectedPM.push({
                                    id: res.items[i].pmTrailer?.id,
                                    logoName: `assets/svg/common/repair-pm/${
                                        res.items[i].pmTrailer?.logoName
                                            ? res.items[i].pmTrailer.logoName
                                            : 'ic_custom_pm.svg'
                                    }`,
                                });
                            }

                            this.selectedPMIndex = res.items.length;
                        }
                    }
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private premmapedItems() {
        return this.items.controls.map((item, index) => {
            return {
                description: item.get('description').value,
                price:
                    this.selectedHeaderTab === 2
                        ? item.get('price').value
                        : null,
                quantity: item.get('quantity').value,
                subtotal:
                    this.selectedHeaderTab === 2
                        ? this.subtotal[index].value
                            ? convertNumberWithCurrencyFormatterToBackend(
                                  this.subtotal[index].value
                              )
                            : null
                        : null,
                pmTruckId:
                    this.repairOrderForm.get('unitType').value === 'Truck'
                        ? this.selectedPM[index]?.id
                            ? this.selectedPM[index].id
                            : null
                        : null,
                pmTrailerId:
                    this.repairOrderForm.get('unitType').value === 'Trailer'
                        ? this.selectedPM[index]?.id
                            ? this.selectedPM[index].id
                            : null
                        : null,
            };
        });
    }

    public onBlurDescription(ind: number) {
        const description = this.items.at(ind).get('description').value;

        if (description) {
            this.repairService
                .autocompleteRepairByDescription(description)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res: RepairAutocompleteDescriptionResponse) => {
                        console.log('autocomplete: ', res);
                    },
                    error: (error) => {
                        console.log(error);
                    },
                });
        }
    }

    public openRepairShop() {
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
                    items_array: this.items.value,
                    subtotal: this.subtotal,
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
