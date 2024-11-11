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
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Subject, takeUntil, switchMap, of } from 'rxjs';

//Services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { FuelService } from '@shared/services/fuel.service';
import { TruckService } from '@shared/services/truck.service';

//Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';

//Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Svg routes
import { FuelTableSvgRoutes } from '@pages/fuel/pages/fuel-table/utils/svg-routes/fuel-table-svg-routes';

//Models
import {
    FuelTransactionResponse,
    GetModalFuelStopFranchiseResponse,
    GetFuelModalResponse,
    FuelDispatchHistoryResponse,
    FuelStopFranchiseResponse,
    TruckMinimalListResponse,
    EnumValue,
    RepairItemResponse,
} from 'appcoretruckassist';
import { FuelData } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/models/fuel-data.model';
import { FuelTruckType } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/models/fuel-truck-type.model';
import { RepairSubtotal } from '@pages/repair/pages/repair-modals/repair-order-modal/models';

//Pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';

//Enums
import { FuelDataOptionsStringEnum } from '@pages/fuel/enums/fuel-data-options-string.enum';
import { FuelDropdownOptionsStringEnum } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/enums/fuel-dropdown-optioins-string.enum';
import { FuelValuesStringEnum } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/enums/fuel-values-string.enum';
import { FuelModalActionsStringEnum } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/enums/fuel-modal-actions-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';

//Validations
import { fullNameValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

//Methods
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

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
        TaAppTooltipV2Component,
        TaModalComponent,
        TaInputComponent,
        TaCustomCardComponent,
        TaInputDropdownComponent,
        TaUploadFilesComponent,
        TaModalTableComponent,
        TaCopyComponent,

        // Pipe
        SumArraysPipe,
    ],
})
export class FuelPurchaseModalComponent implements OnInit, OnDestroy {
    @Input() editData: FuelData;
    public svgRoutes = FuelTableSvgRoutes;
    public modalTableTypeEnum = ModalTableTypeEnum;

    public fuelForm: UntypedFormGroup;

    public truckType: FuelTruckType[] = [];
    public fuelStops: any[] = []; //leave any for now

    public selectedTruckType: FuelTruckType;
    public selectedTrailerType: FuelTruckType;
    public selectedFuelStop: any = null; //leave any for now
    public selectedDispatchHistory: FuelDispatchHistoryResponse;

    public fuelItemsDropdown: Array<EnumValue> | null = [];
    public fuelItemsCounter: number = 0;
    public subtotal: { value: number; reorderingNumber: number }[] = [];

    public documents: any[] = []; //leave any for now

    public fuelTransactionType: EnumValue = null;

    public isFormDirty: boolean;

    public fuelTransactionName: string = null;

    public disableCardAnimation: boolean = false;

    public isRepairBillRowCreated: boolean = false;

    public isEachRepairRowValid: boolean = true;
    public updatedRepairItems: RepairItemResponse[] = [];
    public fuelItems: RepairItemResponse[] = [];
    public total: number = 0;

    private destroy$ = new Subject<void>();
    public trailerId: number;

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
            transactionDate:
                MethodsCalculationsHelper.combineDateAndTimeToBackend(
                    form.transactionDate,
                    form.transactionTime
                ),
            invoice: this.fuelForm.get(FuelValuesStringEnum.INVOICE).value,
            total: MethodsCalculationsHelper.convertThousanSepInNumber(
                this.total as any
            ),
            fuelItems: this.fuelItems, //TODO: leave any for now
            files: this.mapDocuments(),
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
            files: this.mapDocuments(),
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
            trailerId: this.trailerId,
            fuelStopStoreId: this.selectedFuelStop
                ? this.selectedFuelStop.isFranchise
                    ? this.selectedFuelStop.storeId
                    : this.selectedFuelStop.id
                : null,
            transactionDate:
                MethodsCalculationsHelper.combineDateAndTimeToBackend(
                    form.transactionDate,
                    form.transactionTime
                ),
            total: MethodsCalculationsHelper.convertThousanSepInNumber(
                this.total as any
            ),
            fuelItems: this.fuelItems,
            files: this.mapDocuments(),
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
                        transactionDate:
                            MethodsCalculationsHelper.convertDateFromBackend(
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

                    this.selectedTrailerType = {
                        id: res.trailer.id,
                        number: res.trailer.trailerNumber,
                        logoName: res.trailer.trailerType.logoName,
                        name: res.trailer.trailerNumber,
                        folder: FuelValuesStringEnum.COMMON,
                        subFolder: FuelValuesStringEnum.TRAILERS,
                    };

                    this.documents = res.files;

                    this.updatedRepairItems = res.fuelItems.map(
                        (repairItem) => {
                            return {
                                ...repairItem,
                            };
                        }
                    );

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
                    console.log(res);
                    this.fuelForm
                        .get(FuelValuesStringEnum.DRIVER_FULL_NAME)
                        .patchValue(res.firstName.concat(' ', res.lastName));
                    this.fuelForm
                        .get(FuelValuesStringEnum.TRAILER_ID)
                        .patchValue(res.trailerNumber);
                    this.trailerId = res.trailerId;
                    this.selectedTrailerType = {
                        id: res.trailerId,
                        number: res.trailerNumber,
                        logoName: res.logoName,
                        name: res.trailerNumber,
                        folder: FuelValuesStringEnum.COMMON,
                        subFolder: FuelValuesStringEnum.TRAILERS,
                    };
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

    private startFormChanges(): void {
        this.formService.checkFormChange(this.fuelForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    private getTransactionTime(date: string): string {
        return MethodsCalculationsHelper.convertDateToTimeFromBackend(date);
    }

    public addRepairItem(): void {
        if (!this.isEachRepairRowValid) return;

        this.isRepairBillRowCreated = true;

        setTimeout(() => {
            this.isRepairBillRowCreated = false;
        }, 400);
    }

    public handleModalTableValueEmit(
        modalTableDataValue: RepairItemResponse[]
    ): void {
        this.fuelItems = modalTableDataValue;
        this.getTotalCostValueEmit(modalTableDataValue as any);
    }

    public handleModalTableValidStatusEmit(
        isEachRepairItemsRowValid: boolean
    ): void {
        this.isEachRepairRowValid = isEachRepairItemsRowValid;
    }

    public getTotalCostValueEmit(event: RepairItemResponse[]): void {
        let total = 0;

        event.forEach((item: RepairSubtotal) => {
            total += item.subtotal;
        });

        this.total = total;
    }

    private mapDocuments(): Blob[] {
        let documents: Blob[] = [];

        this.documents?.forEach((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        return documents;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
