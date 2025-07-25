import { tap } from 'rxjs';

// Services
import { ModalService } from '@shared/services/modal.service';
import { PayrollService } from '@pages/accounting/pages/payroll/services';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';
import { DriverService } from '@pages/driver/services/driver.service';

// Models
import {
    CreatePayrollCreditCommand,
    PayrollCreditType,
} from 'appcoretruckassist';
import { PayrollReportTableResponse } from 'ca-components/lib/components/ca-period-content/models/payroll-report-tables.type';
import { IGetPayrollByIdAndOptions } from '@pages/accounting/pages/payroll/state/models';

// Components
import { PayrollCreditBonusComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { PayrollBonusModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollDeductionModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';
import { FuelPurchaseModalComponent } from '@pages/fuel/pages/fuel-modals/fuel-purchase-modal/fuel-purchase-modal.component';
import { PayrollPdfReportComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-report/payroll-pdf-report.component';
import { DriverModalComponent } from '@pages/driver/pages/driver-modals/driver-modal/driver-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';

// Enums
import {
    ePayrollAdditionalTypes,
    ePayrollTablesStatus,
} from '@pages/accounting/pages/payroll/state/enums';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';
import {
    DropActionsStringEnum,
    eDropdownMenu,
    TableStringEnum,
} from '@shared/enums';
import { PayrollTypeEnum } from 'ca-components';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';
import { eLoadStatusType } from '@pages/load/pages/load-table/enums';

type TPopup = {
    modalType?:
        | TableStringEnum.DEDUCTION
        | TableStringEnum.CREDIT
        | TableStringEnum.BONUS
        | TableStringEnum.FUEL_TRANSACTION;
    action?:
        | ConfirmationModalStringEnum.DELETE_DEDUCTION
        | ConfirmationModalStringEnum.DELETE_CREDIT
        | ConfirmationModalStringEnum.DELETE_FUEL_TRANSACTION
        | ConfirmationModalStringEnum.DELETE_BONUS;
    id?: number;
    data?: {
        title: string;
        subtitle: string;
        date: string;
        label: string;
        id: number;
    };
};

export abstract class PayrollReportBaseComponent<
    T extends {
        driver?: { id?: number; fullName?: string | null };
        truck?: { id?: number };
        id?: number;
        owner?: { id?: number; name?: string | null };
    },
> {
    public openedPayroll: T;
    abstract creditType: PayrollCreditType;
    abstract payrollType: PayrollTypeEnum;

    protected _reportId: string;

    public isEditLoadDropdownActionActive: boolean = false;

    public get reportId(): string {
        return this._reportId;
    }

    public set reportId(value: string) {
        this._reportId = value;
    }

    constructor(
        protected modalService: ModalService,

        private payrollService: PayrollService,

        public loadStoreService: LoadStoreService,
        public driverService: DriverService
    ) {}

    protected abstract getReportDataResults(
        getData?: IGetPayrollByIdAndOptions
    ): void;

    protected abstract getIsEditLoadDropdownActionActive(): void;

    public openMenu(event: {
        type: string;
        isActive?: boolean;
        id?: number;
    }): void {
        const { type, isActive, id } = event;

        switch (type) {
            case eDropdownMenu.EDIT_LOAD_TYPE:
                this.isEditLoadDropdownActionActive = isActive;

                this.getIsEditLoadDropdownActionActive();

                break;
            case eDropdownMenu.EDIT_PAYROLL_TYPE:
                this.openDriverOrTruckModal(id);

                break;
            case eDropdownMenu.PREVIEW_REPORT_TYPE:
                this.openPayrollReportModal();

                break;
            case eDropdownMenu.DOWNLOAD_TYPE:
                this.downloadPayrollReport();

                break;
            default:
                break;
        }

        // Lets assume that if there is only id it is for load edit
        if (!type && id) {
            this.loadStoreService.dispatchGetEditLoadOrTemplateModalData(
                id,
                eLoadStatusType.Closed,
                LoadModalStringEnum.EDIT
            );
        }
    }

    public openAddNewModal(type: string): void {
        switch (type) {
            case ePayrollAdditionalTypes.CREDIT:
                this.modalService
                    .openModal(
                        PayrollCreditBonusComponent,
                        {
                            size: DriverMVrModalStringEnum.SMALL,
                        },
                        {
                            data: {
                                driverId: this.openedPayroll.driver?.id,
                                truckId: this.openedPayroll.truck?.id,
                            } as CreatePayrollCreditCommand,
                            creditType: this.creditType,
                        }
                    )
                    .then(() => {
                        this.getReportDataResults();
                    });
                break;
            case ePayrollAdditionalTypes.BONUS:
                this.modalService
                    .openModal(
                        PayrollBonusModalComponent,
                        {
                            size: DriverMVrModalStringEnum.SMALL,
                        },
                        {
                            data: {
                                driverId: this.openedPayroll.driver?.id,
                                truckId: this.openedPayroll.truck?.id,
                            } as CreatePayrollCreditCommand,
                            creditType: this.creditType,
                        }
                    )
                    .then(() => {
                        this.getReportDataResults();
                    });
                return;
            case ePayrollAdditionalTypes.DEDUCTION:
                this.modalService
                    .openModal(
                        PayrollDeductionModalComponent,
                        {
                            size: DriverMVrModalStringEnum.SMALL,
                        },
                        {
                            data: {
                                driverId: this.openedPayroll.driver?.id,
                                truckId: this.openedPayroll.truck?.id,
                            } as CreatePayrollCreditCommand,
                            creditType: this.creditType,
                        }
                    )
                    .then(() => {
                        this.getReportDataResults();
                    });
                break;
            case ePayrollAdditionalTypes.FUEL:
                this.modalService
                    .openModal(
                        FuelPurchaseModalComponent,
                        {
                            size: DriverMVrModalStringEnum.SMALL,
                        },
                        {
                            truckId: this.openedPayroll.truck?.id,
                            creditType: this.creditType,
                            payrollOwnerId: this.openedPayroll.id,
                        }
                    )
                    .then(() => {
                        this.getReportDataResults();
                    });
                break;
        }
    }

    public onOpenActionEditItems(item: any): void {
        const label = this.openedPayroll.truck
            ? this.openedPayroll.owner?.name
            : this.openedPayroll.driver.fullName;

        if (item.$event.type === TableStringEnum.EDIT) {
            switch (item.title) {
                case ePayrollAdditionalTypes.CREDIT:
                    this.modalService
                        .openModal(
                            PayrollCreditBonusComponent,
                            {
                                size: DriverMVrModalStringEnum.SMALL,
                            },
                            {
                                edit: true,
                                data: {
                                    ...item.data,
                                    driverId: this.openedPayroll.driver?.id,
                                    truckId: this.openedPayroll.truck?.id,
                                } as CreatePayrollCreditCommand,
                                creditType: this.creditType,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
                case ePayrollAdditionalTypes.BONUS:
                    this.modalService
                        .openModal(
                            PayrollBonusModalComponent,
                            {
                                size: DriverMVrModalStringEnum.SMALL,
                            },
                            {
                                edit: true,
                                data: {
                                    ...item.data,
                                    driverId: this.openedPayroll.driver?.id,
                                    truckId: this.openedPayroll.truck?.id,
                                } as CreatePayrollCreditCommand,
                                creditType: this.creditType,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
                case ePayrollAdditionalTypes.DEDUCTION:
                    this.modalService
                        .openModal(
                            PayrollDeductionModalComponent,
                            {
                                size: DriverMVrModalStringEnum.SMALL,
                            },
                            {
                                edit: true,
                                data: {
                                    id:
                                        item.data.parentPayrollDeductionId ||
                                        item.data.id,
                                } as CreatePayrollCreditCommand,
                                creditType: this.creditType,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
                case ePayrollAdditionalTypes.FUEL:
                    this.modalService
                        .openModal(
                            FuelPurchaseModalComponent,
                            {
                                size: DriverMVrModalStringEnum.SMALL,
                            },
                            {
                                id: item.data.id,
                                type: TableStringEnum.EDIT,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
            }
        } else if (item.$event.type === TableStringEnum.DELETE) {
            let deleteServiceData: TPopup = {};

            switch (item.title) {
                case ePayrollAdditionalTypes.CREDIT:
                    deleteServiceData = {
                        modalType: TableStringEnum.CREDIT,
                        action: ConfirmationModalStringEnum.DELETE_CREDIT,
                        id: item.data.id,
                        data: {
                            title: item.data.description,
                            subtitle: item.data.subtotal,
                            date: item.data.date,
                            label: `${label}`,
                            id: item.data.id,
                        },
                    };
                    break;
                case ePayrollAdditionalTypes.DEDUCTION:
                    deleteServiceData = {
                        modalType: TableStringEnum.DEDUCTION,
                        action: ConfirmationModalStringEnum.DELETE_DEDUCTION,
                        id: item.data.id,
                        data: {
                            title: item.data.description,
                            subtitle: item.data.subtotal,
                            date: item.data.date,
                            label: `${label}`,
                            id:
                                item.data.parentPayrollDeductionId ||
                                item.data.id,
                        },
                    };
                    break;
                case ePayrollAdditionalTypes.BONUS:
                    deleteServiceData = {
                        modalType: TableStringEnum.BONUS,
                        action: ConfirmationModalStringEnum.DELETE_BONUS,
                        id: item.data.id,
                        data: {
                            title: item.data.description,
                            subtitle: item.data.subtotal,
                            date: item.data.date,
                            label: `${label}`,
                            id: item.data.id,
                        },
                    };
                    break;
                case ePayrollAdditionalTypes.FUEL:
                    deleteServiceData = {
                        modalType: TableStringEnum.FUEL_TRANSACTION,
                        action: ConfirmationModalStringEnum.DELETE_FUEL_TRANSACTION,
                        id: item.data.id,
                        data: {
                            title: `${item.data.fuelStop.businessName} ${item.data.fuelStop.businessName.store ? ` - ${item.data.fuelStop.businessName.store}` : ''}`,
                            subtitle: item.data.total,
                            date: item.data.date,
                            label: `${label}`,
                            id: item.data.id,
                        },
                    };
                    break;
            }

            this.openDeleteModal(deleteServiceData);
        }
    }

    public openPayrollReportModal(): void {
        this.modalService.openModal(
            PayrollPdfReportComponent,
            {},
            {
                data: {
                    id: this.openedPayroll.id,
                    type: this.payrollType,
                },
            }
        );
    }

    public openDriverOrTruckModal(id: number) {
        if (this.openedPayroll.driver?.id) {
            this.driverService
                .getDriverById(this.openedPayroll.driver?.id)
                .pipe(
                    tap((driver) => {
                        const editData = {
                            data: {
                                ...driver,
                            },
                            type: TableStringEnum.EDIT,
                            id: id,
                            disableButton: true,
                        };

                        this.modalService
                            .openModal(
                                DriverModalComponent,
                                { size: TableStringEnum.MEDIUM },
                                {
                                    ...editData,
                                    avatarIndex: 0,
                                    isDeactivateOnly: true,
                                }
                            )
                            .then(() => {
                                this.getReportDataResults();
                            });
                    })
                )
                .subscribe();
        } else if (this.openedPayroll.owner?.id) {
            this.modalService
                .openModal(
                    TruckModalComponent,
                    {},
                    {
                        id: this.openedPayroll.truck?.id,
                        type: DropActionsStringEnum.EDIT,
                    }
                )
                .then(() => {
                    this.getReportDataResults();
                });
        }
    }

    public downloadPayrollReport(): void {
        this.payrollService
            .generateReport(this.openedPayroll.id, this.payrollType)
            .subscribe({
                next: (pdfReport) => {
                    const { downloadUrl } = pdfReport;

                    const filename = `Report-${this.payrollType}-${this.openedPayroll.id}.pdf`;

                    this.payrollService.downloadPayrollPdfReport(
                        downloadUrl,
                        filename
                    );
                },
            });
    }

    public openDeleteModal(deleteServiceData: TPopup) {
        this.payrollService
            .raiseDeleteModal(
                deleteServiceData.modalType,
                deleteServiceData.action,
                deleteServiceData.id,
                deleteServiceData.data
            )
            .then(() => {
                this.getReportDataResults();
            });
    }

    public onReorderItem({
        _included,
        _title,
    }: {
        _included: PayrollReportTableResponse[];
        _title: string;
    }): void {
        let dataSend = {
            reportId: `${this.reportId}`,
            selectedCreditIds: null,
            selectedDeductionIds: null,
            selectedBonusIds: null,
            selectedFuelIds: null,
            payrollOpenedTab: ePayrollTablesStatus.OPEN,
        };

        if (_title === ePayrollAdditionalTypes.CREDIT) {
            dataSend = {
                ...dataSend,
                selectedCreditIds: _included.length
                    ? _included.map((load) => load.id)
                    : [0],
            };
        } else if (_title === ePayrollAdditionalTypes.DEDUCTION) {
            dataSend = {
                ...dataSend,
                selectedDeductionIds: _included.length
                    ? _included.map((load) => load.id)
                    : [0],
            };
        } else if (_title === ePayrollAdditionalTypes.BONUS) {
            dataSend = {
                ...dataSend,
                selectedBonusIds: _included.length
                    ? _included.map((load) => load.id)
                    : [0],
            };
        } else if (_title === ePayrollAdditionalTypes.FUEL) {
            dataSend = {
                ...dataSend,
                selectedFuelIds: _included.length
                    ? _included.map((load) => load.id)
                    : [0],
            };
        }

        this.getReportDataResults(dataSend);
    }
}
