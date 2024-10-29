import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

// Actions
import * as PayrollCommissionActions from '../actions/payroll_commission_driver.actions';

// Selectors
import {
    selectCommissionListDriver,
    selectPayrollDriverCommissionLoads,
} from '../selectors/payroll_driver_commision.selector';

// Models
import {
    CommissionLoadShortReponseWithRowType,
    IDriverCommissionList,
} from '../models/driver_commission.model';
import {
    selectPayrollOpenedReport,
    selectPayrollState,
} from '../selectors/payroll.selector';
import { PayrollDriverCommissionByIdResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class PayrollDriverCommissionFacadeService {
    constructor(private store: Store) {}

    public selectCommissionDriverList$: Observable<IDriverCommissionList> =
        this.store.pipe(select(selectCommissionListDriver));

    public selectPayrollOpenedReport$: Observable<PayrollDriverCommissionByIdResponse> =
        this.store.pipe(select(selectPayrollOpenedReport));

    public selectPayrollReportDriverCommissionLoads$: Observable<
        CommissionLoadShortReponseWithRowType[]
    > = this.store.pipe(select(selectPayrollDriverCommissionLoads));

    public getPayrollDriverCommissionList() {
        this.store.dispatch(
            PayrollCommissionActions.getPayrollCommissionDriver()
        );
    }

    public getPayrollDriverCommissionReport({
        reportId,
        lastLoadDate,
        selectedCreditIds,
        selectedBonusIds,
        selectedDeducionIds,
    }: {
        reportId: string;
        lastLoadDate?: string;
        selectedCreditIds?: number[];
        selectedBonusIds?: number[];
        selectedDeducionIds?: number[];
    }) {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollState.payrollOpenedTab === 'closed') {
                    this.store.dispatch(
                        PayrollCommissionActions.getPayrollCommissionDriverClosedPayroll(
                            {
                                payrollId: +reportId,
                            }
                        )
                    );
                } else {
                    this.store.dispatch(
                        PayrollCommissionActions.getPayrollCommissionReportDriver(
                            {
                                reportId,
                                lastLoadDate:
                                    lastLoadDate ?? payrollState.lastLoadDate,
                                selectedCreditIds:
                                    selectedCreditIds ??
                                    payrollState.selectedCreditIds,
                                selectedBonusIds:
                                    selectedBonusIds ??
                                    payrollState.selectedBonusIds,
                                selectedDeducionIds:
                                    selectedDeducionIds ??
                                    payrollState.selectedDeducionIds,
                            }
                        )
                    );
                }
            });
    }
}
