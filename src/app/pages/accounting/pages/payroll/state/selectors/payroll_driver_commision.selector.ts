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
        // let allInculdedLoads: PayrollLoadMinimalResponse[] = [];
        // included_only.map(
        //     (loads) =>
        //         (allInculdedLoads = [...allInculdedLoads, ...loads.milesStops])
        // );
        return included_only;
    }
);

export const selectPayrollDriverCommissionLoads = createSelector(
    selectPayrollState,
    (state) => {
        if (!state.payrollOpenedReport) return [];
        const includedLoads = state.payrollOpenedReport?.includedLoads ?? [];
        // const includedLoads = state.payrollOpenedReport?.includedLoads.reduce(
        //     (load, old) => {
        //         const firstStop = old.isStartPoint;
        //         const nextMilesStop = JSON.parse(
        //             JSON.stringify(old.milesStops)
        //         );
        //         if (firstStop) {
        //             nextMilesStop[0].loadId = -1;
        //         }
        //         return [...load, ...nextMilesStop];
        //     },
        //     [] as CommissionLoadShortReponseWithRowType[]
        // );

        const excludedReportLoads =
            state.payrollOpenedReport?.excludedLoads ?? [];

        const excludedLoads = excludedReportLoads;
        // const excludedLoads = excludedReportLoads.reduce((load, old) => {
        //     return [...load, ...old.milesStops];
        // }, [] as CommissionLoadShortReponseWithRowType[]);

        const reorderRow = {
            rowType: 'reorder',
        };

        return [...includedLoads, reorderRow, ...excludedLoads];
    }
);
