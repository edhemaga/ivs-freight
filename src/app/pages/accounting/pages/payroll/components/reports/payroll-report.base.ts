// Services
import { ModalService } from '@shared/services/modal.service';
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

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
import { PayrollReportComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-report/payroll-report.component';
import { PayrollTypeEnum } from 'ca-components';

// Enums
import { PayrollAdditionalTypes, PayrollStringEnum } from '../../state/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { DriverMVrModalStringEnum } from '@pages/driver/pages/driver-modals/driver-mvr-modal/enums/driver-mvrl-modal-string.enum';

export abstract class PayrollReportBaseComponent<
    T extends {
        driver?: { id?: number; fullName?: string | null };
        truck?: { id?: number };
        id?: number;
    }
> {
    public openedPayroll: T;
    abstract creditType: PayrollCreditType;
    abstract payrollType: PayrollTypeEnum;

    protected _reportId: string;

    constructor(
        protected modalService: ModalService,
        private payrollService: PayrollService
    ) {}

    protected abstract getReportDataResults(
        getData?: IGetPayrollByIdAndOptions
    ): void;

    public get reportId(): string {
        return this._reportId;
    }

    public set reportId(value: string) {
        this._reportId = value;
    }

    public openMenu(data: { type: string }) {
        if (data.type === PayrollStringEnum.REPORT) {
            this.modalService.openModal(
                PayrollReportComponent,
                {},
                {
                    data: {
                        id: this.openedPayroll.id,
                        type: this.payrollType,
                    },
                }
            );
        }
    }

    public openAddNewModal(type: string): void {
        switch (type) {
            case PayrollAdditionalTypes.CREDIT:
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
            case PayrollAdditionalTypes.BONUS:
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
            case PayrollAdditionalTypes.DEDUCTION:
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
            case PayrollAdditionalTypes.FUEL:
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
        if (item.$event.type === TableStringEnum.EDIT_2) {
            switch (item.title) {
                case PayrollAdditionalTypes.CREDIT:
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
                                creditType: PayrollCreditType.Driver,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
                case PayrollAdditionalTypes.BONUS:
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
                                creditType: PayrollCreditType.Driver,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
                case PayrollAdditionalTypes.DEDUCTION:
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
                                creditType: PayrollCreditType.Driver,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
            }
        } else if (item.$event.type === TableStringEnum.DELETE_2) {
            switch (item.title) {
                case PayrollAdditionalTypes.CREDIT:
                    this.payrollService
                        .raiseDeleteModal(
                            TableStringEnum.CREDIT,
                            ConfirmationModalStringEnum.DELETE_CREDIT,
                            item.data.id,
                            {
                                title: item.data.description,
                                subtitle: item.data.subtotal,
                                date: item.data.date,
                                label: `${this.openedPayroll.driver.fullName}`,
                                id: item.data.id,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
                case PayrollAdditionalTypes.DEDUCTION:
                    this.payrollService
                        .raiseDeleteModal(
                            TableStringEnum.DEDUCTION,
                            ConfirmationModalStringEnum.DELETE_DEDUCTION,
                            item.data.id,
                            {
                                title: item.data.description,
                                subtitle: item.data.subtotal,
                                date: item.data.date,
                                label: `${this.openedPayroll.driver.fullName}`,
                                id: item.data.id,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
                case PayrollAdditionalTypes.BONUS:
                    this.payrollService
                        .raiseDeleteModal(
                            TableStringEnum.BONUS,
                            ConfirmationModalStringEnum.DELETE_BONUS,
                            item.data.id,
                            {
                                title: item.data.description,
                                subtitle: item.data.subtotal,
                                date: item.data.date,
                                label: `${this.openedPayroll.driver.fullName}`,
                                id: item.data.id,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
            }
        }
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
        };

        if (_title === PayrollAdditionalTypes.CREDIT) {
            dataSend = {
                ...dataSend,
                selectedCreditIds: _included.length
                    ? _included.map((load) => load.id)
                    : 0,
            };
        } else if (_title === PayrollAdditionalTypes.DEDUCTION) {
            dataSend = {
                ...dataSend,
                selectedDeductionIds: _included.length
                    ? _included.map((load) => load.id)
                    : 0,
            };
        } else if (_title === PayrollAdditionalTypes.BONUS) {
            dataSend = {
                ...dataSend,
                selectedBonusIds: _included.length
                    ? _included.map((load) => load.id)
                    : 0,
            };
        }

        this.getReportDataResults(dataSend);
    }
}
