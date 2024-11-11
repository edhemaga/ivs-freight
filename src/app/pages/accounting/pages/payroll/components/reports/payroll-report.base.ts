import { ModalService } from '@shared/services/modal.service';
import {
    CreatePayrollCreditCommand,
    PayrollCreditType,
} from 'appcoretruckassist';
import { PayrollCreditBonusComponent } from '../../payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { PayrollBonusModalComponent } from '../../payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollDeductionModalComponent } from '../../payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';
import { PayrollReportTableResponse } from 'ca-components/lib/components/ca-period-content/models/payroll-report-tables.type';
import { IGetPayrollByIdAndOptions } from '../../state/models/payroll.model';

export abstract class PayrollReportBaseComponent<
    T extends { driver?: { id?: number }; truck?: { id?: number } }
> {
    openedPayroll: T;
    abstract creditType: PayrollCreditType;

    protected _reportId: string;

    constructor(protected modalService: ModalService) {}

    protected abstract getReportDataResults(
        getData?: IGetPayrollByIdAndOptions
    ): void;

    public get reportId(): string {
        console.log('Getter in abstract class called: ', this._reportId);
        return this._reportId;
    }

    public set reportId(value: string) {
        console.log('Setter in abstract class called with: ', value);
        this._reportId = value;
    }

    public openAddNewModal(type: string) {
        switch (type) {
            case 'Credit':
                this.modalService
                    .openModal(
                        PayrollCreditBonusComponent,
                        {
                            size: 'small',
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
            case 'Bonus':
                this.modalService
                    .openModal(
                        PayrollBonusModalComponent,
                        {
                            size: 'small',
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
            case 'Credit':
                this.modalService
                    .openModal(
                        PayrollBonusModalComponent,
                        {
                            size: 'small',
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
            case 'Deduction':
                this.modalService
                    .openModal(
                        PayrollDeductionModalComponent,
                        {
                            size: 'small',
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
        }
    }

    public onOpenActionEditItems(item: any): void {
        if (item.$event.type === 'Edit') {
            switch (item.title) {
                case 'Credit':
                    this.modalService
                        .openModal(
                            PayrollCreditBonusComponent,
                            {
                                size: 'small',
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
                case 'Bonus':
                    this.modalService
                        .openModal(
                            PayrollBonusModalComponent,
                            {
                                size: 'small',
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
                case 'Deduction':
                    this.modalService
                        .openModal(
                            PayrollDeductionModalComponent,
                            {
                                size: 'small',
                            },
                            {
                                edit: true,
                                data: {
                                    id: item.data.parentPayrollDeductionId,
                                } as CreatePayrollCreditCommand,
                                creditType: PayrollCreditType.Driver,
                            }
                        )
                        .then(() => {
                            this.getReportDataResults();
                        });
                    break;
            }
        }
    }

    onReorderItem({
        _included,
        _title,
    }: {
        _included: PayrollReportTableResponse[];
        _title: string;
    }) {
        let dataSend = {
            reportId: `${this.reportId}`,
            selectedCreditIds: null,
            selectedDeductionIds: null,
            selectedBonusIds: null,
        };
        if (_title === 'Credit') {
            dataSend = {
                ...dataSend,
                selectedCreditIds: _included.map((load) => load.id),
            };
        } else if (_title === 'Deduction') {
            dataSend = {
                ...dataSend,
                selectedDeductionIds: _included.map((load) => load.id),
            };
        } else if (_title === 'Bonus') {
            dataSend = {
                ...dataSend,
                selectedBonusIds: _included.map((load) => load.id),
            };
        }

        this.getReportDataResults(dataSend);
    }
}
