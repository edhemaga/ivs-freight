import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PayrollState } from '../models/payroll.model';
import { PayrollDriverMilesTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-driver-miles-table-settings.constants';
import { PayrollDriverCommisionTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-driver-commision-table-settings.constants';
import { PayrollOwnerTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-owner-table-settings.constants';
import {
    PayrollCountItemResponse,
    PayrollCountsResponse,
} from 'appcoretruckassist';

const payrollNamesData = {
    soloMiles: 'Driver (Miles)',
    soloFlatRate: 'Driver (Flat Rate)',
    soloCommission: 'Driver (Commission)',
    owner: 'Owner',
    teamCommission: 'Team Commission',
    teamFlatRate: 'Flat Rate',
    teamMiles: 'Team Miles',
};

export const selectPayrollState =
    createFeatureSelector<PayrollState>('payroll');

export const selectPayrollCounts = createSelector(
    selectPayrollState,
    (state) => {
        return {
            payrollCounts: state.payrollCounts,
            payrolls: Object.keys(state.payrollCounts),
            payrollData: Object.keys(state.payrollCounts).map((payroll) =>
                getPayrollTableItem(
                    payroll,
                    state.payrollCounts[payroll as keyof PayrollCountsResponse]
                )
            ),
        };
    }
);

export const selectSoloDriverMileage = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollDriverMileage;
    }
);

function getPayrollTableItem(
    payrollTitle: string,
    item?: PayrollCountItemResponse
) {
    return {
        title: payrollNamesData[payrollTitle],
        short_title: payrollNamesData[payrollTitle],
        //data: data[item].pagination.data,
        count: item?.count || 0,
        tableSettings: getTableDefinitions(payrollNamesData[payrollTitle]),
    };
}

function getTableDefinitions(title) {
    switch (title) {
        case 'Driver (Miles)':
            return PayrollDriverMilesTableSettingsConstants;
        case 'Driver (Commission)':
            return PayrollDriverCommisionTableSettingsConstants;
        case 'Owner':
            return PayrollOwnerTableSettingsConstants;
    }
}
