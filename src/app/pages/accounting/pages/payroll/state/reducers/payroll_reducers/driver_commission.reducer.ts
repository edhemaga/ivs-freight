import { PayrollDriverCommissionByIdResponse, PayrollDriverCommissionClosedByIdResponse } from 'appcoretruckassist';
import { IDriverCommissionList } from '../../models/driver_commission.model';
import {
    IGet_Payroll_Commission_Driver_Report,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
    PayrollState,
} from '../../models/payroll.model';

export const onGetPayrollSoloMileageDriverSuccess = (
    state: PayrollState,
    data: { commissionPayrollList: IDriverCommissionList }
) => ({
    ...state,
    payrollCommissionDriverList: data.commissionPayrollList,
    loading: false,
});

export const onGetPayrollSoloMileageDriver = (state: PayrollState) => ({
    ...state,
    loading: true,
});

export const onGetPayrollCommissionReportDriver = (
    state: PayrollState,
    params: IGet_Payroll_Commission_Driver_Report
) => ({
    ...state,
    selectedLoadIds: params.selectedLoadIds,
    selectedDeductionIds:
        params.selectedDeductionIds ?? state.selectedDeductionIds,
    selectedCreditIds: params.selectedCreditIds ?? state.selectedCreditIds,
});

export const onGetPayrollCommissionReportDriverSuccess = (
    state: PayrollState,
    data: { payroll: PayrollDriverCommissionByIdResponse }
) => ({
    ...state,
    payrollOpenedReport: data.payroll,
    reportLoading: false,
});

export const onClosePayrollCommissionReportDriver = (state: PayrollState) => ({
    ...state,
    closeReportPaymentLoading: true,
    closeReportPaymentError: false,
});

export const onClosePayrollCommissionReportDriverSuccess = (
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

export const onClosePayrollCommissionReportDriverError = (
    state: PayrollState
) => ({
    ...state,
    closeReportPaymentLoading: false,
    closeReportPaymentError: true,
});

export const onGetPayrollCommissionDriverCollapsedList = (
    state: PayrollState
) => ({
    ...state,
    loading: true,
});

export const onGetPayrollCommissionDriverCollapsedListSuccess = (
    state: PayrollState,
    data: { data: PayrollDriverMileageCollapsedListResponse[] }
) => ({
    ...state,
    driverCommissionCollapsedList: data.data,
    loading: false,
});

export const onGetPayrollCommissionDriverCollapsedListError = (
    state: PayrollState
) => ({
    ...state,
    loading: false,
});

export const onGetPayrollCommissionDriverExpandedList = (
    state: PayrollState
) => ({
    ...state,
    loading: true,
});

export const onGetPayrollCommissionDriverExpandedListSuccess = (
    state: PayrollState,
    data: { data: PayrollDriverMileageExpandedListResponse[] }
) => ({
    ...state,
    driverCommissionExpandedList: data.data,
    loading: false,
});
export const onGetPayrollCommissionDriverExpandedListError = (
    state: PayrollState
) => ({
    ...state,
    loading: false,
});

export const onGetPayrollCommissionDriverClosedPayrollSuccess = (
    state: PayrollState,
    data: { payroll: PayrollDriverCommissionClosedByIdResponse }
) => ({
    ...state,
    payrollOpenedReport: data.payroll,
    reportLoading: false,
});