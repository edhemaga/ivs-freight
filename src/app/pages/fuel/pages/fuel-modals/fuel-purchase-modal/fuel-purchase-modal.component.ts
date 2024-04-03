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

//Services
import { TaInputService } from '../../../../../core/components/shared/ta-input/ta-input.service';
import { ModalService } from '../../../../../core/components/shared/ta-modal/modal.service';
import { FormService } from '../../../../../core/services/form/form.service';
import { FuelService } from 'src/app/shared/services/fuel.service';
import { TruckService } from 'src/app/shared/services/truck.service';

//Components
import { AppTooltipComponent } from '../../../../../core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../../../../core/components/shared/ta-modal/ta-modal.component';
import { TaInputComponent } from '../../../../../core/components/shared/ta-input/ta-input.component';
import { TaCustomCardComponent } from '../../../../../core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaInputDropdownComponent } from '../../../../../core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaUploadFilesComponent } from '../../../../../core/components/shared/ta-upload-files/ta-upload-files.component';

//Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Models
import { GetFuelModalResponse } from '../../../../../../../appcoretruckassist/model/getFuelModalResponse';
import { FuelDispatchHistoryResponse } from '../../../../../../../appcoretruckassist/model/fuelDispatchHistoryResponse';
import { FuelStopFranchiseResponse } from '../../../../../../../appcoretruckassist/model/fuelStopFranchiseResponse';
import {
    FuelTransactionResponse,
    GetModalFuelStopFranchiseResponse,
} from 'appcoretruckassist';
import { FuelData } from './models/fuel-data.model';
import { FuelItems } from './models/fuel-items.model';
import { FuelItemsDropdown } from './models/fuel-items-dropdown.model';
import { FuelTruckType } from './models/fuel-truck-type.model';
import { TruckMinimalListResponse } from '../../../../../../../appcoretruckassist/model/truckMinimalListResponse';
import { Trailer } from '../../../../../shared/models/card-table-data.model';

//Pipes
import { SumArraysPipe } from 'src/app/shared/pipes/sum-arrays.pipe';

//Enums
import { EnumValue } from '../../../../../../../appcoretruckassist/model/enumValue';
import { FuelDataOptionsStringEnum } from '../../../enums/fuel-data-options-string.enum';
import { FuelDropdownOptionsStringEnum } from './enums/fuel-dropdown-optioins-string.enum';
import { FuelValuesStringEnum } from './enums/fuel-values-string.enum';
import { FuelModalActionsStringEnum } from './enums/fuel-modal-actions-string.enum';

//Validations
import {
    priceValidation,
    fullNameValidation,
} from '../../../../../core/components/shared/ta-input/ta-input.regex-validations';

//Methods
import {
    combineDateAndTimeToBackend,
    convertDateToTimeFromBackend,
    convertThousanSepInNumber,
} from '../../../../../core/utils/methods.calculations';
import {
    convertDateFromBackend,
    convertNumberInThousandSep,
} from '../../../../../core/utils/methods.calculations';

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
    @Input() editData: FuelData;

    public fuelForm: UntypedFormGroup;

    public truckType: FuelTruckType[] = [];
    public fuelStops: any[] = []; //leave any for now

    public selectedTruckType: FuelTruckType;
    public selectedTrailerType: Trailer;
    public selectedFuelStop: any = null; //leave any for now
    public selectedDispatchHistory: FuelDispatchHistoryResponse;

    public selectedFuelItemDropFArray: FuelItemsDropdown[] = [];
    public fuelItemsDropdown: Array<EnumValue> | null = [];
    public fuelItemsCounter: number = 0;
    public subtotal: { value: number; reorderingNumber: number }[] = [];
    public quantity: number[] = [];

    public bluringFuelItemsPrice: boolean[] = [];

    public documents: any[] = []; //leave any for now

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
        private fuelService: FuelService,
        private sumArrays: SumArraysPipe,
        private truckService: TruckService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        this.getFuelTransactionFranchises();
        this.getTruckList();

        this.getDriverTrailerBySelectedTruck();
    }

    private createForm(): void {
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

        if (this.editData?.type !== FuelDataOptionsStringEnum.EDIT) {
            this.addFuelItems({ check: true, action: null });
        }
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case FuelModalActionsStringEnum.CLOSE:
                break;

            case FuelModalActionsStringEnum.SAVE:
                if (this.fuelForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.fuelForm);
                    return;
                }
                if (this.editData) {
                    this.fuelTransactionType?.name !==
                    FuelValuesStringEnum.MANUAL
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

            default:
                break;
        }
    }

    public get fuelItems(): UntypedFormArray {
        return this.fuelForm.get(
            FuelValuesStringEnum.FUEL_ITEMS
        ) as UntypedFormArray;
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
            id: [data?.id ?? 0],
            reorderingNumber: [data.reorderingNumber ?? null],
            itemId: [data?.itemId ? data.itemId : null, Validators.required],
            qty: [data?.qty ?? 1],
            price: [
                data?.price && !data?.price && data?.price !== undefined
                    ? data.price
                    : null,
                [...priceValidation],
            ],
            subtotal: [[data?.subtotal ?? null]],
        });
    }

    public addFuelItems(event: { check: boolean; action: string }): void {
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

    public removeFuelItems(id: number): void {
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

    public onChange(formControlName: string, index: number): void {
        if (formControlName === FuelValuesStringEnum.QTY) {
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

                    if (
                        this.fuelItems.at(index).get(FuelValuesStringEnum.PRICE)
                            .value
                    ) {
                        const price = parseInt(
                            this.fuelItems
                                .at(index)
                                .get(FuelValuesStringEnum.PRICE)
                                .value?.toString()
                                ?.replace(/,/g, '')
                        );
                        this.subtotal[index].value =
                            this.quantity[index] * price;
                        this.fuelItems
                            .at(index)
                            .get(FuelValuesStringEnum.SUBTOTAL)
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
                        this.fuelItems
                            .at(index)
                            .get(FuelValuesStringEnum.QTY)
                            .patchValue(1);
                    }

                    const price = parseInt(
                        value?.toString()?.replace(/,/g, '')
                    );
                    this.subtotal = [...this.subtotal];
                    this.subtotal[index].value = this.quantity[index] * price;
                    this.fuelItems
                        .at(index)
                        .get(FuelValuesStringEnum.SUBTOTAL)
                        .patchValue(this.subtotal[index].value);
                });
        }
    }

    public onSelectDropDown(event: any, action: string, index?: number): void {
        //leave any for now
        switch (action) {
            case FuelDropdownOptionsStringEnum.TRUCK:
                this.selectedTruckType = event;
                this.getDriverTrailerBySelectedTruck(
                    FuelValuesStringEnum.TRUCK_ID
                );
                break;
            case FuelDropdownOptionsStringEnum.FUEL:
                this.selectedFuelStop = event;
                break;
            case FuelDropdownOptionsStringEnum.FUEL_ITEMS:
                this.selectedFuelItemDropFArray[index] = event;
                break;
            default:
                break;
        }
    }

    public onFilesEvent(event: any) {
        //leave any for now
        this.documents = event.files;
    }

    private updateFuel(id: number) {
        const { ...form } = this.fuelForm.value;
        const newData: any = {
            //leave any for now
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
            invoice: this.fuelForm.get(FuelValuesStringEnum.INVOICE).value,
            total: this.sumArrays.transform(this.subtotal),
            fuelItems: this.premmapedItems(FuelValuesStringEnum.UPDATE) as any, //leave any for now
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

    private updateFuelEFS(id: number): void {
        const newData: any = {
            //leave any for now
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

    private addFuel(): void {
        const { ...form } = this.fuelForm.value;

        const newData: any = {
            //leave any for now
            driverId: this.selectedDispatchHistory
                ? this.selectedDispatchHistory.driverId
                : null,
            truckId: this.selectedTruckType ? this.selectedTruckType.id : null,
            invoice: this.fuelForm.get(FuelValuesStringEnum.INVOICE).value,
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
            fuelItems: this.premmapedItems(FuelValuesStringEnum.CREATE) as any, //leave any for now
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

    private getFuelById(id: number): void {
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
                        transactionTime: this.getTransactionTime(
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
                        folder: FuelValuesStringEnum.COMMON,
                        subFolder: FuelValuesStringEnum.TRUCKS,
                    };

                    this.getDriverTrailerBySelectedTruck(
                        FuelValuesStringEnum.TRUCK_ID
                    );

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

    private getModalDropdowns(): void {
        this.fuelService
            .getFuelTransactionModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetFuelModalResponse) => {
                    this.fuelItemsDropdown = res.itemFuel;

                    if (
                        this.editData?.type === FuelDataOptionsStringEnum.EDIT
                    ) {
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
        formControlName: string = FuelValuesStringEnum.TRANSACTION_DATE
    ): any {
        //leave any for now
        this.fuelForm
            .get(formControlName)
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                switchMap(() => {
                    if (
                        this.selectedTruckType &&
                        this.fuelForm.get(FuelValuesStringEnum.TRANSACTION_DATE)
                            .value
                    ) {
                        return this.fuelService.getDriverBySelectedTruckAndDate(
                            this.selectedTruckType.id,
                            this.fuelForm.get(
                                FuelValuesStringEnum.TRANSACTION_DATE
                            ).value
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
                        .get(FuelValuesStringEnum.DRIVER_FULL_NAME)
                        .patchValue(res.firstName.concat(' ', res.lastName));
                }
            });
    }

    private getFuelTransactionFranchises(
        pageIndex: number = 1,
        pageSize: number = 25
    ): void {
        this.fuelService
            .getFuelTransactionFranchises(pageIndex, pageSize)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetModalFuelStopFranchiseResponse) => {
                    this.fuelStops = [
                        ...this.fuelStops,
                        ...res.pagination.data.map((item) => {
                            return {
                                id: item.id,
                                count: item.count,
                                businessName: item.businessName,
                                stores: item.fuelStopStores ?? [],
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

    public paginationFuelStopPage(pageIndex: number): void {
        this.getFuelTransactionFranchises(pageIndex, 25);
    }

    public getFuelStoresByFranchiseId(franchise: any): void {
        //leave any for now
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

    private getTruckList(pageIndex: number = 1, pageSize: number = 25): void {
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
                                folder: FuelValuesStringEnum.COMMON,
                                subFolder: FuelValuesStringEnum.TRUCKS,
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

    public truckListPagination(pageIndex: number): void {
        this.getTruckList(pageIndex, 25);
    }

    private premmapedItems(crud: string): FuelItems[] {
        if (crud === FuelValuesStringEnum.UPDATE) {
            return this.fuelItems.controls.map((item) => {
                return {
                    itemfuel: item.get(FuelValuesStringEnum.ITEM_ID).value,
                    price: item.get(FuelValuesStringEnum.PRICE).value
                        ? convertThousanSepInNumber(
                              item.get(FuelValuesStringEnum.PRICE).value
                          )
                        : null,
                    qty: item.get(FuelValuesStringEnum.QTY).value
                        ? parseInt(item.get(FuelValuesStringEnum.QTY).value)
                        : null,
                    subtotal: parseInt(
                        item.get(FuelValuesStringEnum.SUBTOTAL).value
                    ),
                };
            });
        } else {
            return this.fuelItems.controls.map((item, index) => {
                return {
                    itemfuel: this.selectedFuelItemDropFArray[index]
                        ? this.selectedFuelItemDropFArray[index].id
                        : null,
                    price: item.get(FuelValuesStringEnum.PRICE).value
                        ? convertThousanSepInNumber(
                              item.get(FuelValuesStringEnum.PRICE).value
                          )
                        : null,
                    qty: item.get(FuelValuesStringEnum.QTY).value
                        ? parseInt(item.get(FuelValuesStringEnum.QTY).value)
                        : null,
                    subtotal: parseInt(
                        item.get(FuelValuesStringEnum.SUBTOTAL).value
                    ),
                };
            });
        }
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.fuelForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    private getTransactionTime(date: string): string {
        return convertDateToTimeFromBackend(date);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
