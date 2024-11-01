import { PayrollCountsResponse } from 'appcoretruckassist';
import { PayrollState } from '../../models/payroll.model';

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
    data: { tabStatus: 'open' | 'closed' }
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
        console.log("CLOSEEEE!!!");
        return {
            ...state,
            lastLoadDate: null,
            selectedDeductionIds: [],
            selectedFuelIds: [],
            selectedCreditIds: [],
            selectedBonusIds: [],
            selectedLoadIds: [],
            expandedReportTable: data.expanded,
        };
    }
    return {
        ...state,
        expandedReportTable: data.expanded,
    };
};
