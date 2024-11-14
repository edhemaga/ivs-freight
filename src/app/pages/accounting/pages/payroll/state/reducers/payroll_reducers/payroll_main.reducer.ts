// Models
import { PayrollCountsResponse } from 'appcoretruckassist';
import { PayrollState } from '@pages/accounting/pages/payroll/state/models/payroll.model';
import { PayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';

export const onGetPayrollCounts = (state: PayrollState) => ({
    ...state,
    loading: true,
});

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
    data: { tabStatus: PayrollTablesStatus }
) => ({
    ...state,
    payrollOpenedTab: data.tabStatus,
    payrollCounts: {},
    selectedDeductionIds: [],
    selectedBonusIds: [],
    selectedCreditIds: [],
    lastLoadDate: undefined,
});

export const onSetTableReportExpanded = (
    state: PayrollState,
    data: { expanded: boolean }
) => {
    if (!data.expanded) {
        console.log('CLOSEEEE!!!');
        return {
            ...state,
            lastLoadDate: null,
            selectedDeductionIds: [],
            selectedFuelIds: [],
            selectedCreditIds: [],
            selectedBonusIds: [],
            selectedLoadIds: [],
            expandedReportTable: data.expanded,
            payrollOpenedReport: null,
        };
    }
    return {
        ...state,
        payrollOpenedReport: null,
        expandedReportTable: data.expanded,
    };
};
