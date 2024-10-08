import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import * as PayrollActions from '../actions/payroll.actions';
import * as PayrollSoloMileageDriver from '../actions/payroll_solo_mileage_driver.actions';
import { PayrollService } from '../../services/payroll.service';

@Injectable()
export class PayrollEffect {
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

    //getPayrollSoloMileageDriverReport

    public getPayrollSoloMileageReport$ = createEffect(
        (): Observable<Action> =>
            this.actions$.pipe(
                ofType(
                    PayrollSoloMileageDriver.getPayrollSoloMileageReportDriver
                ),
                switchMap((action) => {
                    return this.payrollService
                        .getPayrollSoloMileageDriverReport(
                            action.reportId,
                            action.lastLoadDate,
                            action.selectedCreditIds,
                            action.selectedDeducionIds,
                            action.selectedBonusIds
                        )
                        .pipe(
                            map((data) => {
                                return PayrollSoloMileageDriver.getPayrollSoloMileageReportDriverSuccess(
                                    {
                                        payroll: data,
                                    }
                                );
                            }),
                            // tap((data) => {
                            //     // this.store.dispatch(
                            //     //   PaymentActions.restartRefreshDataSuccess({ flag: false })
                            //     // );
                            // }),
                            catchError((error) =>
                                of(
                                    PayrollSoloMileageDriver.getPayrollSoloMileageReportDriverError(
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

    public getPayrollSoloMileage$ = createEffect(
        (): Observable<Action> =>
            this.actions$.pipe(
                ofType(PayrollSoloMileageDriver.getPayrollSoloMileageDriver),
                switchMap((action) => {
                    return this.payrollService
                        .getPayrollSoloMileageDriver()
                        .pipe(
                            map((data) => {
                                return PayrollSoloMileageDriver.getPayrollSoloMileageDriverSuccess(
                                    {
                                        payroll: data,
                                    }
                                );
                            }),
                            // tap((data) => {
                            //     // this.store.dispatch(
                            //     //   PaymentActions.restartRefreshDataSuccess({ flag: false })
                            //     // );
                            // }),
                            catchError((error) =>
                                of(
                                    PayrollSoloMileageDriver.getPayrollSoloMileageDriverError(
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
