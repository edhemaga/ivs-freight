import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Action, Store } from '@ngrx/store';

// ACTIONS
import * as PayrollCommissionDriverActions from '@pages/accounting/pages/payroll/state/actions';

// SERVICES
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

export function getPayrollCommissionDriverListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollCommissionDriverActions.getPayrollCommissionDriver
                ),
                switchMap((action) => {
                    return payrollService.getPayrollCommissionDriverList().pipe(
                        map((data) => {
                            return PayrollCommissionDriverActions.getPayrollCommissionDriverSuccess(
                                {
                                    commissionPayrollList: data,
                                }
                            );
                        }),
                        catchError((error) =>
                            of(
                                PayrollCommissionDriverActions.getPayrollCommissionDriverError(
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

export function getPayrollCommissionReportEffect(
    actions$: Actions,
    payrollService: PayrollService,
    store: Store
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollCommissionDriverActions.getPayrollCommissionReportDriver
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollCommissionDriverReport({
                            reportId: action.reportId,
                            selectedCreditIds: action.selectedCreditIds,
                            selectedDeductionIds: action.selectedDeductionIds,
                            selectedLoadIds: action.selectedLoadIds,
                        })
                        .pipe(
                            map((data) => {
                                return PayrollCommissionDriverActions.getPayrollCommissionReportDriverSuccess(
                                    {
                                        payroll: data,
                                    }
                                );
                            }),
                            tap((data) => {
                                const mapLocations = JSON.stringify(
                                    data.payroll.mapLocations.map((item) => {
                                        return {
                                            longitude: item.longitude,
                                            latitude: item.latitude,
                                        };
                                    })
                                );

                                store.dispatch(
                                    PayrollCommissionDriverActions.getPayrollMapData(
                                        {
                                            locations: mapLocations,
                                        }
                                    )
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollCommissionDriverActions.getPayrollCommissionReportDriverError(
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

export function closePayrollCommissionReportEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollCommissionDriverActions.closePayrollCommissionReportDriver
                ),
                switchMap((action) => {
                    return payrollService
                        .closePayrollCommissionDriverReport(
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
                                return PayrollCommissionDriverActions.closePayrollCommissionReportDriverSuccess();
                            }),
                            catchError((error) =>
                                of(
                                    PayrollCommissionDriverActions.closePayrollCommissionReportDriverError(
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

export function getPayrollCommissionDriverCollapsedListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollCommissionDriverActions.getPayrollCommissionDriverCollapsedList
                ),
                switchMap(() => {
                    return payrollService
                        .getPayrollCommissionDriverCollapsedList()
                        .pipe(
                            map((data) => {
                                return PayrollCommissionDriverActions.getPayrollCommissionDriverCollapsedListSuccess(
                                    {
                                        data: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollCommissionDriverActions.getPayrollCommissionDriverCollapsedListError(
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

export function getPayrollCommissionDriverExpandedListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollCommissionDriverActions.getPayrollCommissionDriverExpandedList
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollCommissionDriverExpandedList(action.driverId)
                        .pipe(
                            map((data) => {
                                return PayrollCommissionDriverActions.getPayrollCommissionDriverExpandedListSuccess(
                                    {
                                        data: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollCommissionDriverActions.getPayrollCommissionDriverExpandedListError(
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

export function getPayrollCommissionClosedPayrollReportByIdEffect(
    actions$: Actions,
    payrollService: PayrollService,
    store: Store
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollCommissionDriverActions.getPayrollCommissionReportDriverClosedPayroll
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollCommissionDriverClosedReportById(
                            action.payrollId
                        )
                        .pipe(
                            map((data) => {
                                return PayrollCommissionDriverActions.getPayrollCommissionReportDriverClosedPayrollSuccess(
                                    {
                                        payroll: data,
                                    }
                                );
                            }),
                            tap((data) => {
                                const mapLocations = JSON.stringify(
                                    data.payroll.mapLocations.map((item) => {
                                        return {
                                            longitude: item.longitude,
                                            latitude: item.latitude,
                                        };
                                    })
                                );

                                store.dispatch(
                                    PayrollCommissionDriverActions.getPayrollMapData(
                                        {
                                            locations: mapLocations,
                                        }
                                    )
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollCommissionDriverActions.getPayrollCommissionReportDriverClosedPayrollError(
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

export function addPayrollCommissionClosedPayrollPaymentEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollCommissionDriverActions.driverCommissionPayrollClosedPayments
                ),
                switchMap((action) => {
                    return payrollService
                        .addPayrollClosedReportPayment(action)
                        .pipe(
                            map((_) => {
                                return PayrollCommissionDriverActions.driverCommissionPayrollClosedPaymentsSuccess();
                            }),
                            catchError((error) =>
                                of(
                                    PayrollCommissionDriverActions.driverCommissionPayrollClosedPaymentsError(
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
