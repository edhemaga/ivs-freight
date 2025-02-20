import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

// Actions
import * as PayrollActions from '@pages/accounting/pages/payroll/state/actions';

// Services
import { PayrollService } from '@pages/accounting/pages/payroll/services';

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

export function getPayrollMapDataEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(PayrollActions.getPayrollMapData),
                switchMap((action) => {
                    return payrollService
                        .getPayrollMapData(action.locations)
                        .pipe(
                            map((data) => {
                                return PayrollActions.getPayrollMapDataSuccess({
                                    mapData: data,
                                });
                            }),
                            catchError((error) =>
                                of(
                                    PayrollActions.getPayrollMapDataError({
                                        error,
                                    })
                                )
                            )
                        );
                })
            )
    );
}
