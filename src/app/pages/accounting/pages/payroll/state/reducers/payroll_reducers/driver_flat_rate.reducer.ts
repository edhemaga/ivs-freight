// Models
import {
    PayrollDriverFlatRateByIdResponse,
    PayrollDriverFlatRateClosedByIdResponse,
} from 'appcoretruckassist';
import { IDriverFlatRateList } from '@pages/accounting/pages/payroll/state/models';
import {
    IGet_Payroll_Commission_Driver_Report,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
    PayrollState,
} from '@pages/accounting/pages/payroll/state/models';

export const onGetPayrollFlatRateDriver = (state: PayrollState) => ({
    ...state,
    loading: true,
});

export const onGetPayrollFlatRateDriverSuccess = (
    state: PayrollState,
    data: { flatListPayrollList: IDriverFlatRateList }
) => ({
    ...state,
    driverFlatRateList: data.flatListPayrollList,
    loading: false,
});

export const onGetPayrollFlatRateDriverError = (state: PayrollState) => ({
    ...state,
    loading: false,
});

export const onGetPayrollFlatRateReportDriver = (
    state: PayrollState,
    params: IGet_Payroll_Commission_Driver_Report
) => ({
    ...state,
    selectedLoadIds: params.selectedLoadIds,
    selectedDeductionIds:
        params.selectedDeductionIds ?? state.selectedDeductionIds,
    selectedCreditIds: params.selectedCreditIds ?? state.selectedCreditIds,
    SelectedBonusIds: params.selectedBonusIds ?? state.selectedBonusIds,
});

export const onGetPayrollFlatRateReportDriverSuccess = (
    state: PayrollState,
    data: { payroll: PayrollDriverFlatRateByIdResponse }
) => ({
    ...state,
    payrollOpenedReport: data.payroll,
    reportLoading: false,
});

export const onClosePayrollFlatRateReportDriver = (state: PayrollState) => ({
    ...state,
    closeReportPaymentLoading: true,
    closeReportPaymentError: false,
});

export const onClosePayrollFlatRateReportDriverSuccess = (
    state: PayrollState
) => ({
    ...state,
    expandedReportTable: false,
    closeReportPaymentLoading: false,
    payrollCounts: {},
    selectedDeductionIds: [],
    selectedBonusIds: [],
    selectedCreditIds: [],
    lastLoadDate: undefined,
});

export const onClosePayrollFlatRateReportDriverError = (
    state: PayrollState
) => ({
    ...state,
    closeReportPaymentLoading: false,
    closeReportPaymentError: true,
});

export const onGetPayrollFlatRateDriverCollapsedList = (
    state: PayrollState
) => ({
    ...state,
    loading: true,
});

export const onGetPayrollFlatRateDriverCollapsedListSuccess = (
    state: PayrollState,
    data: { data: PayrollDriverMileageCollapsedListResponse[] }
) => ({
    ...state,
    driverFlatRateCollapsedList: data.data,
    loading: false,
});

export const onGetPayrollFlatRateDriverCollapsedListError = (
    state: PayrollState
) => ({
    ...state,
    loading: false,
});

export const onGetPayrollFlatRateDriverExpandedList = (
    state: PayrollState
) => ({
    ...state,
    loading: true,
});

export const onGetPayrollFlatRateDriverExpandedListSuccess = (
    state: PayrollState,
    data: { data: PayrollDriverMileageExpandedListResponse[] }
) => ({
    ...state,
    driverFlatRateExpandedList: data.data,
    loading: false,
});
export const onGetPayrollFlatRateDriverExpandedListError = (
    state: PayrollState
) => ({
    ...state,
    loading: false,
});

export const onGetPayrollFlatRateDriverClosedPayrollSuccess = (
    state: PayrollState,
    data: { payroll: PayrollDriverFlatRateClosedByIdResponse }
) => ({
    ...state,
    payrollOpenedReport: data.payroll,
    reportLoading: false,
});

export const onDriverFlatRatePayrollClosedPayments = (
    state: PayrollState
) => ({
    ...state,
    closeReportPaymentLoading: true,
    closeReportPaymentError: false,
});

export const onDriverFlatRatePayrollClosedPaymentsSuccess = (
    state: PayrollState
) => ({
    ...state,
    expandedReportTable: false,
    closeReportPaymentLoading: false,
    payrollCounts: {},
    selectedDeductionIds: [],
    selectedBonusIds: [],
    selectedCreditIds: [],
    lastLoadDate: undefined,
});

export const onDriverFlatRatePayrollClosedPaymentsError = (
    state: PayrollState
) => ({
    ...state,
    closeReportPaymentLoading: false,
    closeReportPaymentError: true,
});
