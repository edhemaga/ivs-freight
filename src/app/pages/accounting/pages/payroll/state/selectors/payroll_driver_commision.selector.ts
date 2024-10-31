import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    MilesStopShortReponseWithRowType,
    PayrollState,
} from '../models/payroll.model';
import { CommissionLoadShortReponseWithRowType } from '../models/driver_commission.model';
import { PayrollLoadMinimalResponse } from 'appcoretruckassist';

export const selectPayrollState =
    createFeatureSelector<PayrollState>('payroll');

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
