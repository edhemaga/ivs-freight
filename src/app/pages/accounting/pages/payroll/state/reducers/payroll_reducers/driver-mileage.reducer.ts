// Models
import { PayrollDriverMileageListResponse } from 'appcoretruckassist';
import {
    IGet_Payroll_Solo_Mileage_Driver_Report,
    IPayrollDriverMileageClosedByIdResponse,
    PayrollDriverMileageByIdResponseNumberId,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
    PayrollState,
} from '@pages/accounting/pages/payroll/state/models';

export const onGetPayrollSoloMileageDriver = (state: PayrollState) => ({
    ...state,
    loading: true,
});

export const onGetPayrollSoloMileageDriverSuccess = (
    state: PayrollState,
    data: { payroll: PayrollDriverMileageListResponse[] }
) => ({
    ...state,
    payrollDriverMileage: data.payroll,
    loading: false,
});

export const onGetPayrollSoloMileageReportDriver = (
    state: PayrollState,
    params: IGet_Payroll_Solo_Mileage_Driver_Report
) => ({
    ...state,
    lastLoadDate: params.lastLoadDate ?? state.lastLoadDate,
    selectedCreditIds: params.selectedCreditIds ?? state.selectedCreditIds,
    selectedDeductionIds:
        params.selectedDeductionIds ?? state.selectedDeductionIds,
});

export const onGetPayrollSoloMileageReportDriverSuccess = (
    state: PayrollState,
    data: { payroll: PayrollDriverMileageByIdResponseNumberId }
) => {
    const openedPayrollLeftId = +state.openedPayrollLeftId;

    let totalEarnings = 0;
    const payrollDriverMileage = state.payrollDriverMileage.map(
        (payrollDriver) => {
            totalEarnings += payrollDriver.earnings;
            return payrollDriver.id === openedPayrollLeftId
                ? { ...payrollDriver, earnings: data.payroll.earnings }
                : payrollDriver;
        }
    );

    return {
        ...state,
        payrollOpenedReport: data.payroll,
        reportLoading: false,
        payrollDriverMileage,
        payrollCounts: {
            ...state.payrollCounts,
            soloMiles: {
                ...state.payrollCounts.soloMiles,
                value: totalEarnings,
            },
        },
    };
};

export const onGetPayrollSoloMileageReportDriverError = (
    state: PayrollState
) => ({
    ...state,
    reportLoading: false,
});

export const onClosePayrollSoloMileageReportDriver = (state: PayrollState) => ({
    ...state,
    closeReportPaymentLoading: true,
    closeReportPaymentError: false,
});

export const onClosePayrollSoloMileageReportDriverSuccess = (
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

export const onClosePayrollSoloMileageReportDriverError = (
    state: PayrollState
) => ({
    ...state,
    closeReportPaymentLoading: false,
    closeReportPaymentError: true,
});

export const onGetPayrollMileageDriverCollapsedList = (
    state: PayrollState
) => ({
    ...state,
    loading: true,
});

export const onGetPayrollMileageDriverCollapsedListSuccess = (
    state: PayrollState,
    data: { data: PayrollDriverMileageCollapsedListResponse[] }
) => ({
    ...state,
    driverMileageCollapsedList: data.data,
    loading: false,
});

export const onGetPayrollMileageDriverCollapsedListError = (
    state: PayrollState
) => ({
    ...state,
    loading: false,
});

export const onDriverMileagePayrollClosedPayments = (state: PayrollState) => ({
    ...state,
    closeReportPaymentLoading: true,
    closeReportPaymentError: false,
});

export const onDriverMileagePayrollClosedPaymentsSuccess = (
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

export const onDriverMileagePayrollClosedPaymentsError = (
    state: PayrollState
) => ({
    ...state,
    closeReportPaymentLoading: false,
    closeReportPaymentError: true,
});

export const onGetPayrollMileageDriverExpandedList = (state: PayrollState) => ({
    ...state,
    loading: true,
});

export const onGetPayrollMileageDriverExpandedListSuccess = (
    state: PayrollState,
    data: { data: PayrollDriverMileageExpandedListResponse[] }
) => ({
    ...state,
    driverMileageExpandedList: data.data,
    loading: false,
});
export const onGetPayrollMileageDriverExpandedListError = (
    state: PayrollState
) => ({
    ...state,
    loading: false,
});

export const onGetPayrollMileageDriverClosedPayrollSuccess = (
    state: PayrollState,
    data: { payroll: IPayrollDriverMileageClosedByIdResponse }
) => ({
    ...state,
    payrollOpenedReport: {
        ...data.payroll,
        excludedDeductions: [],
        excludedCredits: [],
        excludedLoads: [],
        excludedBonuses: [],
    },
    reportLoading: false,
});
