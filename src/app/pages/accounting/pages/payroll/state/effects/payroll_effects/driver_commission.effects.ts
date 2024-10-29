import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Action } from '@ngrx/store';

// ACTIONS
import * as PayrollCommissionDriverActions from '../../actions/payroll_commission_driver.actions';

// SERVICES
import { PayrollService } from '../../../services/payroll.service';
import { getPayrollCommissionReportDriverError } from '../../actions/payroll_commission_driver.actions';

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
                        .getPayrollCommissionDriverReport(
                            action.reportId,
                            action.lastLoadDate,
                            action.selectedCreditIds,
                            action.selectedDeducionIds,
                            action.selectedBonusIds
                        )
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
