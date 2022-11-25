import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, switchMap, of } from 'rxjs';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from '../../../../services/form/form.service';
import { FuelTService } from '../../../fuel/state/fuel.service';
import { NotificationService } from '../../../../services/notification/notification.service';
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
import { FuelTransactionResponse } from '../../../../../../../appcoretruckassist/model/fuelTransactionResponse';
import {
    convertDateFromBackend,
    convertDateFromBackendToTime,
    convertNumberInThousandSep,
} from '../../../../utils/methods.calculations';
import {
    priceValidation,
    fullNameValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

@Component({
    selector: 'app-fuel-purchase-modal',
    templateUrl: './fuel-purchase-modal.component.html',
    styleUrls: ['./fuel-purchase-modal.component.scss'],
    providers: [ModalService, FormService, SumArraysPipe],
    encapsulation: ViewEncapsulation.None,
})
export class FuelPurchaseModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public fuelForm: FormGroup;

    public truckType: any[] = [];
    public fuelStops: any[] = [];

    public fuelItemsDropdown: any[] = [];

    public selectedTruckType: any = null;
    public selectedDispatchHistory: any = null;
    public selectedTrailerType: any = null;
    public selectedFuelStop: any = null;

    public selectedFuelItemsFormArray: any[] = [];
    public fuelItemsCounter: number = 0;
    public subtotal: { value: number; reorderingNumber: number }[] = [];
    public quantity: any[] = [];

    public bluringFuelItemsPrice: any[] = [];

    public hoverRowTable: boolean[] = [];

    public documents: any[] = [];

    public isFormDirty: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private fuelService: FuelTService,
        private notificationService: NotificationService,
        private sumArrays: SumArraysPipe,
        private truckService: TruckTService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        this.getFuelTransactionFranchises();
        this.getTruckList();

        if (this.editData) {
            // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
            this.editData = {
                ...this.editData,
                id: 1,
            };
            this.getFuelById(this.editData.id);
        }

        this.getDriverTrailerBySelectedTruck();
    }

    private createForm() {
        this.fuelForm = this.formBuilder.group({
            efsAccount: [null],
            fuelCard: [null],
            truckId: [null, Validators.required],
            trailerId: [null],
            driverFullName: [null, fullNameValidation],
            transactionDate: [null, Validators.required],
            transactionTime: [null],
            fuelStopStoreId: [null, Validators.required],
            fuelItems: this.formBuilder.array([]),
            total: [null],
        });

        this.formService.checkFormChange(this.fuelForm);
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
                if (this.fuelForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.fuelForm);
                    return;
                }
                if (this.editData) {
                    this.updateFuel(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addFuel();
                    this.modalService.setModalSpinner({
                        action: null,
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

    public get fuelItems(): FormArray {
        return this.fuelForm.get('fuelItems') as FormArray;
    }

    private createFuelItems(data?: {
        id?: number;
        reorderingNumber?: number;
        itemId?: string;
        qty?: string;
        price?: string;
        subtotal?: string;
    }): FormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : 0],
            reorderingNumber: [
                data.reorderingNumber ? data.reorderingNumber : null,
            ],
            itemId: [data?.itemId ? data.itemId : null, Validators.required],
            qty: [data?.qty ? data.qty : null],
            price: [
                [data?.price ? data.price : undefined],
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
            this.hoverRowTable.push(false);
            this.bluringFuelItemsPrice.push(false);
        }
    }

    public removeFuelItems(id: number) {
        this.fuelItems.removeAt(id);
        this.selectedFuelItemsFormArray.splice(id, 1);
        this.bluringFuelItemsPrice.splice(id, 1);
        this.hoverRowTable.splice(id, 1);
        const afterDeleting = this.subtotal.splice(id, 1);

        this.subtotal = this.subtotal.filter(
            (item) =>
                item.reorderingNumber !== afterDeleting[0].reorderingNumber
        );

        if (!this.subtotal.length) {
            this.selectedFuelItemsFormArray = [];
            this.bluringFuelItemsPrice = [];
            this.hoverRowTable = [];
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
                    const price = parseInt(
                        this.fuelItems
                            .at(index)
                            .get('price')
                            .value?.toString()
                            ?.replace(/,/g, '')
                    );
                    this.subtotal[index].value = this.quantity[index] * price;
                    this.fuelItems
                        .at(index)
                        .get('subtotal')
                        .patchValue(this.subtotal[index].value);
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
                this.selectedFuelItemsFormArray[index] = event;
                console.log(this.selectedFuelItemsFormArray);
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

    public drop(event: CdkDragDrop<any[]>) {
        moveItemInArray(
            this.fuelItems.controls,
            event.previousIndex,
            event.currentIndex
        );

        moveItemInArray(this.subtotal, event.previousIndex, event.currentIndex);
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
                ? this.selectedFuelStop.storeId
                : null,
            transactionDate: convertDateToBackend(form.date),
            total: this.sumArrays.transform(this.subtotal),
            fuelItems: this.premmapedItems('update') as any,
        };

        this.fuelService
            .updateFuelTransaction(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Successfully updated fuel transaction',
                        'Success'
                    );
                },
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
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
            trailerId: this.selectedTrailerType
                ? this.selectedTrailerType.id
                : null,
            fuelStopStoreId: this.selectedFuelStop
                ? this.selectedFuelStop.storeId
                : null,
            transactionDate: combineDateAndTimeToBackend(
                form.transactionDate,
                form.transactionTime
            ),
            total: this.sumArrays.transform(this.subtotal),
            fuelItems: this.premmapedItems('create') as any,
        };
        this.fuelService
            .addFuelTransaction(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Successfully created fuel transaction',
                        'Success'
                    );
                },
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
                },
            });
    }

    private getFuelById(id: number) {
        this.fuelService
            .getFuelTransactionById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: FuelTransactionResponse) => {
                    console.log('FUEL BY ID: ', res);
                    this.fuelForm.patchValue({
                        efsAccount: null,
                        fuelCard: res.fuelCard,
                        truckId: res.truck ? res.truck.truckNumber : null,
                        trailerId: null,
                        driverFullName: res.driver
                            ? res.driver.firstName.concat(
                                  ' ',
                                  res.driver.lastName
                              )
                            : null,
                        transactionDate: convertDateFromBackend(
                            res.transactionDate
                        ),
                        transactionTime: convertDateFromBackendToTime(
                            res.transactionDate
                        ),
                        fuelStopStoreId: res.fuelStopStore
                            ? res.fuelStopStore.store
                            : null,
                        fuelItems: [],
                        total: res.total,
                    });

                    this.selectedTruckType = res.truck;
                    this.selectedDispatchHistory.driverId = res.driver.id;
                    this.selectedFuelStop = res.fuelStopStore;

                    if (res.fuelItems.length) {
                        for (let i = 0; i < res.fuelItems.length; i++) {
                            this.fuelItems.push(
                                this.createFuelItems({
                                    id: res.fuelItems[i].id,
                                    reorderingNumber: ++i,
                                    itemId: res.fuelItems[
                                        i
                                    ].fuelTransactionId.toString(),
                                    qty: res.fuelItems[i].qty.toString(),
                                    price: res.fuelItems[i].price
                                        ? convertNumberInThousandSep(
                                              res.fuelItems[i].price
                                          )
                                        : null,
                                    subtotal:
                                        res.fuelItems[i].subtotal.toString(),
                                })
                            );

                            this.subtotal[i] = res.fuelStopStore[i].subtotal;
                        }
                    }
                },
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
                },
            });
    }

    private getModalDropdowns() {
        this.fuelService
            .getFuelTransactionModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetFuelModalResponse) => {
                    this.fuelItemsDropdown = res.itemFuel;
                },
                error: (error: any) => {
                    this.notificationService.error('Error', error);
                },
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

                    // this.fuelForm
                    //     .get('trailerId')
                    //     .patchValue(res.trailerNumber);
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
                        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
                    );
                },
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
                },
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
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
                },
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
                                name: item.truckType.name,
                                folder: 'common',
                                subFolder: 'trucks',
                            };
                        }),
                    ];
                    this.truckType = this.truckType.filter(
                        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
                    );
                },
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
                },
            });
    }

    public truckListPagination(pageIndex: number) {
        this.getTruckList(pageIndex, 25);
    }

    private premmapedItems(crud: string) {
        if (crud === 'update') {
            return this.fuelItems.controls.map((item, index) => {
                return {
                    id: this.selectedFuelItemsFormArray[index]
                        ? this.selectedFuelItemsFormArray[index].id
                        : null,
                    itemfuel: item.get('itemId').value,
                    price: item.get('price').value
                        ? convertThousanSepInNumber(item.get('price').value)
                        : null,
                    qty: item.get('qty').value
                        ? parseInt(item.get('qty').value)
                        : null,
                    subtotal: item.get('subtotal').value,
                };
            });
        } else {
            return this.fuelItems.controls.map((item, index) => {
                return {
                    itemfuel: this.selectedFuelItemsFormArray[index]
                        ? this.selectedFuelItemsFormArray[index].id
                        : null,
                    price: item.get('price').value
                        ? convertThousanSepInNumber(item.get('price').value)
                        : null,
                    qty: item.get('qty').value
                        ? parseInt(item.get('qty').value)
                        : null,
                    subtotal: item.get('subtotal').value,
                };
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
