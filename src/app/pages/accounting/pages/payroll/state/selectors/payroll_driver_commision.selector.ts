import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PayrollState } from '../models/payroll.model';

export const selectPayrollState =
    createFeatureSelector<PayrollState>('payroll');

export const selectCommissionListDriver = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollCommissionDriverList;
    }
);