import {
    convertDateFromBackend,
    convertThousanSepInNumber,
} from '../../../../utils/methods.calculations';
import { SumArraysPipe } from '../../../../pipes/sum-arrays.pipe';
import { NotificationService } from '../../../../services/notification/notification.service';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepairTService } from '../../../repair/state/repair.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import {
    RepairModalResponse,
    RepairResponse,
    RepairShopResponse
} from 'appcoretruckassist';
import { NgbActiveModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { RepairPmModalComponent } from '../repair-pm-modal/repair-pm-modal.component';
import { TruckModalComponent } from '../../truck-modal/truck-modal.component';
import { TrailerModalComponent } from '../../trailer-modal/trailer-modal.component';
import { RepairShopModalComponent } from '../repair-shop-modal/repair-shop-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../../services/form/form.service';
import {
    convertDateToBackend,
    convertNumberInThousandSep,
} from '../../../../utils/methods.calculations';
import {
    descriptionValidation,
    invoiceValidation,
    priceValidation,
    repairOdometerValidation,
    vehicleUnitValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

@Component({
    selector: 'app-repair-order-modal',
    templateUrl: './repair-order-modal.component.html',
    styleUrls: ['./repair-order-modal.component.scss'],
    providers: [SumArraysPipe, ModalService, FormService],
})
export class RepairOrderModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @ViewChild('t2') public popoverRef: NgbPopover;

    @Input() editData: any;

    public repairOrderForm: FormGroup;
    public selectedHeaderTab: number = 1;
    public headerTabs = [
        {
            id: 1,
            name: 'Bill',
            checked: true,
        },
        {
            id: 2,
            name: 'Order',
            checked: false,
        },
    ];

    public typeOfRepair = [
        {
            id: 5231,
            name: 'Truck',
            checked: true,
        },
        {
            id: 5232,
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

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private repairService: RepairTService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        private ngbActiveModal: NgbActiveModal,
        private sumArrayPipe: SumArraysPipe,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();

        this.getRepairDropdowns();

        if (this.editData?.storageData) {
            this.populateForm(this.editData?.storageData);
        }

        if (this.editData?.type?.includes('edit')) {
            this.editRepairById(this.editData.id);
        } else {
            setTimeout(() => {
                if (this.editData?.type?.toLowerCase().includes('trailer')) {
                    this.onTypeOfRepair(
                        this.typeOfRepair.find(
                            (item) => item.name === 'Trailer'
                        ),
                        'true'
                    );
                } else {
                    this.onTypeOfRepair(
                        this.typeOfRepair.find((item) => item.name === 'Truck'),
                        'true'
                    );
                }
            }, 100);
        }
    }

    private createForm() {
        this.repairOrderForm = this.formBuilder.group({
            repairType: ['Bill'],
            unitType: ['Truck'],
            unit: [null, [Validators.required, ...vehicleUnitValidation]],
            odometer: [null, repairOdometerValidation],
            date: [null, Validators.required],
            invoice: [null, invoiceValidation],
            repairShopId: [null, Validators.required],
            items: this.formBuilder.array([]),
            note: [null],
            files: [null],
        });

        this.formService.checkFormChange(this.repairOrderForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
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
                    });
                } else {
                    this.addRepair();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
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
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    public get items(): FormArray {
        return this.repairOrderForm.get('items') as FormArray;
    }

    private createItems(data?: {
        id: number;
        description?: any;
        price?: any;
        quantity?: any;
        subtotal?: any;
        pmTruckId?: any;
        pmTrailerId?: any;
    }): FormGroup {
        return this.formBuilder.group({
            id: [data.id],
            description: [data.description, [...descriptionValidation]],
            price: [data.price, priceValidation],
            quantity: [data.quantity],
            subtotal: [data.subtotal],
            pmTruckId: [data.pmTruckId],
            pmTrailerId: [data.pmTrailerId],
        });
    }

    public addItems(event: { check: boolean; action: string }) {
        if (event.check) {
            this.items.push(this.createItems({ id: ++this.itemsCounter }));
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
                    this.quantity[index] = value;
                    this.subtotal = [...this.subtotal];
                    const price = convertThousanSepInNumber(
                        this.items.at(index).get('price').value
                    );
                    this.subtotal[index].value = this.quantity[index] * price;
                });
        } else {
            this.items
                .at(index)
                .get(formControlName)
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                    if (!this.quantity[index] || this.quantity[index] === 0) {
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
                    this.subtotal[index].value = this.quantity[index] * price;
                });
        }
    }

    public onModalHeaderTabChange(event: any) {
        this.selectedHeaderTab = event.id;
        if (event.id === 2) {
            this.inputService.changeValidators(
                this.repairOrderForm.get('repairShopId'),
                false
            );
            this.inputService.changeValidators(
                this.repairOrderForm.get('date'),
                false,
                [],
                true
            );
            this.inputService.changeValidators(
                this.repairOrderForm.get('odometer'),
                false,
                [],
                true
            );
            this.inputService.changeValidators(
                this.repairOrderForm.get('invoice'),
                false,
                [],
                true
            );
            this.repairOrderForm.get('repairType').patchValue('Order');
        } else {
            this.inputService.changeValidators(
                this.repairOrderForm.get('repairShopId')
            );
            this.inputService.changeValidators(
                this.repairOrderForm.get('date')
            );
            this.repairOrderForm.get('repairType').patchValue('Bill');

            if (this.selectedPMIndex) {
                this.inputService.changeValidators(
                    this.repairOrderForm.get('odometer')
                );
            }
        }

        this.headerTabs = this.headerTabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });
    }

    public onTypeOfRepair(event: any, action?: string) {
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

        if (action) {
            return;
        }

        this.repairOrderForm.get('unit').patchValue(null);
        this.selectedUnit = null;
        this.selectedPM = [];
        this.selectedPM.push({
            id: null,
            logoName: 'assets/svg/common/repair-pm/ic_custom_pm.svg',
        });
        this.selectedPMIndex = null;
    }

    public onSelectDropDown(event: any, action: string) {
        const { items, ...form } = this.repairOrderForm.value;
        switch (action) {
            case 'repair-unit': {
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
                    this.typeOfRepair.find((item) => item.checked).name ===
                    'Truck'
                        ? this.getRepairDropdowns(this.selectedUnit?.id, null)
                        : this.getRepairDropdowns(null, this.selectedUnit?.id);
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
                                error: () => {
                                    this.notificationService.error(
                                        `Cant' get repair shop by ${this.selectedRepairShop.id}`,
                                        'Error'
                                    );
                                },
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

    public pickedServices() {
        return this.services.filter((item) => item.active).length;
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.repairOrderForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
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
            default: {
                break;
            }
        }
    }

    public identity(index: number, item: any): string {
        return item.value;
    }

    private getRepairDropdowns(truckId?: number, trailerId?: number) {
        this.repairService
            .getRepairModalDropdowns(truckId, trailerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairModalResponse) => {
                    // PM Trucks
                    if (res.pmTrucks?.length) {
                        this.pmOptions = res.pmTrucks.map((item) => {
                            return {
                                ...item,
                                logoName: item.logoName,
                            };
                        });
                    }

                    if (res.pmTrailers?.length) {
                        // // PM Trailers
                        this.pmOptions = res.pmTrailers.map((item) => {
                            return {
                                ...item,
                                logoName: item.logoName,
                            };
                        });
                    }

                    if (
                        !this.pmOptions.find((item) => item.title === 'Add New')
                    ) {
                        this.pmOptions.unshift({
                            id: this.pmOptions.length + 1,
                            logoName: null,
                            mileage: null,
                            passedMileage: null,
                            status: null,
                            title: 'Add New',
                        });
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

                    // Services
                    this.services = res.serviceTypes.map((item) => {
                        return {
                            id: item.serviceType.id,
                            serviceType: item.serviceType.name,
                            svg: `assets/svg/common/repair-services/${item.logoName}`,
                            active: false,
                        };
                    });
                    this.labelsRepairShop = [...res.repairShops];
                },
                error: () => {
                    this.notificationService.error(
                        "Repair Dropdowns can't be loaded"
                    );
                },
            });
    }

    public onAction(action: any, index: number) {
        if (action.title !== 'Add New' && this.selectedHeaderTab === 1) {
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
                this.notificationService.warning(
                    'Please select first reapir unit!',
                    'Warning'
                );
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

    private addRepair() {
        const { date, unit, odometer, invoice, ...form } =
            this.repairOrderForm.value;

        const documents = this.documents.map((item) => {
            return item.realFile;
        });

        let newData: any = null;

        if (this.selectedHeaderTab === 2) {
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
                        ? this.sumArrayPipe.transform(this.subtotal)
                        : null,
                serviceTypes: this.services.map((item) => {
                    return {
                        serviceType: item.serviceType,
                        active: item.active,
                    };
                }),
                items: this.premmapedItems(),
                files: documents,
            };
        }

        this.repairService
            .addRepair(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Repair successfully created.',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Repair can't be created.",
                        'Error'
                    );
                },
            });
    }

    private updateRepair(id: number) {
        const { date, unit, odometer, invoice, ...form } =
            this.repairOrderForm.value;

        const documents = this.documents.map((item) => {
            return item.realFile;
        });

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
                items: this.premmapedItems(),
                files: documents ? documents : this.repairOrderForm.value.files,
                filesForDeleteIds: this.filesForDelete,
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
                    ? this.sumArrayPipe.transform(this.subtotal)
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
            };
        }

        this.repairService
            .updateRepair(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Repair successfully updated.',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Repair can't be updated.",
                        'Error'
                    );
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
                    this.notificationService.success(
                        'Repair successfully deleted.',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Repair can't be deleted.",
                        'Error'
                    );
                },
            });
    }

    private populateForm(res: any) {
        const timeout = setTimeout(() => {
            res.typeOfRepair.find((item) => item.checked).name === 'Truck'
                ? this.getRepairDropdowns(res.selectedUnit?.id, null)
                : this.getRepairDropdowns(null, res.selectedUnit?.id);

            const timeout2 = setTimeout(() => {
                this.repairOrderForm.patchValue({
                    repairType: res.repairType,
                    unitType: res.unitType,
                    unit: res.unit,
                    odometer: res.odometer,
                    date: res.date,
                    invoice: res.invoice,
                    repairShopId: res.repairShopId,
                    note: res.note,
                });

                // Truck/Trailer Unit number
                this.selectedUnit = res.selectedUnit;

                // Repair Services
                this.services = [...res.services];

                // Repair Shop
                this.selectedRepairShop = res.selectedRepairShop;

                this.headerTabs = [...res.headerTabs];
                this.selectedHeaderTab = res.selectedHeaderTab;

                this.typeOfRepair = res.typeOfRepair;

                // Items
                this.subtotal = [...res.subtotal];

                this.selectedPM = [...res.selectedPM];

                if (res.items_array.length) {
                    for (const iterator of res.items_array) {
                        this.items.push(
                            this.createItems({
                                id: iterator.id,
                                description: iterator.description,
                                price: iterator.price,
                                quantity: iterator.quantity,
                                subtotal: iterator.subtotal,
                                pmTruckId: iterator.pmTruck,
                                pmTrailerId: iterator.pmTrailer,
                            })
                        );
                        this.selectedPMIndex = 0;
                    }
                }
                clearTimeout(timeout2);
            }, 250);

            clearTimeout(timeout);
        }, 400);
    }

    private editRepairById(id: number) {
        this.repairService
            .getRepairById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairResponse) => {
                    if (!this.editData.type.includes('fo')) {
                        this.onModalHeaderTabChange(
                            this.headerTabs.find(
                                (item) => item.name === res.repairType.name
                            )
                        );
                    }

                    this.onTypeOfRepair(
                        this.typeOfRepair.find(
                            (item) => item.name === res.unitType.name
                        ),
                        'edit-mode'
                    );

                    this.documents = res.files;

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
                            this.selectedHeaderTab === 1
                                ? convertNumberInThousandSep(res.odometer)
                                : null,
                        date:
                            res.date && this.selectedHeaderTab === 1
                                ? convertDateFromBackend(res.date)
                                : null,
                        invoice:
                            res.date && this.selectedHeaderTab === 1
                                ? res.invoice
                                : null,
                        repairShopId: res.repairShop ? res.repairShop.id : null,
                        items: [],
                        note: res.note,
                    });

                    // Truck/Trailer Unit number
                    this.selectedUnit =
                        res.unitType.name === 'Truck' ? res.truck : res.trailer;

                    // Repair Services
                    this.services = res.serviceTypes.map((item) => {
                        return {
                            id: item.serviceType.id,
                            serviceType: item.serviceType.name,
                            svg: `assets/svg/common/repair-services/${item.logoName}`,
                            active: item.active,
                        };
                    });

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
                                },
                                error: () => {
                                    this.notificationService.error(
                                        `Cant' get repair shop by ${this.selectedRepairShop.id}`,
                                        'Error'
                                    );
                                },
                            });
                    }

                    // Repair Items
                    if (res.items.length) {
                        for (const iterator of res.items) {
                            this.items.push(
                                this.createItems({
                                    id: iterator.id,
                                    description: iterator.description,
                                    price: iterator.price ? iterator.price : 0,
                                    quantity: iterator.price
                                        ? iterator.quantity
                                            ? iterator.quantity
                                            : 1
                                        : iterator.quantity,
                                    subtotal: iterator.subtotal
                                        ? iterator.subtotal
                                        : 0,
                                    pmTruckId: iterator.pmTruck,
                                    pmTrailerId: iterator.pmTrailer,
                                })
                            );
                            this.selectedPMIndex = 0;

                            if (this.selectedHeaderTab === 1) {
                                this.inputService.changeValidators(
                                    this.repairOrderForm.get('odometer')
                                );
                            }
                            this.subtotal = [
                                ...this.subtotal,
                                {
                                    id: iterator.id,
                                    value: iterator.subtotal
                                        ? iterator.subtotal
                                        : 0,
                                },
                            ];

                            if (res.unitType.name === 'Truck') {
                                this.selectedPM.push({
                                    id: iterator.pmTruck
                                        ? iterator.pmTruck.id
                                        : null,
                                    logoName: `assets/svg/common/repair-pm/${
                                        iterator.pmTruck
                                            ? iterator.pmTruck.logoName
                                            : 'ic_custom_pm.svg'
                                    }`,
                                });
                            } else {
                                this.selectedPM.push({
                                    id: iterator.pmTrailer
                                        ? iterator.pmTrailer.id
                                        : null,
                                    logoName: `assets/svg/common/repair-pm/${
                                        iterator.pmTrailer
                                            ? iterator.pmTrailer.logoName
                                            : 'ic_custom_pm.svg'
                                    }`,
                                });
                            }
                        }
                    }
                },
                error: () => {
                    this.notificationService.error(
                        "Repair can't be loaded.",
                        'Error'
                    );
                },
            });
    }

    private premmapedItems() {
        return this.items.controls.map((item, index) => {
            return {
                description: item.get('description').value,
                price:
                    this.selectedHeaderTab === 1
                        ? item.get('price').value
                            ? convertThousanSepInNumber(item.get('price').value)
                            : null
                        : null,
                quantity: item.get('quantity').value,
                subtotal:
                    this.selectedHeaderTab === 1
                        ? this.subtotal[index].value
                            ? this.subtotal[index].value
                            : null
                        : null,
                pmTruckId:
                    this.repairOrderForm.get('unitType').value === 'Truck'
                        ? this.selectedPM
                            ? this.selectedPM[index].id
                            : null
                        : null,
                pmTrailerId:
                    this.repairOrderForm.get('unitType').value === 'Trailer'
                        ? this.selectedPM
                            ? this.selectedPM[index].id
                            : null
                        : null,
            };
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
