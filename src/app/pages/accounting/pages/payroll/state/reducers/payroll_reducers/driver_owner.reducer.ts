import { PayrollOwnerResponse } from 'appcoretruckassist';
import { IDriverOwnerList } from '../../models/driver_owner.model';
import {
    IGet_Payroll_Commission_Driver_Report,
    PayrollState,
} from '../../models/payroll.model';

export const onGetPayrollOwnerDriverListSuccess = (
    state: PayrollState,
    data: { ownerPayrollList: IDriverOwnerList }
) => ({
    ...state,
    ownerPayrollList: data.ownerPayrollList,
    loading: false,
});

export const onGetPayrollOwnerDriverList = (state: PayrollState) => ({
    ...state,
    loading: true,
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
});

export const onGetPayrollOwnerReportSuccess = (
    state: PayrollState,
    data: { ownerPayrollReport: PayrollOwnerResponse }
) => ({
    ...state,
    loading: false,
    ownerPayrollResponse: data.ownerPayrollReport,
});

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
    selectedDeductionIds: [],
    selectedBonusIds: [],
    selectedCreditIds: [],
    lastLoadDate: undefined,
});

export const onClosePayrollOwnerReportDriverError = (state: PayrollState) => ({
    ...state,
    closeReportPaymentLoading: false,
    closeReportPaymentError: true,
});
