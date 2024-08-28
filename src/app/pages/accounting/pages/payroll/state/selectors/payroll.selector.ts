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
    soloMiles: { text: 'Driver', type: 'Miles' },
    soloFlatRate: { text: 'Driver', type: 'Flat Rate' },
    soloCommission: { text: 'Driver', type: 'Commission' },
    owner: { text: 'Owner', type: '' },
    teamCommission: { text: 'Team Commission', type: '' },
    teamFlatRate: { text: 'Flat Rate', type: '' },
    teamMiles: { text: 'Team Miles', type: '' },
};

const payrollStatus = {
    Paid: 'success',
    Debt: 'danger',
};

export const selectPayrollState =
    createFeatureSelector<PayrollState>('payroll');

export const selectPayrollCount = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollCounts;
    }
);

export const selectPayrollOpenedReport = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollOpenedReport;
    }
);

export const seletPayrollTabsCount = createSelector(
    selectPayrollCount,
    (payrollCounts) => {
        return {
            open: payrollCounts.opentPayrollCount,
            closed: payrollCounts.closedPayrollCount,
        };
    }
);

export const selectPayrollCounts = createSelector(
    selectPayrollCount,
    (payrollCounts) => {
        const payrollCountsData = Object.keys(payrollCounts).filter(
            (item) => payrollCounts[item]
        );
        return {
            payrollCounts: payrollCounts,
            payrolls: payrollCountsData,
            payrollData: payrollCountsData
                .filter(
                    (item) =>
                        !['opentPayrollCount', 'closedPayrollCount'].includes(
                            item
                        )
                )
                .map((payroll) =>
                    getPayrollTableItem(
                        payroll,
                        payrollCounts[
                            payroll as keyof PayrollCountsResponse
                        ] as PayrollCountItemResponse
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
        text: payrollNamesData[payrollTitle].text,
        type: payrollNamesData[payrollTitle].type,
        //data: data[item].pagination.data,
        itemCount: item?.valueCount || 0,
        money: item?.value,
        date: item.date,
        status: getStatus(item?.status.name),
        tableSettings: getTableDefinitions(payrollNamesData[payrollTitle]),
    };
}

function getStatus(item) {
    return payrollStatus[item] || '';
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
