import { createAction, props } from '@ngrx/store';
import { PayrollOwnerDriverEnum } from '../enums/driver_owner/driver_owner.enums';
import { IDriverOwnerList } from '../models/driver_owner.model';
import { IGet_Payroll_Commission_Driver_Report } from '../models/payroll.model';
import { PayrollOwnerResponse } from 'appcoretruckassist';

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

// OWNER PAYROLL REPORT
export const getPayrollOwnerReportDriver = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_DRIVER_REPORT,
    props<IGet_Payroll_Commission_Driver_Report>()
);

export const getPayrollOwnerReportDriverSuccess = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_DRIVER_REPORT_SUCCESS,
    props<{ ownerPayrollReport: PayrollOwnerResponse }>()
);

export const getPayrollOwnerReportDriverError = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER COMMISSION CLOSED PAYROLL
export const getPayrollOwnerDriverClosedPayroll = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_CLOSED_PAYROLL,
    props<{ payrollId: number }>()
);
export const getPayrollOwnerDriverClosedPayrollSuccess = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_CLOSED_PAYROLL_SUCCESS
    // props<{ payroll: PayrollDriverMileageResponse }>()
);
export const getPayrollOwnerDriverClosedPayrollError = createAction(
    PayrollOwnerDriverEnum.GET_PAYROLL_OWNER_CLOSED_PAYROLL_ERROR,
    props<{ error: string }>()
);
