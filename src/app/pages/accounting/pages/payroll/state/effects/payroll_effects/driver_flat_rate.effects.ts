import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Action } from '@ngrx/store';

// ACTIONS
import * as PayrollFlatRateDriverActions from '../../actions/payroll_flat_rate_driver.actions';

// SERVICES
import { PayrollService } from '../../../services/payroll.service';

export function getPayrollFlatRateDriverListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(PayrollFlatRateDriverActions.getPayrollFlatRateDriver),
                switchMap(() => {
                    return payrollService.getFlatRatePayrollDriverList().pipe(
                        map((data) => {
                            return PayrollFlatRateDriverActions.getPayrollFlatRateDriverSuccess(
                                {
                                    flatListPayrollList: data,
                                }
                            );
                        }),
                        catchError((error) =>
                            of(
                                PayrollFlatRateDriverActions.getPayrollFlatRateDriverError(
                                    {
                                        error,
                                    }
                                )
                            )
                        )
                    );
                })
            )
    );
}

export function getPayrollFlatRateReportEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollFlatRateDriverActions.getPayrollFlatRateReportDriver
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollFlatRateDriverReport({
                            reportId: action.reportId,
                            selectedCreditIds: action.selectedCreditIds,
                            selectedDeductionIds: action.selectedDeductionIds,
                            selectedLoadIds: action.selectedLoadIds,
                            selectedBonusIds: action.selectedBonusIds,
                        })
                        .pipe(
                            map((data) => {
                                return PayrollFlatRateDriverActions.getPayrollFlatRateReportDriverSuccess(
                                    {
                                        payroll: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollFlatRateDriverActions.getPayrollFlatRateReportDriverError(
                                        {
                                            error,
                                        }
                                    )
                                )
                            )
                        );
                })
            )
    );
}
