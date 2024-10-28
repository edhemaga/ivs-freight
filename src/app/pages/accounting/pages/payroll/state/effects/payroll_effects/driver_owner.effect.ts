import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Action } from '@ngrx/store';

// ACTIONS
import * as PayrollOwnerDriverActions from '../../actions/payroll_owner_driver.action';

// SERVICES
import { PayrollService } from '../../../services/payroll.service';

export function getPayrollOwnerDriverListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(PayrollOwnerDriverActions.getPayrollOwnerDriverList),
                switchMap((action) => {
                    return payrollService.getPayrollOwnerDriverList().pipe(
                        map((data) => {
                            return PayrollOwnerDriverActions.getPayrollOwnerDriverListSuccess(
                                {
                                    ownerPayrollList: data,
                                }
                            );
                        }),
                        catchError((error) =>
                            of(
                                PayrollOwnerDriverActions.getPayrollOwnerDriverListError(
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
