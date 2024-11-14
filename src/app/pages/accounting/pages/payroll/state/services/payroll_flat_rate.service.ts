import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

// Actions
import * as PayrollFlatRateActions from '@pages/accounting/pages/payroll/state/actions/payroll_flat_rate_driver.actions';

// Selectors
import {
    selectDriverFlatRateCollapsedTable,
    selectDriverFlatRateExpandedTable,
    selectFlatRateListDriver,
    selectPayrollDriverFlatRateLoads,
    selectPayrollReportsIncludedFlatRateStops,
} from '@pages/accounting/pages/payroll/state/selectors/payroll_driver_flat_rate.selector';

// Models
import {
    FlatRateLoadShortReponseWithRowType,
    IDriverFlatRateList,
} from '@pages/accounting/pages/payroll/state/models/driver_flat_rate.model';
import {
    selectPayrollOpenedReport,
    selectPayrollState,
} from '@pages/accounting/pages/payroll/state/selectors/payroll.selector';
import {
    LoadWithMilesStopResponse,
    PayrollDriverCommissionByIdResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageExpandedListResponse } from '@pages/accounting/pages/payroll/state/models/payroll.model';

@Injectable({
    providedIn: 'root',
})
export class PayrollDriverFlatRateFacadeService {
    constructor(private store: Store) {}

    public selectFlatListDriverList$: Observable<IDriverFlatRateList> =
        this.store.pipe(select(selectFlatRateListDriver));

    public selectPayrollOpenedReport$: Observable<PayrollDriverCommissionByIdResponse> =
        this.store.pipe(select(selectPayrollOpenedReport));

    public selectPayrollReportDriverFlatRateLoads$: Observable<
        FlatRateLoadShortReponseWithRowType[]
    > = this.store.pipe(select(selectPayrollDriverFlatRateLoads));

    public selectPayrollReportIncludedLoads$: Observable<
        LoadWithMilesStopResponse[]
    > = this.store.pipe(select(selectPayrollReportsIncludedFlatRateStops));

    public selectPayrollDriverFlatRateExpanded$: Observable<
        PayrollDriverMileageExpandedListResponse[]
    > = this.store.pipe(select(selectDriverFlatRateExpandedTable));

    public selectPayrollDriverFlatRateCollapsed$: Observable<
        PayrollDriverMileageListResponse[]
    > = this.store.pipe(select(selectDriverFlatRateCollapsedTable));

    public getPayrollDriverFlatRateList(): void {
        this.store.dispatch(PayrollFlatRateActions.getPayrollFlatRateDriver());
    }

    public getPayrollFlatRateMileageExpandedList(driverId: number): void {
        this.store.dispatch(
            PayrollFlatRateActions.getPayrollFlatRateDriverExpandedList({
                driverId,
            })
        );
    }

    public getPayrollDriverFlatRateCollapsedList(): void {
        this.store.dispatch(
            PayrollFlatRateActions.getPayrollFlatRateDriverCollapsedList()
        );
    }

    public getPayrollDriverFlatRateReport({
        reportId,
        selectedLoadIds,
        selectedCreditIds,
        selectedDeductionIds,
    }: {
        reportId: string;
        selectedLoadIds?: number[];
        selectedCreditIds?: number[];
        selectedDeductionIds?: number[];
    }): void {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollState.payrollOpenedTab === 'closed') {
                    this.store.dispatch(
                        PayrollFlatRateActions.getPayrollFlatRateReportDriverClosedPayroll(
                            {
                                payrollId: +reportId,
                            }
                        )
                    );
                } else {
                    this.store.dispatch(
                        PayrollFlatRateActions.getPayrollFlatRateReportDriver({
                            reportId,
                            selectedLoadIds:
                                selectedLoadIds ?? payrollState.selectedLoadIds,
                            selectedCreditIds:
                                selectedCreditIds ??
                                payrollState.selectedCreditIds,
                            selectedDeductionIds:
                                selectedDeductionIds ??
                                payrollState.selectedDeductionIds,
                        })
                    );
                }
            });
    }
}
