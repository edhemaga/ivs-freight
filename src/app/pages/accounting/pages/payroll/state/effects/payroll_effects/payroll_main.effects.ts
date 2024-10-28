import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

// Actions
import * as PayrollActions from '../../actions/payroll.actions';

// Services
import { PayrollService } from '../../../services/payroll.service';

export function getPayrollCountsEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(PayrollActions.getPayrollCounts),
                switchMap((action) => {
                    return payrollService
                        .getPayrollCounts(action.ShowOpen)
                        .pipe(
                            map((data) => {
                                return PayrollActions.getPayrollCountsSuccess({
                                    payrollCounts: data,
                                });
                            }),
                            catchError((error) =>
                                of(
                                    PayrollActions.getPayrollCountsError({
                                        error,
                                    })
                                )
                            )
                        );
                })
            )
    );
}
