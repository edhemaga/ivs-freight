import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Action } from '@ngrx/store';

// ACTIONS
import * as PayrollCommissionDriverActions from '../../actions/payroll_commission_driver.actions';

// SERVICES
import { PayrollService } from '../../../services/payroll.service';

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

export function getPayrollSoloMileageReportEffect(
    actions$: Actions,
    payrollService: PayrollService
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
                                return PayrollCommissionDriverActions
                                    .closePayrollCommissionReportDriverSuccess
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
