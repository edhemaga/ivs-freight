import { createAction, props } from '@ngrx/store';
import { PayrollCommissionDriverEnum } from '../enums/driver_commission/payroll_driver_commission.enums';
import { IDriverCommissionList } from '../models/driver_commission.model';

export const getPayrollCommissionDriver = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_DRIVER
);

export const getPayrollCommissionDriverSuccess = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_DRIVER_SUCCESS,
    props<{ commissionPayrollList: IDriverCommissionList }>()
);

export const getPayrollCommissionDriverError = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_DRIVER_ERROR,
    props<any>()
);