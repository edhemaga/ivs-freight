import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PayrollState } from '@pages/accounting/pages/payroll/state/models';
import { selectPayrollState } from './payroll.selector';

export const selectCommissionListDriver = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollCommissionDriverList;
    }
);

export const selectPayrollReportsIncludedCommissionStops = createSelector(
    selectPayrollState,
    (state) => {
        const included_only = state.payrollOpenedReport?.includedLoads || [];
        return included_only;
    }
);

export const selectDriverCommissionExpandedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverCommissionExpandedList;
    }
);

export const selectDriverCommissionCollapsedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverCommissionCollapsedList;
    }
);

export const selectPayrollDriverCommissionLoads = createSelector(
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
