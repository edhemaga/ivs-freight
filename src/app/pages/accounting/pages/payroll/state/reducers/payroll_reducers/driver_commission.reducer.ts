import { IDriverCommissionList } from '../../models/driver_commission.model';
import { PayrollState } from '../../models/payroll.model';

export const onGetPayrollSoloMileageDriverSuccess = (
    state: PayrollState,
    data: { commissionPayrollList: IDriverCommissionList }
) => ({
    ...state,
    payrollCommissionDriverList: data.commissionPayrollList,
    loading: false,
});

export const onGetPayrollSoloMileageDriver = (
    state: PayrollState
) => ({
    ...state,
    loading: true,
});