import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

// Actions
import * as PayrollFlatRateActions from '../actions/payroll_flat_rate_driver.actions';

// Selectors
import { selectFlatRateListDriver } from '../selectors/payroll_driver_flat_rate.selector';

// Models
import { IDriverFlatRateList } from '../models/driver_flat_rate.model';
import { selectPayrollState } from '../selectors/payroll.selector';

@Injectable({
    providedIn: 'root',
})
export class PayrollDriverFlatRateFacadeService {
    constructor(private store: Store) {}

    public selectFlatListDriverList$: Observable<IDriverFlatRateList> =
        this.store.pipe(select(selectFlatRateListDriver));

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
