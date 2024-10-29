import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PayrollState } from '../models/payroll.model';

export const selectPayrollState =
    createFeatureSelector<PayrollState>('payroll');

export const selectFlatRateListDriver = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverFlatRateList;
    }
);