import { createSelector } from '@ngrx/store';
import { selectPayrollState } from './payroll.selector';

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

export const selectDriverFlatRateExpandedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverFlatRateExpandedList;
    }
);

export const selectDriverFlatRateCollapsedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverFlatRateCollapsedList;
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
