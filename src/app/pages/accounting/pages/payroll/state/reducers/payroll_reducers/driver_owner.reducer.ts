import { PayrollOwnerResponse } from 'appcoretruckassist';
import { IDriverOwnerList } from '../../models/driver_owner.model';
import { PayrollState } from '../../models/payroll.model';

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

export const onGetPayrollOwnerReport = (state: PayrollState) => ({
    ...state,
    loading: true,
});

export const onGetPayrollOwnerReportSuccess = (
    state: PayrollState,
    data: { ownerPayrollReport: PayrollOwnerResponse }
) => ({
    ...state,
    loading: false,
    ownerPayrollResponse: data.ownerPayrollReport,
});
