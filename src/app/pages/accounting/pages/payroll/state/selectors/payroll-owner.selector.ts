import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PayrollState } from '@pages/accounting/pages/payroll/state/models';
import { selectPayrollState } from './payroll.selector';

export const selectOwnerListDriver = createSelector(
    selectPayrollState,
    (state) => {
        return state.ownerPayrollList;
    }
);

export const selectDriverOwnerExpandedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverOwnerExpandedList;
    }
);

export const selectDriverOwnerCollapsedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverOwnerCollapsedList;
    }
);

export const selectPayrollOwnerOpenedReport = createSelector(
    selectPayrollState,
    (state) => {
        return {
            ...state.ownerPayrollResponse,
            fullName: `${state.ownerPayrollResponse?.truck?.truckNumber} - ${state.ownerPayrollResponse?.owner.name}`,
        };
    }
);

export const selectPayrollDriverOwnerLoads = createSelector(
    selectPayrollState,
    (state) => {
        if (!state.ownerPayrollResponse) return [];
        const includedLoads = state.ownerPayrollResponse?.includedLoads ?? [];
        const excludedReportLoads =
            state.ownerPayrollResponse?.excludedLoads ?? [];

        const excludedLoads = excludedReportLoads;
        const reorderRow = {
            rowType: 'reorder',
        };

        return [...includedLoads, reorderRow, ...excludedLoads];
    }
);

export const selectPayrollReportsIncludedOwnerStops = createSelector(
    selectPayrollState,
    (state) => {
        const included_only = state.ownerPayrollResponse?.includedLoads || [];
        return included_only;
    }
);
