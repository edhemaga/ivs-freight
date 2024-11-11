import { ModalService } from '@shared/services/modal.service';
import {
    CreatePayrollCreditCommand,
    PayrollCreditType,
} from 'appcoretruckassist';
import { PayrollCreditBonusComponent } from '../../payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';
import { PayrollBonusModalComponent } from '../../payroll-modals/payroll-bonus-modal/payroll-bonus-modal.component';
import { PayrollDeductionModalComponent } from '../../payroll-modals/payroll-deduction-modal/payroll-deduction-modal.component';

export abstract class PayrollReportBaseComponent<
    T extends { driver?: { id?: number }; truck?: { id?: number } }
> {
    openedPayroll: T;
    abstract creditType: PayrollCreditType;

    constructor(protected modalService: ModalService) {}

    protected abstract getReportDataResults(): void;

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
}
