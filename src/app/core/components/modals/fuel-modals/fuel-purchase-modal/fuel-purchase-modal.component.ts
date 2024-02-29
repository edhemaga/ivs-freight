import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Subject, takeUntil, switchMap, of } from 'rxjs';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from '../../../../services/form/form.service';
import { FuelTService } from '../../../fuel/state/fuel.service';
import { GetFuelModalResponse } from '../../../../../../../appcoretruckassist/model/getFuelModalResponse';
import { FuelDispatchHistoryResponse } from '../../../../../../../appcoretruckassist/model/fuelDispatchHistoryResponse';
import { FuelStopFranchiseResponse } from '../../../../../../../appcoretruckassist/model/fuelStopFranchiseResponse';
import {
    combineDateAndTimeToBackend,
    convertDateToBackend,
    convertThousanSepInNumber,
} from '../../../../utils/methods.calculations';
import { SumArraysPipe } from '../../../../pipes/sum-arrays.pipe';
import { TruckTService } from '../../../truck/state/truck.service';
import { TruckMinimalListResponse } from '../../../../../../../appcoretruckassist/model/truckMinimalListResponse';
import { EnumValue } from '../../../../../../../appcoretruckassist/model/enumValue';

import {
    convertDateFromBackend,
    convertNumberInThousandSep,
} from '../../../../utils/methods.calculations';
import {
    priceValidation,
    fullNameValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { FuelTransactionResponse } from 'appcoretruckassist';
import { CommonModule } from '@angular/common';
import { AppTooltipComponent } from '../../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaCustomCardComponent } from '../../../shared/ta-custom-card/ta-custom-card.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaUploadFilesComponent } from '../../../shared/ta-upload-files/ta-upload-files.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-fuel-purchase-modal',
    templateUrl: './fuel-purchase-modal.component.html',
    styleUrls: ['./fuel-purchase-modal.component.scss'],
    providers: [ModalService, FormService, SumArraysPipe],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,

        // Component
        AppTooltipComponent,
        TaModalComponent,
        TaInputComponent,
        TaCustomCardComponent,
        TaInputDropdownComponent,
        TaUploadFilesComponent,

        // Pipe
        SumArraysPipe,
    ],
})
export class FuelPurchaseModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public fuelForm: UntypedFormGroup;

    public truckType: any[] = [];
    public fuelStops: any[] = [];

    public selectedTruckType: any = null;
    public selectedTrailerType: any = null;
    public selectedFuelStop: any = null;
    public selectedDispatchHistory: any = null;

    public selectedFuelItemDropFArray: any[] = [];
    public fuelItemsDropdown: any[] = [];
    public fuelItemsCounter: number = 0;
    public subtotal: { value: number; reorderingNumber: number }[] = [];
    public quantity: any[] = [];

    public bluringFuelItemsPrice: any[] = [];

    public documents: any[] = [];

    public fuelTransactionType: EnumValue = null;

    public isFormDirty: boolean;

    public fuelTransactionName: string = null;

    public disableCardAnimation: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private fuelService: FuelTService,
        private sumArrays: SumArraysPipe,
        private truckService: TruckTService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        this.getFuelTransactionFranchises();
        this.getTruckList();

        this.getDriverTrailerBySelectedTruck();
    }

    private createForm() {
        this.fuelForm = this.formBuilder.group({
            efsAccount: [null],
            fuelCard: [null],
            invoice: [null, Validators.required],
            truckId: [null, Validators.required],
            trailerId: [null],
            driverFullName: [null, fullNameValidation],
            transactionDate: [null, Validators.required],
            transactionTime: [null, Validators.required],
            fuelStopStoreId: [null, Validators.required],
            fuelItems: this.formBuilder.array([]),
            total: [null],
        });

        if (this.editData?.type !== 'edit') {
            this.addFuelItems({ check: true, action: null });
        }
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.fuelForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.fuelForm);
                    return;
                }
                if (this.editData) {
                    this.fuelTransactionType?.name !== 'Manual'
                        ? this.updateFuelEFS(this.editData.id)
                        : this.updateFuel(this.editData.id);

                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addFuel();
                    this.modalService.setModalSpinner({
                        action: null,
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

    public get fuelItems(): UntypedFormArray {
        return this.fuelForm.get('fuelItems') as UntypedFormArray;
    }

    private createFuelItems(data?: {
        id?: number;
        reorderingNumber?: number;
        itemId?: string;
        qty?: string;
        price?: string;
        subtotal?: string;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : 0],
            reorderingNumber: [
                data.reorderingNumber ? data.reorderingNumber : null,
            ],
            itemId: [data?.itemId ? data.itemId : null, Validators.required],
            qty: [data?.qty ? data?.qty : 1],
            price: [
                data?.price && !data?.price && data?.price !== undefined
                    ? data.price
                    : null,
                [...priceValidation],
            ],
            subtotal: [[data?.subtotal ? data.subtotal : null]],
        });
    }

    public addFuelItems(event: { check: boolean; action: string }) {
        if (event.check) {
            this.fuelItems.push(
                this.createFuelItems({
                    reorderingNumber: ++this.fuelItemsCounter,
                })
            );
            this.subtotal = [
                ...this.subtotal,
                { reorderingNumber: this.fuelItemsCounter, value: 0 },
            ];

            this.bluringFuelItemsPrice.push(false);
        }
    }

    public removeFuelItems(id: number) {
        this.fuelItems.removeAt(id);
        this.selectedFuelItemDropFArray.splice(id, 1);
        this.bluringFuelItemsPrice.splice(id, 1);
        const afterDeleting = this.subtotal.splice(id, 1);

        this.subtotal = this.subtotal.filter(
            (item) =>
                item.reorderingNumber !== afterDeleting[0].reorderingNumber
        );

        if (!this.subtotal.length) {
            this.selectedFuelItemDropFArray = [];
            this.bluringFuelItemsPrice = [];
            this.subtotal = [];
            this.fuelItemsCounter = 0;
            this.quantity = [];
        }
    }

    public onChange(formControlName: string, index: number) {
        if (formControlName === 'qty') {
            this.fuelItems
                .at(index)
                .get(formControlName)
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                    this.quantity[index] = value ? value : 1;
                    if (!value) {
                        this.fuelItems
                            .at(index)
                            .get(formControlName)
                            .patchValue(1);
                    }

                    this.subtotal = [...this.subtotal];

                    if (this.fuelItems.at(index).get('price').value) {
                        const price = parseInt(
                            this.fuelItems
                                .at(index)
                                .get('price')
                                .value?.toString()
                                ?.replace(/,/g, '')
                        );
                        this.subtotal[index].value =
                            this.quantity[index] * price;
                        this.fuelItems
                            .at(index)
                            .get('subtotal')
                            .patchValue(this.subtotal[index].value);
                    }
                });
        } else {
            this.fuelItems
                .at(index)
                .get(formControlName)
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                    if (
                        !this.quantity[index] ||
                        (this.quantity[index] === 0 && value)
                    ) {
                        this.quantity[index] = 1;
                        this.fuelItems.at(index).get('qty').patchValue(1);
                    }

                    const price = parseInt(
                        value?.toString()?.replace(/,/g, '')
                    );
                    this.subtotal = [...this.subtotal];
                    this.subtotal[index].value = this.quantity[index] * price;
                    this.fuelItems
                        .at(index)
                        .get('subtotal')
                        .patchValue(this.subtotal[index].value);
                });
        }
    }

    public onSelectDropDown(event: any, action: string, index?: number) {
        switch (action) {
            case 'truck': {
                this.selectedTruckType = event;
                this.getDriverTrailerBySelectedTruck('truckId');

                break;
            }
            case 'fuel': {
                this.selectedFuelStop = event;
                break;
            }
            case 'fuel-items': {
                this.selectedFuelItemDropFArray[index] = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
    }

    private updateFuel(id: number) {
        const { ...form } = this.fuelForm.value;
        const newData: any = {
            id: id,
            truckId: this.selectedTruckType.id,
            trailerId: this.selectedTrailerType
                ? this.selectedTrailerType.id
                : null,
            fuelStopStoreId: this.selectedFuelStop
                ? this.selectedFuelStop.isFranchise
                    ? this.selectedFuelStop.storeId
                    : this.selectedFuelStop.id
                : null,
            transactionDate: combineDateAndTimeToBackend(
                form.transactionDate,
                form.transactionTime
            ),
            invoice: this.fuelForm.get('invoice').value,
            total: this.sumArrays.transform(this.subtotal),
            fuelItems: this.premmapedItems('update') as any,
            files: [],
            filesForDeleteIds: [],
        };

        this.fuelService
            .updateFuelTransaction(newData)
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

    private updateFuelEFS(id: number) {
        const newData: any = {
            id: id,
            truckId: this.selectedTruckType.id,
            trailerId: this.selectedTrailerType
                ? this.selectedTrailerType.id
                : null,
            files: [],
            filesForDeleteIds: [],
        };

        this.fuelService
            .updateFuelTransactionEFS(newData)
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

    private addFuel() {
        const { ...form } = this.fuelForm.value;

        const newData: any = {
            driverId: this.selectedDispatchHistory
                ? this.selectedDispatchHistory.driverId
                : null,
            truckId: this.selectedTruckType ? this.selectedTruckType.id : null,
            invoice: this.fuelForm.get('invoice').value,
            trailerId: this.selectedTrailerType
                ? this.selectedTrailerType.id
                : null,
            fuelStopStoreId: this.selectedFuelStop
                ? this.selectedFuelStop.isFranchise
                    ? this.selectedFuelStop.storeId
                    : this.selectedFuelStop.id
                : null,
            transactionDate: combineDateAndTimeToBackend(
                form.transactionDate,
                form.transactionTime
            ),
            total: this.sumArrays.transform(this.subtotal),
            fuelItems: this.premmapedItems('create') as any,
            files: [],
            filesForDeleteIds: [],
        };
        this.fuelService
            .addFuelTransaction(newData)
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

    private getFuelById(id: number) {
        this.fuelService
            .getFuelTransactionById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: FuelTransactionResponse) => {
                    this.fuelForm.patchValue({
                        efsAccount: null,
                        fuelCard: res.fuelCard,
                        truckId: res.truck ? res.truck.truckNumber : null,
                        invoice: res.invoice,
                        trailerId: res.trailer
                            ? res.trailer.trailerNumber
                            : null,
                        driverFullName: res.driver
                            ? res.driver.firstName.concat(
                                  ' ',
                                  res.driver.lastName
                              )
                            : null,
                        transactionDate: convertDateFromBackend(
                            res.transactionDate
                        ),
                        transactionTime: convertDateToBackend(
                            res.transactionDate
                        ),
                        fuelStopStoreId: res.fuelStopStore
                            ? res.fuelStopStore.fuelStopFranchise
                                ? res.fuelStopStore.store
                                : res.fuelStopStore.businessName
                            : null,
                        fuelItems: [],
                        total: res.total,
                    });

                    this.selectedTruckType = {
                        id: res.truck.id,
                        number: res.truck.truckNumber,
                        logoName: res.truck.truckType.logoName,
                        name: res.truck.truckNumber,
                        folder: 'common',
                        subFolder: 'trucks',
                    };

                    this.getDriverTrailerBySelectedTruck('truckId');

                    this.selectedDispatchHistory = {
                        ...this.selectedDispatchHistory,
                        driverId: res.driver?.id,
                    };

                    if (!res.fuelStopStore.fuelStopFranchise) {
                        this.selectedFuelStop = {
                            id: res.fuelStopStore.id,
                            name: res.fuelStopStore.businessName,
                            businessName: res.fuelStopStore.businessName,
                            fuelStopFranchise: null,
                            address: res.fuelStopStore.address,
                            fullAddress: res.fuelStopStore.address.address,
                            isFranchise: false,
                        };
                    } else {
                        this.selectedFuelStop = {
                            storeId: res.fuelStopStore.id,
                            name: res.fuelStopStore.store,
                            businessName:
                                res.fuelStopStore.fuelStopFranchise
                                    .businessName,
                            fuelStopFranchise:
                                res.fuelStopStore.fuelStopFranchise,
                            address: res.fuelStopStore.address,
                            fullAddress: res.fuelStopStore.address.address,
                            isFranchise: true,
                        };
                    }

                    this.fuelTransactionType = res.fuelTransactionType;

                    this.fuelTransactionName = res.truck
                        ? res.truck.truckNumber
                        : null;

                    if (res.fuelItems.length) {
                        for (let i = 0; i < res.fuelItems.length; i++) {
                            this.fuelItems.push(
                                this.createFuelItems({
                                    id: res.fuelItems[i]?.id,
                                    reorderingNumber: ++this.fuelItemsCounter,
                                    itemId: res.fuelItems[i]?.itemFuel.name,
                                    qty: res.fuelItems[i]?.qty.toString(),
                                    price: res.fuelItems[i]?.price
                                        ? convertNumberInThousandSep(
                                              res.fuelItems[i].price
                                          )
                                        : null,
                                    subtotal: res.fuelItems[i]?.subtotal
                                        ? convertNumberInThousandSep(
                                              res.fuelItems[i].subtotal
                                          )
                                        : null,
                                })
                            );
                            this.selectedFuelItemDropFArray[i] =
                                res.fuelItems[i].itemFuel;

                            this.subtotal = [
                                ...this.subtotal,
                                {
                                    reorderingNumber: this.fuelItemsCounter,
                                    value: res.fuelItems[i]?.subtotal,
                                },
                            ];

                            this.bluringFuelItemsPrice.push(false);
                        }
                    }

                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getModalDropdowns() {
        this.fuelService
            .getFuelTransactionModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetFuelModalResponse) => {
                    this.fuelItemsDropdown = res.itemFuel;

                    if (this.editData?.type === 'edit') {
                        this.disableCardAnimation = true;
                        this.getFuelById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    private getDriverTrailerBySelectedTruck(
        formControlName: string = 'transactionDate'
    ) {
        this.fuelForm
            .get(formControlName)
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                switchMap(() => {
                    if (
                        this.selectedTruckType &&
                        this.fuelForm.get('transactionDate').value
                    ) {
                        return this.fuelService.getDriverBySelectedTruckAndDate(
                            this.selectedTruckType.id,
                            this.fuelForm.get('transactionDate').value
                        );
                    } else {
                        return of();
                    }
                })
            )
            .subscribe((res: FuelDispatchHistoryResponse | null) => {
                if (res) {
                    this.selectedDispatchHistory = res;
                    this.fuelForm
                        .get('driverFullName')
                        .patchValue(res.firstName.concat(' ', res.lastName));
                }
            });
    }

    private getFuelTransactionFranchises(
        pageIndex: number = 1,
        pageSize: number = 25
    ) {
        this.fuelService
            .getFuelTransactionFranchises(pageIndex, pageSize)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.fuelStops = [
                        ...this.fuelStops,
                        ...res.pagination.data.map((item) => {
                            return {
                                id: item.id,
                                count: item.count,
                                businessName: item.businessName,
                                stores: !item.fuelStopStores
                                    ? []
                                    : item.fuelStopStores,
                                open: false,
                                hover: false,
                                isFranchise: item.isFranchise,
                            };
                        }),
                    ];
                    this.fuelStops = this.fuelStops.filter(
                        (v, i, a) =>
                            a.findIndex(
                                (v2) => v2.businessName === v.businessName
                            ) === i
                    );
                },
                error: () => {},
            });
    }

    public paginationFuelStopPage(pageIndex: number) {
        this.getFuelTransactionFranchises(pageIndex, 25);
    }

    public getFuelStoresByFranchiseId(franchise: any) {
        this.fuelService
            .getFuelTransactionStoresByFranchiseId(franchise.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: FuelStopFranchiseResponse) => {
                    const fuelStop = this.fuelStops.find(
                        (item) => item.id === franchise.id
                    );
                    fuelStop.stores = res.fuelStopStores.map((item) => {
                        return {
                            id: item.id,
                            name: item.store,
                            address: item.address.city
                                .concat(', ', item.address.stateShortName)
                                .concat(' ', item.address.streetNumber),
                            fullAddress: item.address.address,
                        };
                    });
                },
                error: () => {},
            });
    }

    private getTruckList(pageIndex: number = 1, pageSize: number = 25) {
        this.truckService
            .getTrucksMinimalList(pageIndex, pageSize)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TruckMinimalListResponse) => {
                    this.truckType = [
                        ...this.truckType,
                        ...res.pagination.data.map((item) => {
                            return {
                                id: item.id,
                                number: item.truckNumber,
                                logoName: item.truckType.logoName,
                                name: item.truckNumber,
                                folder: 'common',
                                subFolder: 'trucks',
                            };
                        }),
                    ];
                    this.truckType = this.truckType.filter(
                        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
                    );
                },
                error: () => {},
            });
    }

    public truckListPagination(pageIndex: number) {
        this.getTruckList(pageIndex, 25);
    }

    private premmapedItems(crud: string) {
        if (crud === 'update') {
            return this.fuelItems.controls.map((item) => {
                return {
                    itemfuel: item.get('itemId').value,
                    price: item.get('price').value
                        ? convertThousanSepInNumber(item.get('price').value)
                        : null,
                    qty: item.get('qty').value
                        ? parseInt(item.get('qty').value)
                        : null,
                    subtotal: parseInt(item.get('subtotal').value),
                };
            });
        } else {
            return this.fuelItems.controls.map((item, index) => {
                return {
                    itemfuel: this.selectedFuelItemDropFArray[index]
                        ? this.selectedFuelItemDropFArray[index].id
                        : null,
                    price: item.get('price').value
                        ? convertThousanSepInNumber(item.get('price').value)
                        : null,
                    qty: item.get('qty').value
                        ? parseInt(item.get('qty').value)
                        : null,
                    subtotal: parseInt(item.get('subtotal').value),
                };
            });
        }
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.fuelForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
