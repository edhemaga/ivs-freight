import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

// Actions
import * as PayrollFlatRateActions from '../actions/payroll_flat_rate_driver.actions';

// Selectors
import {
    selectFlatRateListDriver,
    selectPayrollDriverFlatRateLoads,
    selectPayrollReportsIncludedFlatRateStops,
} from '../selectors/payroll_driver_flat_rate.selector';

// Models
import {
    FlatRateLoadShortReponseWithRowType,
    IDriverFlatRateList,
} from '../models/driver_flat_rate.model';
import {
    selectPayrollOpenedReport,
    selectPayrollState,
} from '../selectors/payroll.selector';
import {
    LoadWithMilesStopResponse,
    PayrollDriverCommissionByIdResponse,
} from 'appcoretruckassist';

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

    public getPayrollDriverFlatRateList() {
        this.store.dispatch(PayrollFlatRateActions.getPayrollFlatRateDriver());
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
    }) {
        this.store
            .pipe(select(selectPayrollState), take(1))
            .subscribe((payrollState) => {
                if (payrollState.payrollOpenedTab === 'closed') {
                    // this.store.dispatch(
                    //     PayrollFlatRateActions.getPayrollFlatRateReportDriver(
                    //         {
                    //             payrollId: +reportId,
                    //         }
                    //     )
                    // );
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
