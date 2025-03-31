import {
    ChangeDetectorRef,
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

import {
    Subject,
    takeUntil,
    switchMap,
    of,
    Observable,
    tap,
    filter,
} from 'rxjs';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { FuelService } from '@shared/services/fuel.service';
import { TruckService } from '@shared/services/truck.service';
import { PayrollService } from '@pages/accounting/pages/payroll/services';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaPasswordAccountHiddenCharactersComponent } from '@shared/components/ta-password-account-hidden-characters/ta-password-account-hidden-characters.component';
import {
    CaInputComponent,
    CaInputDatetimePickerComponent,
    CaInputDropdownComponent,
    CaInputDropdownTestComponent,
    CaModalComponent,
} from 'ca-components';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// models
import {
    GetModalFuelStopFranchiseResponse,
    GetFuelModalResponse,
    FuelDispatchHistoryResponse,
    TruckMinimalListResponse,
    EnumValue,
    FuelItemResponse,
    DriverFilterResponse,
} from 'appcoretruckassist';
import {
    ExtendedFuelStopResponse,
    FuelTruckType,
} from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/models';
import { RepairSubtotal } from '@pages/repair/pages/repair-modals/repair-order-modal/models';
import { FileEvent } from '@shared/models';
import { PayrollDriver } from '@pages/accounting/pages/payroll/state/models';
import { IFuelPurchaseModalForm } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/interfaces';

// pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';
import {
    FormatDatePipe,
    MiddleEllipsisPipe,
    NameInitialsPipe,
} from '@shared/pipes';
import { FuelPurchaseModalInputConfigPipe } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/pipes';

// enums
import { FuelDataOptionsStringEnum } from '@pages/fuel/enums';
import { FuelDropdownOptionsStringEnum } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/enums';
import { FuelValuesStringEnum } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { eDropdownMenu, TableStringEnum, eGeneralActions } from '@shared/enums';
import { ContactsModalStringEnum } from '@pages/contacts/pages/contacts-modal/enums';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { eFuelTransactionType } from '@pages/fuel/pages/fuel-table/enums';

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
    providers: [ModalService, FormService, SumArraysPipe, NameInitialsPipe],
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
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaModalTableComponent,
        TaCopyComponent,
        TaInputDropdownComponent,
        TaPasswordAccountHiddenCharactersComponent,
        CaModalComponent,
        CaInputComponent,
        CaInputDropdownComponent,
        CaInputDropdownTestComponent,
        CaInputDatetimePickerComponent,

        // pipes
        FormatDatePipe,
        FuelPurchaseModalInputConfigPipe,
        MiddleEllipsisPipe,
    ],
})
export class FuelPurchaseModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public fuelForm: UntypedFormGroup;

    public truckType: FuelTruckType[] = [];
    public driverOptions: PayrollDriver[] = [];
    public fuelStops: ExtendedFuelStopResponse[] = [];
    public documents: any[] = [];

    public selectedFuelStop: ExtendedFuelStopResponse;
    public selectedDispatchHistory: FuelDispatchHistoryResponse;
    public selectedTruckType: FuelTruckType;
    public selectedTrailerType: FuelTruckType;
    public selectedDriver: PayrollDriver;

    public isFuelRowCreated: boolean = false;
    public isEachFuelRowValid: boolean = true;

    public fuelCardHolderName: string;
    public fuelItems: FuelItemResponse[] = [];
    public isCardAnimationDisabled: boolean = false;
    public updatedFuelItems: FuelItemResponse[] = [];
    public total: number = 0;

    public fuelItemsDropdown: EnumValue[] = [];
    public eFuelTransactionType = eFuelTransactionType;
    public modalActionType: FuelDataOptionsStringEnum;
    public taModalActionEnum = TaModalActionEnum;
    public modalTableTypeEnum = ModalTableTypeEnum;
    public fuelDataOptionsStringEnum = FuelDataOptionsStringEnum;
    public fuelTransactionType: EnumValue;
    public fuelValuesStringEnum = FuelValuesStringEnum;

    public svgRoutes = SharedSvgRoutes;

    private destroy$ = new Subject<void>();

    constructor(
        private cd: ChangeDetectorRef,
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
        this.setModalActionType();

        this.createForm();

        this.getModalDropdowns();
        this.getFuelTransactionFranchisesIfNeeded();
        this.getTruckList();
        this.getDriverTrailerBySelectedTruck();

        this.confirmationActivationSubscribe();
        this.confirmationDeactivationSubscribe();
    }

    public onModalAction(action: string): void {
        switch (action) {
            case TaModalActionEnum.CLOSE:
                this.ngbActiveModal.close();

                break;
            case TaModalActionEnum.SAVE_AND_ADD_NEW:
            case TaModalActionEnum.SAVE:
                if (this.fuelForm.invalid) {
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
                const id = this.editData.data?.id ?? this.editData.id;
                const title = this.fuelForm.get(
                    FuelValuesStringEnum.INVOICE
                ).value;
                const subtitle = this.fuelForm.get(
                    FuelValuesStringEnum.TOTAL
                ).value;
                const date = this.fuelForm.get(
                    FuelValuesStringEnum.TRANSACTION_DATE
                ).value;

                this.payrollService.raiseDeleteModal(
                    TableStringEnum.FUEL_TRANSACTION,
                    ConfirmationModalStringEnum.DELETE_FUEL_TRANSACTION,
                    id,
                    {
                        title,
                        subtitle,
                        date,
                        label: this.selectedTruckType?.number,
                        id,
                    }
                );

                break;
            default:
                break;
        }
    }

    public onSelectDropDown(event: any, action: string): void {
        switch (action) {
            case FuelDropdownOptionsStringEnum.TRUCK:
                this.selectedTruckType = event;

                if (this.selectedTruckType === null) return;

                this.getDriverTrailerBySelectedTruck()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((response) => {
                        this.selectedDispatchHistory = response;
                        const { data } = response?.pagination || {};

                        if (response?.trailerId)
                            this.selectedTrailerType = {
                                id: response.trailerId,
                                number: response?.trailerNumber,
                                logoName: response?.logoName,
                                name: response?.trailerNumber,
                                folder: FuelValuesStringEnum.COMMON,
                                subFolder: FuelValuesStringEnum.TRAILERS,
                            };
                        else this.selectedTrailerType = null;

                        this.patchDriverFullName(
                            response?.firstName,
                            response?.lastName
                        );

                        this.fuelForm
                            .get(FuelValuesStringEnum.TRAILER_ID)
                            .patchValue(response?.trailerId);

                        if (!!data) {
                            this.composeDriverOptions(data);
                            this.fuelForm
                                .get(FuelValuesStringEnum.DRIVER_FULL_NAME)
                                .markAsPristine();
                        }

                        this.fuelForm
                            .get(FuelValuesStringEnum.DRIVER_FULL_NAME)
                            .markAsPristine();
                    });

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

    public addFuelItem(): void {
        if (!this.isEachFuelRowValid) return;

        this.isFuelRowCreated = true;

        this.cd.detectChanges();

        this.isFuelRowCreated = false;
    }

    public handleModalTableValueEmit(
        modalTableDataValue: FuelItemResponse[]
    ): void {
        this.fuelItems = modalTableDataValue;
        this.fuelForm
            .get(FuelValuesStringEnum.FUEL_ITEMS)
            .patchValue(modalTableDataValue);

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

    private updateFuel(id: number): void {
        const { ...form } = this.fuelForm.value;

        const newData: any = {
            id: id,
            truckId: this.selectedTruckType.id,
            trailerId: this.selectedTrailerType?.id ?? null,
            driverId: this.selectedDispatchHistory?.driverId,
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
            total: MethodsCalculationsHelper.convertThousandSepInNumber(
                this.total as any
            ),
            fuelItems: this.convertItems(),
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

    private convertItems(): FuelItemResponse[] {
        return this.fuelItems.map((item) => {
            const qty = MethodsCalculationsHelper.convertThousandSepInNumber(
                item.qty.toString()
            );
            const price = MethodsCalculationsHelper.convertThousandSepInNumber(
                item.price.toString()
            );

            return {
                ...item,
                subtotal: qty * price,
            };
        });
    }

    private updateFuelEFS(id: number): void {
        const newData: any = {
            id: id,
            truckId: this.selectedTruckType.id,
            trailerId: this.selectedTrailerType?.id ?? null,
            driverId: this.selectedDispatchHistory?.driverId,
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
            driverId: this.selectedDispatchHistory?.driverId ?? null,
            truckId: this.selectedTruckType?.id ?? null,
            invoice: this.fuelForm.get(FuelValuesStringEnum.INVOICE).value,
            trailerId: this.selectedTrailerType?.id ?? null,
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
            total: MethodsCalculationsHelper.convertThousandSepInNumber(
                this.total as any
            ),
            fuelItems: this.convertItems(),
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
            .pipe(
                takeUntil(this.destroy$),
                tap((response) => {
                    const {
                        fuelCard,
                        trailer,
                        truck,
                        driver,
                        invoice,
                        transactionDate,
                        fuelStopStore,
                        fuelItems,
                        files,
                        total,
                        fuelTransactionType,
                        fuelCardHolderName,
                    } = response;

                    this.fuelForm.patchValue({
                        efsAccount: null,
                        fuelCard: fuelCard?.cardNumber,
                        truckId: truck?.id ?? null,
                        invoice: invoice,
                        trailerId: trailer?.trailerNumber ?? null,
                        driverFullName: driver
                            ? driver.firstName?.concat(' ', driver.lastName)
                            : null,
                        transactionDate:
                            MethodsCalculationsHelper.convertDateFromBackend(
                                transactionDate
                            ),
                        transactionTime:
                            this.getTransactionTime(transactionDate),
                        fuelStopStoreId: fuelStopStore
                            ? fuelStopStore.fuelStopFranchise
                                ? fuelStopStore.store
                                : fuelStopStore.businessName
                            : null,
                        fuelItems,
                        total,
                    });

                    this.selectedTruckType = {
                        id: truck?.id,
                        number: truck?.truckNumber,
                        logoName: truck?.truckType.logoName,
                        name: truck?.truckNumber,
                        folder: FuelValuesStringEnum.COMMON,
                        subFolder: FuelValuesStringEnum.TRUCKS,
                    };

                    this.selectedTrailerType = {
                        id: trailer?.id,
                        number: trailer?.trailerNumber,
                        logoName: trailer?.trailerType.logoName,
                        name: trailer?.trailerNumber,
                        folder: FuelValuesStringEnum.COMMON,
                        subFolder: FuelValuesStringEnum.TRAILERS,
                    };

                    this.documents = files;

                    this.updatedFuelItems = fuelItems;

                    this.selectedDispatchHistory = {
                        ...this.selectedDispatchHistory,
                        driverId: driver?.id,
                    };

                    if (!fuelStopStore.fuelStopFranchise) {
                        this.selectedFuelStop = {
                            id: fuelStopStore.id,
                            name: fuelStopStore.businessName,
                            businessName: fuelStopStore.businessName,
                            fuelStopFranchise: null,
                            address: fuelStopStore.address,
                            fullAddress: fuelStopStore.address.address,
                            isFranchise: false,
                        };
                    } else {
                        this.selectedFuelStop = {
                            storeId: fuelStopStore.id,
                            name: fuelStopStore.store,
                            businessName:
                                fuelStopStore.fuelStopFranchise.businessName,
                            fuelStopFranchise: fuelStopStore.fuelStopFranchise,
                            address: fuelStopStore.address,
                            fullAddress: fuelStopStore.address.address,
                            isFranchise: true,
                        };
                    }

                    this.fuelTransactionType = fuelTransactionType;
                    this.fuelCardHolderName = fuelCardHolderName;
                }),
                filter((response) => !!response.driver),
                switchMap(() => {
                    return this.getDriverTrailerBySelectedTruck();
                })
            )
            .subscribe((response) => {
                const { data } = response?.pagination || {};
                this.selectedDispatchHistory = response;

                this.patchDriverFullName(
                    response?.firstName,
                    response?.lastName
                );

                this.fuelForm
                    .get(FuelValuesStringEnum.TRAILER_ID)
                    .patchValue(response?.trailerNumber);

                this.selectedTrailerType = {
                    id: response?.trailerId,
                    number: response?.trailerNumber,
                    logoName: response?.logoName,
                    name: response?.trailerNumber,
                    folder: FuelValuesStringEnum.COMMON,
                    subFolder: FuelValuesStringEnum.TRAILERS,
                };

                if (!!data) this.composeDriverOptions(data);
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
                            eDropdownMenu.ADD_TRANSACTION_TYPE
                        )
                            this.getFuelStopById(this.editData?.data?.id);

                        this.addFuelItem();
                    }
                },
            });
    }

    private getDriverTrailerBySelectedTruck(): Observable<FuelDispatchHistoryResponse> {
        if (
            this.selectedTruckType?.id &&
            this.fuelForm.get(FuelValuesStringEnum.TRANSACTION_DATE).value &&
            this.fuelForm.get(FuelValuesStringEnum.TRANSACTION_TIME).value
        ) {
            const date = this.fuelForm.get(
                FuelValuesStringEnum.TRANSACTION_DATE
            ).value;
            const time = this.fuelForm.get(
                FuelValuesStringEnum.TRANSACTION_TIME
            ).value;
            const dateUtc = moment.utc(new Date(date + ' ' + time)).format();

            return this.fuelService.getDispatchHistoryByTruckIdAndDate(
                this.selectedTruckType.id,
                dateUtc
            );
        } else return of(null);
    }

    private getInitialDriverTrailerBySelectedTruck(): void {
        this.getDriverTrailerBySelectedTruck()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                this.selectedDispatchHistory = response;
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

    private getTruckList(pageIndex: number = 1, pageSize: number = 200): void {
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
                                name: item?.truckNumber,
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

                        this.onSelectDropDown(
                            truck,
                            FuelValuesStringEnum.TRUCK
                        );
                    }
                },
            });
    }

    private getTransactionTime(date: string): string {
        return MethodsCalculationsHelper.convertDateToTimeFromBackend(date);
    }

    private getFuelTransactionFranchisesIfNeeded(): void {
        const { data } = this.editData || {};
        const { fuelTransactionType } = data || {};

        if (
            this.modalActionType === FuelDataOptionsStringEnum.ADD ||
            (this.modalActionType === FuelDataOptionsStringEnum.EDIT &&
                fuelTransactionType?.id === eFuelTransactionType.Manual)
        )
            this.getFuelTransactionFranchises();
    }

    private setModalActionType(): void {
        if (!!this.editData?.type) this.modalActionType = this.editData.type;
        else this.modalActionType = FuelDataOptionsStringEnum.ADD;
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
        const initialData: IFuelPurchaseModalForm = this.getInitialFormData();
        const { ...data } = initialData;

        this.fuelForm = this.formBuilder.group({
            efsAccount: [null],
            fuelCard: [null],
            invoice: [null, Validators.required],
            truckId: [data.truckId, Validators.required],
            trailerId: [null],
            driverFullName: [null, fullNameValidation],
            transactionDate: [data.transactionDate, Validators.required],
            transactionTime: [data.transactionTime, Validators.required],
            fuelStopStoreId: [null, Validators.required],
            fuelItems: this.formBuilder.array([]),
            total: [null],
        });
    }

    private mapDocuments(): Blob[] {
        const documents: Blob[] = [];

        this.documents?.forEach((item) => {
            if (item.realFile) documents.push(item.realFile);
        });

        return documents;
    }

    private composeDriverOptions(data: DriverFilterResponse[]): void {
        this.driverOptions = data.map((driver) => {
            return {
                id: driver.id,
                name: driver.driverFullName,
                logoName: driver?.avatarFile?.url,
                suffix: '',
            };
        });
    }

    private patchDriverFullName(firstName: string, lastName: string): void {
        this.fuelForm
            .get(FuelValuesStringEnum.DRIVER_FULL_NAME)
            .patchValue(firstName?.concat(' ', lastName) ?? null);
    }

    private getInitialFormData(): IFuelPurchaseModalForm {
        let result: IFuelPurchaseModalForm = {};

        if (!this.editData) return result;

        const { type, data } = this.editData;

        const truckId = data?.truckId ?? null;
        const transactionDate =
            type === eGeneralActions.EDIT
                ? MethodsCalculationsHelper.convertDateFromBackend(
                      data?.transactionDate
                  )
                : null;
        const transactionTime =
            type === eGeneralActions.EDIT
                ? MethodsCalculationsHelper.convertDateToTimeFromBackend(
                      transactionDate
                  )
                : null;

        result = {
            truckId,
            transactionDate,
            transactionTime,
        };

        return result;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
