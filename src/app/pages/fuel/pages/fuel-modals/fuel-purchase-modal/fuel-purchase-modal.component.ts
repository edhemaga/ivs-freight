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

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { FuelService } from '@shared/services/fuel.service';
import { TruckService } from '@shared/services/truck.service';
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import {
    CaInputComponent,
    CaInputDatetimePickerComponent,
    CaInputDropdownComponent,
    CaModalComponent,
} from 'ca-components';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// models
import {
    FuelTransactionResponse,
    GetModalFuelStopFranchiseResponse,
    GetFuelModalResponse,
    FuelDispatchHistoryResponse,
    TruckMinimalListResponse,
    EnumValue,
    FuelItemResponse,
} from 'appcoretruckassist';
import {
    ExtendedFuelStopResponse,
    FuelTruckType,
} from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/models';
import { RepairSubtotal } from '@pages/repair/pages/repair-modals/repair-order-modal/models';
import { FileEvent } from '@shared/models';

// pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';
import { FormatDatePipe } from '@shared/pipes';
import { FuelPurchaseModalInputConfigPipe } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/pipes';

// enums
import { FuelDataOptionsStringEnum } from '@pages/fuel/enums';
import { FuelDropdownOptionsStringEnum } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/enums';
import { FuelValuesStringEnum } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { DropdownMenuStringEnum, TableStringEnum } from '@shared/enums';
import { ContactsModalStringEnum } from '@pages/contacts/pages/contacts-modal/enums';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

// validations
import { fullNameValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// mMoment
import moment from 'moment';

@Component({
    selector: 'app-fuel-purchase-modal',
    templateUrl: './fuel-purchase-modal.component.html',
    styleUrls: ['./fuel-purchase-modal.component.scss'],
    providers: [ModalService, FormService, SumArraysPipe],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        TaAppTooltipV2Component,
        CaModalComponent,
        CaInputComponent,
        TaCustomCardComponent,
        CaInputDropdownComponent,
        TaUploadFilesComponent,
        TaModalTableComponent,
        TaCopyComponent,
        TaInputDropdownComponent,
        CaInputDatetimePickerComponent,

        // pipes
        FormatDatePipe,
        FuelPurchaseModalInputConfigPipe,
    ],
})
export class FuelPurchaseModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    private destroy$ = new Subject<void>();

    public modalTableTypeEnum = ModalTableTypeEnum;

    public fuelForm: UntypedFormGroup;

    public isFormDirty: boolean;
    public isCardAnimationDisabled: boolean = false;

    public truckType: FuelTruckType[] = [];
    public trailerId: number;

    public fuelStops: ExtendedFuelStopResponse[] = [];

    public fuelTransactionType: EnumValue;
    public fuelTransactionName: string;

    public selectedTruckType: FuelTruckType;
    public selectedTrailerType: FuelTruckType;
    public selectedFuelStop: ExtendedFuelStopResponse;
    public selectedDispatchHistory: FuelDispatchHistoryResponse;

    public fuelItemsDropdown: EnumValue[] = [];

    public documents: any[] = [];

    // items
    public isFuelRowCreated: boolean = false;
    public isEachFuelRowValid: boolean = true;

    public fuelItems: FuelItemResponse[] = [];
    public updatedFuelItems: FuelItemResponse[] = [];

    public total: number = 0;

    public svgRoutes = SharedSvgRoutes;
    public taModalActionEnum = TaModalActionEnum;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // modules
        private ngbActiveModal: NgbActiveModal,

        // services
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private fuelService: FuelService,
        private truckService: TruckService,
        private payrollService: PayrollService,
        private confirmationService: ConfirmationService,
        private confirmationActivationService: ConfirmationActivationService
    ) {}

    ngOnInit() {
        this.createForm();

        this.getModalDropdowns();

        this.getFuelTransactionFranchises();

        this.getTruckList();

        this.getDriverTrailerBySelectedTruck();

        this.confirmationActivationSubscribe();

        this.confirmationDeactivationSubscribe();
    }

    private confirmationDeactivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.ngbActiveModal?.close();
            });
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.action !== TableStringEnum.CLOSE)
                    this.ngbActiveModal?.close();
            });
    }

    private createForm(): void {
        const truckId = this.editData?.truckId ?? null;
        this.fuelForm = this.formBuilder.group({
            efsAccount: [null],
            fuelCard: [null],
            invoice: [null, Validators.required],
            truckId: [truckId, Validators.required],
            trailerId: [null],
            driverFullName: [null, fullNameValidation],
            transactionDate: [null, Validators.required],
            transactionTime: [null, Validators.required],
            fuelStopStoreId: [null, Validators.required],
            fuelItems: this.formBuilder.array([]),
            total: [null],
        });
    }

    public onModalAction(action: string): void {
        switch (action) {
            case TaModalActionEnum.CLOSE:
                this.ngbActiveModal.close();

                break;
            case TaModalActionEnum.SAVE_AND_ADD_NEW:
            case TaModalActionEnum.SAVE:
                if (this.fuelForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.fuelForm);

                    return;
                }

                if (
                    this.editData &&
                    !this.editData?.isShortModal &&
                    this.editData?.id
                ) {
                    this.fuelTransactionType?.name !==
                    FuelValuesStringEnum.MANUAL
                        ? this.updateFuelEFS(this.editData.id)
                        : this.updateFuel(this.editData.id);
                } else {
                    this.addFuel(action === TaModalActionEnum.SAVE_AND_ADD_NEW);
                }

                break;
            case TaModalActionEnum.DELETE:
                this.payrollService.raiseDeleteModal(
                    TableStringEnum.FUEL_1,
                    ConfirmationModalStringEnum.DELETE_FUEL_TRANSACTION,
                    this.editData.data.id,
                    {
                        title: this.editData.data.loadInvoice.invoice,
                        subtitle: this.editData.data.total,
                        date: this.editData.data.transactionDate,
                        label: this.editData.data.truck?.truckNumber,
                        id: this.editData.id,
                    },

                    TableStringEnum.FUEL_1
                );

                break;
            default:
                break;
        }
    }

    public onSelectDropDown(event: any, action: string, index?: number): void {
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

    public onFilesEvent(event: FileEvent): void {
        this.documents = event.files;
    }

    private updateFuel(id: number): void {
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
            transactionDate:
                MethodsCalculationsHelper.combineDateAndTimeToBackend(
                    form.transactionDate,
                    form.transactionTime
                ),
            invoice: this.fuelForm.get(FuelValuesStringEnum.INVOICE).value,
            total: MethodsCalculationsHelper.convertThousanSepInNumber(
                this.total as any
            ),
            fuelItems: this.fuelItems,
            files: this.mapDocuments(),
            filesForDeleteIds: [],
        };

        this.fuelService
            .updateFuelTransaction(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
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
                    this.ngbActiveModal.close();
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

    private addFuel(addNew: boolean): void {
        const { ...form } = this.fuelForm.value;

        const newData: any = {
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
            payrollOwnerId: this.editData?.payrollOwnerId,
        };

        this.fuelService
            .addFuelTransaction(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                    if (addNew) {
                        this.modalService.openModal(
                            FuelPurchaseModalComponent,
                            {
                                size: ContactsModalStringEnum.SMALL,
                            }
                        );
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
                            ? res.driver.firstName?.concat(
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
                        fuelItems: res.fuelItems,
                        total: res.total,
                    });

                    this.selectedTruckType = {
                        id: res.truck?.id,
                        number: res.truck?.truckNumber,
                        logoName: res.truck?.truckType.logoName,
                        name: res.truck?.truckNumber,
                        folder: FuelValuesStringEnum.COMMON,
                        subFolder: FuelValuesStringEnum.TRUCKS,
                    };

                    this.selectedTrailerType = {
                        id: res.trailer?.id,
                        number: res.trailer?.trailerNumber,
                        logoName: res.trailer?.trailerType.logoName,
                        name: res.trailer?.trailerNumber,
                        folder: FuelValuesStringEnum.COMMON,
                        subFolder: FuelValuesStringEnum.TRAILERS,
                    };

                    this.documents = res.files;

                    this.updatedFuelItems = res.fuelItems;

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

                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
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
                        this.isCardAnimationDisabled = true;

                        this.getFuelById(this.editData.id);
                    } else {
                        if (
                            this.editData?.type ===
                            DropdownMenuStringEnum.ADD_TRANSACTION_TYPE
                        )
                            this.getFuelStopById(this.editData?.data?.id);

                        this.addFuelItem();

                        this.startFormChanges();
                    }
                },
            });
    }

    private getDriverTrailerBySelectedTruck(
        formControlName: string = FuelValuesStringEnum.TRANSACTION_DATE
    ): any {
        this.fuelForm
            .get(formControlName)
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                switchMap(() => {
                    if (
                        this.selectedTruckType &&
                        this.fuelForm.get(FuelValuesStringEnum.TRANSACTION_DATE)
                            .value &&
                        this.fuelForm.get(FuelValuesStringEnum.TRANSACTION_TIME)
                            .value
                    ) {
                        const date = this.fuelForm.get(
                            FuelValuesStringEnum.TRANSACTION_DATE
                        ).value;

                        const time = this.fuelForm.get(
                            FuelValuesStringEnum.TRANSACTION_TIME
                        ).value;

                        return this.fuelService.getDriverBySelectedTruckAndDate(
                            this.selectedTruckType.id,
                            moment.utc(new Date(date + ' ' + time)).format()
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
                        .patchValue(
                            res.firstName?.concat(' ', res.lastName) ?? null
                        );

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
            });
    }

    public paginationFuelStopPage(pageIndex: number): void {
        this.getFuelTransactionFranchises(pageIndex, 25);
    }

    public getFuelStoresByFranchiseId(franchise: any): void {
        this.fuelService
            .getFuelTransactionStoresByFranchiseId(franchise.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
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
            });
    }

    private getFuelStopById(id: number): void {
        this.fuelService
            .getFuelStopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (fuelStop) => {
                    const {
                        id,
                        businessName,
                        address,
                        store,
                        fuelStopFranchise,
                    } = fuelStop;

                    if (!fuelStopFranchise) {
                        this.selectedFuelStop = {
                            id,
                            name: businessName,
                            businessName,
                            fuelStopFranchise: null,
                            address,
                            fullAddress: address.address,
                            isFranchise: false,
                        };
                    } else {
                        this.selectedFuelStop = {
                            storeId: id,
                            name: store,
                            businessName,
                            fuelStopFranchise,
                            address,
                            fullAddress: address.address,
                            isFranchise: true,
                        };
                    }

                    this.fuelForm.patchValue({
                        fuelStopStoreId: fuelStopFranchise
                            ? store
                            : businessName,
                    });
                },
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

                    if (this.editData?.truckId) {
                        const truck = this.truckType.find(
                            (t) => t.id === this.editData.truckId
                        );

                        this.onSelectDropDown(truck, 'truck');
                    }
                },
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

    public addFuelItem(): void {
        if (!this.isEachFuelRowValid) return;

        this.isFuelRowCreated = true;

        setTimeout(() => {
            this.isFuelRowCreated = false;
        }, 400);
    }

    public handleModalTableValueEmit(
        modalTableDataValue: FuelItemResponse[]
    ): void {
        this.fuelItems = modalTableDataValue;

        this.getTotalCostValueEmit(modalTableDataValue as any);
    }

    public handleModalTableValidStatusEmit(
        isEachRepairItemsRowValid: boolean
    ): void {
        this.isEachFuelRowValid = isEachRepairItemsRowValid;
    }

    public getTotalCostValueEmit(event: FuelItemResponse[]): void {
        let total = 0;

        event.forEach((item: RepairSubtotal) => {
            total += item.subtotal;
        });

        this.total = total;
    }

    private mapDocuments(): Blob[] {
        const documents: Blob[] = [];

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
