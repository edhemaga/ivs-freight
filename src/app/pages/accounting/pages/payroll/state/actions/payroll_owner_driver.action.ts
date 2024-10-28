import { createAction, props } from '@ngrx/store';
import { PayrollOwnerDriverEnum } from '../enums/driver_owner/driver_owner.enums';
import { IDriverOwnerList } from '../models/driver_owner.model';

export const getPayrollOwnerDriverList = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_DRIVER
);

export const getPayrollOwnerDriverListSuccess = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_DRIVER_SUCCESS,
    props<{ ownerPayrollList: IDriverOwnerList }>()
);

export const getPayrollOwnerDriverListError = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_DRIVER_ERROR,
    props<any>()
);