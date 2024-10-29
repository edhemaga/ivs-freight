import { PayrollDriverCommissionByIdResponse } from 'appcoretruckassist';
import { IDriverCommissionList } from '../../models/driver_commission.model';
import {
    IGet_Payroll_Solo_Mileage_Driver_Report,
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
    params: IGet_Payroll_Solo_Mileage_Driver_Report
) => ({
    ...state,
    lastLoadDate: params.lastLoadDate,
    selectedDeducionIds:
        params.selectedDeducionIds ?? state.selectedDeducionIds,
    selectedBonusIds: params.selectedBonusIds ?? state.selectedBonusIds,
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
