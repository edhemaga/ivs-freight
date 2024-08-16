import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import * as PayrollActions from '../actions/payroll.actions';
import { PayrollService } from '../../services/payroll.service';

@Injectable()
export class PaymentEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private payrollService: PayrollService
    ) {}

    public getPayrollCounts$ = createEffect(
        (): Observable<Action> =>
            this.actions$.pipe(
                ofType(PayrollActions.getPayrollCounts),
                switchMap((action) => {
                    return this.payrollService
                        .getPayrollCounts(action.ShowOpen)
                        .pipe(
                            map((data) => {
                                return PayrollActions.getPayrollCountsSuccess({
                                    payrollCounts: data,
                                });
                            }),
                            // tap((data) => {
                            //     // this.store.dispatch(
                            //     //   PaymentActions.restartRefreshDataSuccess({ flag: false })
                            //     // );
                            // }),
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
