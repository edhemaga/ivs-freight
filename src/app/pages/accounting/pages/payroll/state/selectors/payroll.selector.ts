import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    MilesStopShortReponseWithRowType,
    PayrollState,
} from '../models/payroll.model';
import { PayrollDriverMilesTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-driver-miles-table-settings.constants';
import { PayrollDriverCommisionTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-driver-commision-table-settings.constants';
import { PayrollOwnerTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-owner-table-settings.constants';
import {
    MilesStopShortResponse,
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

export const selectPayrollLoad = createSelector(selectPayrollState, (state) => {
    return state.loading;
});

export const selectPayrollReportLoading = createSelector(
    selectPayrollState,
    (state) => {
        return state.reportLoading;
    }
);

export const selectPayrollReportTableExpanded = createSelector(
    selectPayrollState,
    (state) => state.expandedReportTable
);

export const selectPayrollOpenedReport = createSelector(
    selectPayrollState,
    (state) => {
        return {
            ...state.payrollOpenedReport,
            fullName: state.payrollOpenedReport?.driver?.fullName,
            userId: state.payrollOpenedReport?.driver?.id,
            avatar: state.payrollOpenedReport?.driver?.avatarFile,
        };
    }
);

export const selectPayrollReportsIncludedStops = createSelector(
    selectPayrollState,
    (state) => {
        const included_only = state.payrollOpenedReport?.includedLoads || [];
        let allInculdedLoads: MilesStopShortResponse[] = [];
        included_only.map(
            (loads) =>
                (allInculdedLoads = [...allInculdedLoads, ...loads.milesStops])
        );
        return allInculdedLoads;
    }
);

export const selectPayrollDriverMileageStops = createSelector(
    selectPayrollState,
    (state) => {
        if (!state.payrollOpenedReport) return [];
        const includedLoads = state.payrollOpenedReport?.includedLoads.reduce(
            (load, old) => {
                const firstStop = old.isStartPoint;
                const nextMilesStop = JSON.parse(
                    JSON.stringify(old.milesStops)
                );
                if (firstStop) {
                    nextMilesStop[0].loadId = -1;
                }
                return [...load, ...nextMilesStop];
            },
            [] as MilesStopShortReponseWithRowType[]
        );

        const excludedReportLoads =
            state.payrollOpenedReport?.excludedLoads ?? [];

        const excludedLoads = excludedReportLoads.reduce((load, old) => {
            return [...load, ...old.milesStops];
        }, [] as MilesStopShortReponseWithRowType[]);

        const reorderRow = {
            rowType: 'reorder',
        };

        return [...includedLoads, reorderRow, ...excludedLoads];
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

export const selectClosingReportStatus = createSelector(
    selectPayrollState,
    (state) => {
        return {
            loading: state.closeReportPaymentLoading,
            error: state.closeReportPaymentError,
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

export const selectPayrollOpenedTab = createSelector(
    selectPayrollState,
    (state) => {
        return state.payrollOpenedTab;
    }
);

export const selectDriverMileageCollapsedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverMileageCollapsedList;
    }
);

export const selectDriverMileageExpandedTable = createSelector(
    selectPayrollState,
    (state) => {
        return state.driverMileageExpandedList;
    }
);

function getPayrollTableItem(
    payrollTitle: string,
    item?: PayrollCountItemResponse
) {
    return {
        text: payrollNamesData[payrollTitle].text,
        type: payrollNamesData[payrollTitle].type,
        itemCount: item?.totalCount || 0,
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
        case 'Driver (Mile)':
            return PayrollDriverMilesTableSettingsConstants;
        case 'Driver (Commission)':
            return PayrollDriverCommisionTableSettingsConstants;
        case 'Owner':
            return PayrollOwnerTableSettingsConstants;
    }
}
