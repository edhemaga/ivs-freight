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

export const selectPayrollReportsIncludedFlatRateStops = createSelector(
    selectPayrollState,
    (state) => {
        const included_only = state.payrollOpenedReport?.includedLoads || [];
        return included_only;
    }
);

export const selectPayrollDriverFlatRateLoads = createSelector(
    selectPayrollState,
    (state) => {
        if (!state.payrollOpenedReport) return [];
        const includedLoads = state.payrollOpenedReport?.includedLoads ?? [];

        const excludedReportLoads =
            state.payrollOpenedReport?.excludedLoads ?? [];

        const excludedLoads = excludedReportLoads;
        const reorderRow = {
            rowType: 'reorder',
        };

        return [...includedLoads, reorderRow, ...excludedLoads];
    }
);
