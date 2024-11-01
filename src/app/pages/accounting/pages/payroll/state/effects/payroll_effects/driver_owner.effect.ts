import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
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

export function getPayrollOwnerReportEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(PayrollOwnerDriverActions.getPayrollOwnerReportDriver),
                switchMap((action) => {
                    return payrollService
                        .getPayrollOwnerDriverReport({
                            reportId: action.reportId,
                            selectedCreditIds: action.selectedCreditIds,
                            selectedDeductionIds: action.selectedDeductionIds,
                            selectedLoadIds: action.selectedLoadIds,
                            selectedFuelIds: action.selectedFuelIds,
                        })
                        .pipe(
                            map((data) => {
                                return PayrollOwnerDriverActions.getPayrollOwnerReportDriverSuccess(
                                    {
                                        ownerPayrollReport: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollOwnerDriverActions.getPayrollOwnerReportDriverError(
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

export function closePayrollOwnerReportEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(PayrollOwnerDriverActions.closePayrollOwnerReportDriver),
                switchMap((action) => {
                    return payrollService
                        .closePayrollOwnerDriverReport(
                            action.amount,
                            action.reportId,
                            action.selectedLoadIds,
                            action.selectedDeductionIds,
                            action.selectedCreditIds,
                            action.paymentType,
                            action.otherPaymentType
                        )
                        .pipe(
                            map((data) => {
                                return PayrollOwnerDriverActions
                                    .closePayrollOwnerReportDriverSuccess
                                    // {
                                    //     payroll: data,
                                    // }
                                    ();
                            }),
                            tap((data) => {
                                // this.store.dispatch(
                                //   PaymentActions.restartRefreshDataSuccess({ flag: false })
                                // );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollOwnerDriverActions.closePayrollOwnerReportDriverError(
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

export function getPayrollOwnerDriverCollapsedListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollOwnerDriverActions.getPayrollOwnerDriverCollapsedList
                ),
                switchMap(() => {
                    return payrollService
                        .getPayrollOwnerDriverCollapsedList()
                        .pipe(
                            map((data) => {
                                return PayrollOwnerDriverActions.getPayrollOwnerDriverCollapsedListSuccess(
                                    {
                                        data: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollOwnerDriverActions.getPayrollOwnerDriverCollapsedListError(
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

export function getPayrollOwnerDriverExpandedListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollOwnerDriverActions.getPayrollOwnerDriverExpandedList
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollOwnerDriverExpandedList(action.trailerId)
                        .pipe(
                            map((data) => {
                                return PayrollOwnerDriverActions.getPayrollOwnerDriverExpandedListSuccess(
                                    {
                                        data: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollOwnerDriverActions.getPayrollOwnerDriverExpandedListError(
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

export function getPayrollOwnerClosedPayrollReportByIdEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollOwnerDriverActions.getPayrollOwnerDriverClosedReportPayroll
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollOwnerDriverClosedReportById(action.payrollId)
                        .pipe(
                            map((data) => {
                                return PayrollOwnerDriverActions.getPayrollOwnerDriverClosedReportPayrollSuccess(
                                    {
                                        payroll: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollOwnerDriverActions.getPayrollOwnerDriverClosedReportPayrollError(
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

export function addPayrollOwnerClosedPayrollPaymentEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollOwnerDriverActions.driverOwnerPayrollClosedPayments
                ),
                switchMap((action) => {
                    return payrollService
                        .addPayrollClosedReportPayment(action)
                        .pipe(
                            map((data) => {
                                return PayrollOwnerDriverActions.driverOwnerPayrollClosedPaymentsSuccess();
                            }),
                            // tap((data) => {
                            //     // this.store.dispatch(
                            //     //   PaymentActions.restartRefreshDataSuccess({ flag: false })
                            //     // );
                            // }),
                            catchError((error) =>
                                of(
                                    PayrollOwnerDriverActions.driverOwnerPayrollClosedPaymentsError(
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
