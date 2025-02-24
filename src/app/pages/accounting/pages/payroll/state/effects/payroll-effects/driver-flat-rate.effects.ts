import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Action } from '@ngrx/store';

// ACTIONS
import * as PayrollFlatRateDriverActions from '@pages/accounting/pages/payroll/state/actions';

// SERVICES
import { PayrollService } from '@pages/accounting/pages/payroll/services';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';

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
    payrollService: PayrollService,
    payrollFacadeService: PayrollFacadeService
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
                            tap((data) =>
                                payrollFacadeService.setPayrollMapData(
                                    data.payroll.mapLocations
                                )
                            ),
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

export function closePayrollFlatRateReportEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollFlatRateDriverActions.closePayrollFlatRateReportDriver
                ),
                switchMap((action) => {
                    return payrollService
                        .closePayrollFlatRateDriverReport(
                            action.amount,
                            action.reportId,
                            action.selectedLoadIds,
                            action.selectedBonusIds,
                            action.selectedDeductionIds,
                            action.selectedCreditIds,
                            action.paymentType,
                            action.otherPaymentType
                        )
                        .pipe(
                            map((data) => {
                                return PayrollFlatRateDriverActions.closePayrollFlatRateReportDriverSuccess();
                            }),
                            catchError((error) =>
                                of(
                                    PayrollFlatRateDriverActions.closePayrollFlatRateReportDriverError(
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

export function getPayrollFlatRateDriverCollapsedListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollFlatRateDriverActions.getPayrollFlatRateDriverCollapsedList
                ),
                switchMap(() => {
                    return payrollService
                        .getPayrollFlatRateDriverCollapsedList()
                        .pipe(
                            map((data) => {
                                return PayrollFlatRateDriverActions.getPayrollFlatRateDriverCollapsedListSuccess(
                                    {
                                        data: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollFlatRateDriverActions.getPayrollFlatRateDriverCollapsedListError(
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

export function getPayrollFlatRateDriverExpandedListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollFlatRateDriverActions.getPayrollFlatRateDriverExpandedList
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollFlatRateDriverExpandedList(action.driverId)
                        .pipe(
                            map((data) => {
                                return PayrollFlatRateDriverActions.getPayrollFlatRateDriverExpandedListSuccess(
                                    {
                                        data: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollFlatRateDriverActions.getPayrollFlatRateDriverExpandedListError(
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

export function getPayrollFlatRateClosedPayrollReportByIdEffect(
    actions$: Actions,
    payrollService: PayrollService,
    payrollFacadeService: PayrollFacadeService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollFlatRateDriverActions.getPayrollFlatRateReportDriverClosedPayroll
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollFlatRateDriverClosedReportById(
                            action.payrollId
                        )
                        .pipe(
                            map((data) => {
                                return PayrollFlatRateDriverActions.getPayrollFlatRateReportDriverClosedPayrollSuccess(
                                    {
                                        payroll: data,
                                    }
                                );
                            }),
                            tap((data) =>
                                payrollFacadeService.setPayrollMapData(
                                    data.payroll.mapLocations
                                )
                            ),
                            catchError((error) =>
                                of(
                                    PayrollFlatRateDriverActions.getPayrollFlatRateReportDriverClosedPayrollError(
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

export function addPayrollFlatRateClosedPayrollPaymentEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollFlatRateDriverActions.driverFlatRatePayrollClosedPayments
                ),
                switchMap((action) => {
                    return payrollService
                        .addPayrollClosedReportPayment(action)
                        .pipe(
                            map((data) => {
                                return PayrollFlatRateDriverActions.driverFlatRatePayrollClosedPaymentsSuccess();
                            }),
                            catchError((error) =>
                                of(
                                    PayrollFlatRateDriverActions.driverFlatRatePayrollClosedPaymentsError(
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
