import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

// Actions
import * as PayrollCommissionActions from '@pages/accounting/pages/payroll/state/actions';

// Selectors
import {
    selectCommissionListDriver,
    selectDriverCommissionCollapsedTable,
    selectDriverCommissionExpandedTable,
    selectPayrollDriverCommissionLoads,
    selectPayrollReportsIncludedCommissionStops,
} from '@pages/accounting/pages/payroll/state/selectors';

// Models
import {
    CommissionLoadShortReponseWithRowType,
    IDriverCommissionList,
    ILoadWithMilesStopResponseNumberId,
} from '@pages/accounting/pages/payroll/state/models';
import {
    selectPayrollOpenedReport,
    selectPayrollState,
} from '@pages/accounting/pages/payroll/state/selectors';
import {
    PayrollDriverCommissionByIdResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageExpandedListResponse } from '@pages/accounting/pages/payroll/state/models';
import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';

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
        ILoadWithMilesStopResponseNumberId[]
    > = this.store.pipe(select(selectPayrollReportsIncludedCommissionStops));

    public selectPayrollDriverCommissionExpanded$: Observable<
        PayrollDriverMileageExpandedListResponse[]
    > = this.store.pipe(select(selectDriverCommissionExpandedTable));

    public selectPayrollDriverCommissionCollapsed$: Observable<
        PayrollDriverMileageListResponse[]
    > = this.store.pipe(select(selectDriverCommissionCollapsedTable));

    public getPayrollDriverCommissionList(): void {
        this.store.dispatch(
            PayrollCommissionActions.getPayrollCommissionDriver()
        );
    }

    public getPayrollCommissionMileageExpandedList(driverId: number): void {
        this.store.dispatch(
            PayrollCommissionActions.getPayrollCommissionDriverExpandedList({
                driverId,
            })
        );
    }

    public getPayrollDriverCommissionCollapsedList(): void {
        this.store.dispatch(
            PayrollCommissionActions.getPayrollCommissionDriverCollapsedList()
        );
    }

    public getPayrollDriverCommissionReport({
        reportId,
        selectedLoadIds,
        selectedCreditIds,
        selectedDeductionIds,
        payrollOpenedTab,
    }: {
        reportId: string;
        selectedLoadIds?: number[];
        selectedCreditIds?: number[];
        selectedDeductionIds?: number[];
        payrollOpenedTab: ePayrollTablesStatus;
    }): void {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollOpenedTab === 'closed') {
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
