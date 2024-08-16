import { createReducer, on } from '@ngrx/store';
import { PayrollState } from '../payroll.store';
import * as PayrollActions from '../actions/payroll.actions';

export const payrollState: PayrollState = {};

export const payrollReducer = createReducer(
    payrollState,
    on(PayrollActions.getPayrollCounts, (state) => ({
        ...state,
        loading: true,
    })),
    on(PayrollActions.getPayrollCountsSuccess, (state, results) => ({
        ...state,
        payrollCounts: results.payrollCounts,
    }))
);
