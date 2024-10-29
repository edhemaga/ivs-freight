import { createAction, props } from '@ngrx/store';
import { PayrollFlatRateDriverEnum } from '../enums/driver_flat_rate/payroll_driver_flat_rate.enums';
import { IDriverFlatRateList } from '../models/driver_flat_rate.model';

export const getPayrollFlatRateDriver = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER
);

export const getPayrollFlatRateDriverSuccess = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER_SUCCESS,
    props<{ flatListPayrollList: IDriverFlatRateList }>()
);

export const getPayrollFlatRateDriverError = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER_ERROR,
    props<any>()
);