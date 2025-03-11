// Models
import {
    PayrollOwnerClosedResponse,
    PayrollOwnerResponse,
} from 'appcoretruckassist';
import { IDriverOwnerList } from '@pages/accounting/pages/payroll/state/models';
import {
    IGet_Payroll_Commission_Driver_Report,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
    PayrollState,
} from '@pages/accounting/pages/payroll/state/models';

export const onGetPayrollOwnerDriverList = (state: PayrollState) => ({
    ...state,
    loading: true,
});

export const onGetPayrollOwnerDriverListSuccess = (
    state: PayrollState,
    data: { ownerPayrollList: IDriverOwnerList }
) => ({
    ...state,
    ownerPayrollList: data.ownerPayrollList,
    loading: false,
});

export const onGetPayrollOwnerDriverListError = (state: PayrollState) => ({
    ...state,
    loading: false,
});

export const onGetPayrollOwnerReport = (
    state: PayrollState,
    params: IGet_Payroll_Commission_Driver_Report
) => ({
    ...state,
    selectedLoadIds: params.selectedLoadIds,
    selectedDeductionIds:
        params.selectedDeductionIds ?? state.selectedDeductionIds,
    selectedCreditIds: params.selectedCreditIds ?? state.selectedCreditIds,
    selectedFuelIds: params.selectedFuelIds ?? state.selectedFuelIds,
});

export const onGetPayrollOwnerReportSuccess = (
    state: PayrollState,
    data: { ownerPayrollReport: PayrollOwnerResponse }
) => {
    const openedPayrollLeftId = +state.openedPayrollLeftId;
    const ownerPayrollList = state.ownerPayrollList.map((payrollDriver) =>
        payrollDriver.id === openedPayrollLeftId
            ? { ...payrollDriver, earnings: data.ownerPayrollReport.earnings }
            : payrollDriver
    );
    return {
        ...state,
        loading: false,
        ownerPayrollResponse: data.ownerPayrollReport,
        ownerPayrollList,
    };
};

export const onClosePayrollOwnerReportDriver = (state: PayrollState) => ({
    ...state,
    closeReportPaymentLoading: true,
    closeReportPaymentError: false,
});

export const onClosePayrollOwnerReportDriverSuccess = (
    state: PayrollState
) => ({
    ...state,
    expandedReportTable: false,
    closeReportPaymentLoading: false,
    payrollCounts: {},
    selectedDeductionIds: undefined,
    selectedBonusIds: undefined,
    selectedCreditIds: undefined,
    lastLoadDate: undefined,
});

export const onClosePayrollOwnerReportDriverError = (state: PayrollState) => ({
    ...state,
    closeReportPaymentLoading: false,
    closeReportPaymentError: true,
});

export const onGetPayrollOwnerDriverCollapsedList = (state: PayrollState) => ({
    ...state,
    loading: true,
});

export const onGetPayrollOwnerDriverCollapsedListSuccess = (
    state: PayrollState,
    data: { data: PayrollDriverMileageCollapsedListResponse[] }
) => ({
    ...state,
    driverOwnerCollapsedList: data.data,
    loading: false,
});

export const onGetPayrollOwnerDriverCollapsedListError = (
    state: PayrollState
) => ({
    ...state,
    loading: false,
});

export const onGetPayrollOwnerDriverExpandedList = (state: PayrollState) => ({
    ...state,
    loading: true,
});

export const onGetPayrollOwnerDriverExpandedListSuccess = (
    state: PayrollState,
    data: { data: PayrollDriverMileageExpandedListResponse[] }
) => ({
    ...state,
    driverOwnerExpandedList: data.data,
    loading: false,
});
export const onGetPayrollOwnerDriverExpandedListError = (
    state: PayrollState
) => ({
    ...state,
    loading: false,
});

export const onDriverOwnerPayrollClosedPayments = (state: PayrollState) => ({
    ...state,
    closeReportPaymentLoading: true,
    closeReportPaymentError: false,
});

export const onDriverOwnerPayrollClosedPaymentsSuccess = (
    state: PayrollState
) => ({
    ...state,
    expandedReportTable: false,
    closeReportPaymentLoading: false,
    payrollCounts: {},
    selectedDeductionIds: undefined,
    selectedBonusIds: undefined,
    selectedCreditIds: undefined,
    lastLoadDate: undefined,
});

export const onDriverOwnerPayrollClosedPaymentsError = (
    state: PayrollState
) => ({
    ...state,
    closeReportPaymentLoading: false,
    closeReportPaymentError: true,
});

export const onGetPayrollOwnerDriverClosedPayroll = (state: PayrollState) => ({
    ...state,
    ownerPayrollResponse: null,
    reportLoading: true,
});

export const onGetPayrollOwnerDriverClosedPayrollSuccess = (
    state: PayrollState,
    data: { payroll: PayrollOwnerClosedResponse }
) => {
    return {
        ...state,
        ownerPayrollResponse: {
            ...data.payroll,
            excludedDeductions: [],
            excludedCredits: [],
            excludedLoads: [],
        },
        reportLoading: false,
    };
};
