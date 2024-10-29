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
