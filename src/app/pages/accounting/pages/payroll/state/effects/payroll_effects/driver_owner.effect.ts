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
