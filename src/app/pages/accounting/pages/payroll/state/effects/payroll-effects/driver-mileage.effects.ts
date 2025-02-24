import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { map, switchMap, Observable, catchError, of, tap } from 'rxjs';

// Services
import { PayrollService } from '@pages/accounting/pages/payroll/services';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';

// Actions
import * as PayrollSoloMileageDriver from '@pages/accounting/pages/payroll/state/actions';

export function getPayrollMileageClosedPayrollByIdEffect(
    actions$: Actions,
    payrollService: PayrollService,
    payrollFacadeService: PayrollFacadeService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollSoloMileageDriver.getPayrollMileageDriverClosedPayroll
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollSoloMileageDriverClosedById(action.payrollId)
                        .pipe(
                            map((data) => {
                                return PayrollSoloMileageDriver.getPayrollMileageDriverClosedPayrollSuccess(
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
                                    PayrollSoloMileageDriver.getPayrollMileageDriverClosedPayrollError(
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

export function getPayrollMileageDriverExpandedListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollSoloMileageDriver.getPayrollMileageDriverExpandedList
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollSoloMileageDriverExpandedList(
                            action.driverId
                        )
                        .pipe(
                            map((data) => {
                                return PayrollSoloMileageDriver.getPayrollMileageDriverExpandedListSuccess(
                                    {
                                        data: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollSoloMileageDriver.getPayrollMileageDriverExpandedListError(
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

export function getPayrollMileageDriverCollapsedListEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedList
                ),
                switchMap(() => {
                    return payrollService
                        .getPayrollSoloMileageDriverCollapsedList()
                        .pipe(
                            map((data) => {
                                return PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedListSuccess(
                                    {
                                        data: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedListError(
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

export function getPayrollSoloMileageEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(PayrollSoloMileageDriver.getPayrollSoloMileageDriver),
                switchMap((action) => {
                    return payrollService.getPayrollSoloMileageDriver().pipe(
                        map((data) => {
                            return PayrollSoloMileageDriver.getPayrollSoloMileageDriverSuccess(
                                {
                                    payroll: data,
                                }
                            );
                        }),
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

export function closePayrollSoloMileageReportEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollSoloMileageDriver.closePayrollSoloMileageReportDriver
                ),
                switchMap((action) => {
                    return payrollService
                        .closePayrollSoloMileageDriverReport(
                            action.amount,
                            action.reportId,
                            action.lastLoadDate,
                            action.selectedCreditIds,
                            action.selectedDeductionIds,
                            action.selectedBonusIds,
                            action.paymentType,
                            action.otherPaymentType
                        )
                        .pipe(
                            map((data) => {
                                return PayrollSoloMileageDriver.closePayrollSoloMileageReportDriverSuccess(
                                    {
                                        payroll: data,
                                    }
                                );
                            }),
                            catchError((error) =>
                                of(
                                    PayrollSoloMileageDriver.closePayrollSoloMileageReportDriverError(
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

export function getPayrollSoloMileageReportEffect(
    actions$: Actions,
    payrollService: PayrollService,
    payrollFacadeService: PayrollFacadeService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollSoloMileageDriver.getPayrollSoloMileageReportDriver
                ),
                switchMap((action) => {
                    return payrollService
                        .getPayrollSoloMileageDriverReport(
                            action.reportId,
                            action.lastLoadDate,
                            action.selectedCreditIds,
                            action.selectedDeductionIds
                        )
                        .pipe(
                            map((data) => {
                                return PayrollSoloMileageDriver.getPayrollSoloMileageReportDriverSuccess(
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
}

export function addPayrollMileageClosedPayrollPaymentEffect(
    actions$: Actions,
    payrollService: PayrollService
) {
    return createEffect(
        (): Observable<Action> =>
            actions$.pipe(
                ofType(
                    PayrollSoloMileageDriver.driverMileagePayrollClosedPayments
                ),
                switchMap((action) => {
                    return payrollService
                        .addPayrollClosedReportPayment(action)
                        .pipe(
                            map((_) => {
                                return PayrollSoloMileageDriver.driverMileagePayrollClosedPaymentsSuccess();
                            }),
                            catchError((error) =>
                                of(
                                    PayrollSoloMileageDriver.driverMileagePayrollClosedPaymentsError(
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
