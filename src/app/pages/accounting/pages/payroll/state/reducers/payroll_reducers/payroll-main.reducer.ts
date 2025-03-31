// Models
import { PayrollCountsResponse, RoutingResponse } from 'appcoretruckassist';
import { PayrollState } from '@pages/accounting/pages/payroll/state/models';

// Enums
import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { eStringPlaceholder } from '@shared/enums';

export const onGetPayrollCounts = (
    state: PayrollState,
    data: { showLoading: boolean }
) => {
    return {
        ...state,
        loading: data.showLoading,
    };
};

export const onGetPayrollCountsSuccess = (
    state: PayrollState,
    results: { payrollCounts: PayrollCountsResponse }
) => ({
    ...state,
    payrollCounts: results.payrollCounts,
    loading: false,
});

export const onSetPayrollopenedTab = (
    state: PayrollState,
    data: { tabStatus: ePayrollTablesStatus }
) => ({
    ...state,
    payrollOpenedTab: data.tabStatus,
    payrollCounts: {},
    selectedDeductionIds: undefined,
    selectedBonusIds: undefined,
    selectedCreditIds: undefined,
    lastLoadDate: undefined,
});

export const onSetTableReportExpanded = (
    state: PayrollState,
    data: { expanded: boolean; openedPayrollLeftId: string }
) => {
    if (!data.expanded) {
        return {
            ...state,
            lastLoadDate: null,
            selectedDeductionIds: undefined,
            selectedFuelIds: undefined,
            selectedCreditIds: undefined,
            selectedBonusIds: undefined,
            selectedLoadIds: undefined,
            expandedReportTable: data.expanded,
            payrollOpenedReport: null,
            openedPayrollLeftId: eStringPlaceholder.EMPTY,
        };
    }
    return {
        ...state,
        payrollOpenedReport: null,
        expandedReportTable: data.expanded,
        openedPayrollLeftId: data.openedPayrollLeftId,
    };
};

export const onGetMapDataSuccess = (
    state: PayrollState,
    data: { mapData: RoutingResponse }
) => {
    return {
        ...state,
        payrollMapRoutes: data.mapData,
    };
};
