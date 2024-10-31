import { PayrollDriverFlatRateByIdResponse } from 'appcoretruckassist';
import { IDriverFlatRateList } from '../../models/driver_flat_rate.model';
import {
    IGet_Payroll_Commission_Driver_Report,
    PayrollState,
} from '../../models/payroll.model';

export const onGetPayrollFlatRateDriverSuccess = (
    state: PayrollState,
    data: { flatListPayrollList: IDriverFlatRateList }
) => ({
    ...state,
    driverFlatRateList: data.flatListPayrollList,
    loading: false,
});

export const onGetPayrollFlatRateDriver = (state: PayrollState) => ({
    ...state,
    loading: true,
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

