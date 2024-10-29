import { IDriverFlatRateList } from '../../models/driver_flat_rate.model';
import { PayrollState } from '../../models/payroll.model';

export const onGetPayrollFlatRateDriverSuccess = (
    state: PayrollState,
    data: { flatListPayrollList: IDriverFlatRateList }
) => ({
    ...state,
    driverFlatRateList: data.flatListPayrollList,
    loading: false,
});

export const onGetPayrollFlatRateDriver = (
    state: PayrollState
) => ({
    ...state,
    loading: true,
});