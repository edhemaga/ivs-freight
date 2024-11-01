import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

// Actions
import * as PayrollCommissionActions from '../actions/payroll_commission_driver.actions';

// Selectors
import {
    selectCommissionListDriver,
    selectDriverCommissionCollapsedTable,
    selectDriverCommissionExpandedTable,
    selectPayrollDriverCommissionLoads,
    selectPayrollReportsIncludedCommissionStops,
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
import {
    LoadWithMilesStopResponse,
    PayrollDriverCommissionByIdResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageExpandedListResponse } from '../models/payroll.model';

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

    public selectPayrollReportIncludedLoads$: Observable<
        LoadWithMilesStopResponse[]
    > = this.store.pipe(select(selectPayrollReportsIncludedCommissionStops));

    public selectPayrollDriverCommissionExpanded$: Observable<
        PayrollDriverMileageExpandedListResponse[]
    > = this.store.pipe(select(selectDriverCommissionExpandedTable));

    public selectPayrollDriverCommissionCollapsed$: Observable<
        PayrollDriverMileageListResponse[]
    > = this.store.pipe(select(selectDriverCommissionCollapsedTable));

    public getPayrollDriverCommissionList() {
        this.store.dispatch(
            PayrollCommissionActions.getPayrollCommissionDriver()
        );
    }

    public getPayrollCommissionMileageExpandedList(driverId: number) {
        this.store.dispatch(
            PayrollCommissionActions.getPayrollCommissionDriverExpandedList({
                driverId,
            })
        );
    }

    public getPayrollDriverCommissionCollapsedList() {
        this.store.dispatch(
            PayrollCommissionActions.getPayrollCommissionDriverCollapsedList()
        );
    }

    public getPayrollDriverCommissionReport({
        reportId,
        selectedLoadIds,
        selectedCreditIds,
        selectedDeductionIds,
    }: {
        reportId: string;
        selectedLoadIds?: number[];
        selectedCreditIds?: number[];
        selectedDeductionIds?: number[];
    }) {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollState.payrollOpenedTab === 'closed') {
                    this.store.dispatch(
                        PayrollCommissionActions.getPayrollCommissionReportDriverClosedPayroll(
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
                                selectedLoadIds:
                                    selectedLoadIds ??
                                    payrollState.selectedLoadIds,
                                selectedCreditIds:
                                    selectedCreditIds ??
                                    payrollState.selectedCreditIds,
                                selectedDeductionIds:
                                    selectedDeductionIds ??
                                    payrollState.selectedDeductionIds,
                            }
                        )
                    );
                }
            });
    }
}
