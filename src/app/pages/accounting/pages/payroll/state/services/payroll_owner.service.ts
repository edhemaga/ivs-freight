import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

// Actions
import * as PayrollOwnerActions from '@pages/accounting/pages/payroll/state/actions';

// Selectors
import {
    selectDriverOwnerCollapsedTable,
    selectDriverOwnerExpandedTable,
    selectOwnerListDriver,
    selectPayrollDriverOwnerLoads,
    selectPayrollOwnerOpenedReport,
    selectPayrollReportsIncludedOwnerStops,
} from '@pages/accounting/pages/payroll/state/selectors';

// Models
import {
    IDriverOwnerList,
    OwnerLoadShortReponseWithRowType,
} from '@pages/accounting/pages/payroll/state/models';
import { selectPayrollState } from '@pages/accounting/pages/payroll/state/selectors';
import {
    LoadWithMilesStopResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageExpandedListResponse } from '@pages/accounting/pages/payroll/state/models';

@Injectable({
    providedIn: 'root',
})
export class PayrollDriverOwnerFacadeService {
    constructor(private store: Store) {}

    public selectOwnerDriverList$: Observable<IDriverOwnerList> =
        this.store.pipe(select(selectOwnerListDriver));

    public getPayrollDriverOwnerList() {
        this.store.dispatch(PayrollOwnerActions.getPayrollOwnerDriverList());
    }

    public selectPayrollOwnerOpenedReport$: Observable<any> = this.store.pipe(
        select(selectPayrollOwnerOpenedReport)
    );

    public selectPayrollDriverOwnerExpanded$: Observable<
        PayrollDriverMileageExpandedListResponse[]
    > = this.store.pipe(select(selectDriverOwnerExpandedTable));

    public selectPayrollDriverOwnerCollapsed$: Observable<
        PayrollDriverMileageListResponse[]
    > = this.store.pipe(select(selectDriverOwnerCollapsedTable));

    public getPayrollOwnerMileageExpandedList(trailerId: number): void {
        this.store.dispatch(
            PayrollOwnerActions.getPayrollOwnerDriverExpandedList({
                trailerId,
            })
        );
    }

    public getPayrollDriverOwnerCollapsedList(): void {
        this.store.dispatch(
            PayrollOwnerActions.getPayrollOwnerDriverCollapsedList()
        );
    }

    public selectPayrollReportDriverCommissionLoads$: Observable<
        OwnerLoadShortReponseWithRowType[]
    > = this.store.pipe(select(selectPayrollDriverOwnerLoads));

    public selectPayrollReportOwnerIncludedLoads$: Observable<
        LoadWithMilesStopResponse[]
    > = this.store.pipe(select(selectPayrollReportsIncludedOwnerStops));

    public getPayrollDriverOwnerReport({
        reportId,
        selectedLoadIds,
        selectedCreditIds,
        selectedDeductionIds,
        selectedFuelIds,
    }: {
        reportId: string;
        selectedLoadIds?: number[];
        selectedCreditIds?: number[];
        selectedDeductionIds?: number[];
        selectedFuelIds?: number[];
    }): void {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollState.payrollOpenedTab === 'closed') {
                    this.store.dispatch(
                        PayrollOwnerActions.getPayrollOwnerDriverClosedReportPayroll(
                            {
                                payrollId: +reportId,
                            }
                        )
                    );
                } else {
                    this.store.dispatch(
                        PayrollOwnerActions.getPayrollOwnerReportDriver({
                            reportId: reportId,
                            selectedLoadIds:
                                selectedLoadIds ?? payrollState.selectedLoadIds,
                            selectedCreditIds:
                                selectedCreditIds ??
                                payrollState.selectedCreditIds,
                            selectedDeductionIds:
                                selectedDeductionIds ??
                                payrollState.selectedDeductionIds,
                            selectedFuelIds:
                                selectedFuelIds ?? payrollState.selectedFuelIds,
                        })
                    );
                }
            });
    }
}
