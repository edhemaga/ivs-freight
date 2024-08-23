import { createAction, props } from '@ngrx/store';
import { PayrollSoloMileageDriverEnum } from '../enums/payroll_solo_mileage_driver.enums';
import { PayrollDriverMileageListResponse } from 'appcoretruckassist';

export const getPayrollSoloMileageDriver = createAction(
    PayrollSoloMileageDriverEnum.GET_PAYROLL_SOLO_MILEAGE_DRIVER
);

export const getPayrollSoloMileageDriverSuccess = createAction(
    PayrollSoloMileageDriverEnum.GET_PAYROLL_SOLO_MILEAGE_DRIVER_SUCCESS,
    props<{ payroll: PayrollDriverMileageListResponse[] }>()
);

export const getPayrollSoloMileageDriverError = createAction(
    PayrollSoloMileageDriverEnum.GET_PAYROLL_SOLO_MILEAGE_DRIVER_ERROR,
    props<any>()
);