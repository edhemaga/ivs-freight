import { createAction, props } from '@ngrx/store';
import { PayrollCommissionDriverEnum } from '../enums/driver_commission/payroll_driver_commission.enums';
import { IDriverCommissionList } from '../models/driver_commission.model';
import { IGet_Payroll_Solo_Mileage_Driver_Report } from '../models/payroll.model';
import { PayrollDriverCommissionByIdResponse } from 'appcoretruckassist';

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

// GET DRIVER MILEAGE REPORT
export const getPayrollCommissionReportDriver = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_DRIVER_REPORT,
    props<IGet_Payroll_Solo_Mileage_Driver_Report>()
);

export const getPayrollCommissionReportDriverSuccess = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_DRIVER_REPORT_SUCCESS,
    props<{ payroll: PayrollDriverCommissionByIdResponse }>()
);

export const getPayrollCommissionReportDriverError = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER COMMISSION CLOSED PAYROLL
export const getPayrollCommissionDriverClosedPayroll = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_CLOSED_PAYROLL,
    props<{ payrollId: number }>()
);
export const getPayrollCommissionDriverClosedPayrollSuccess = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_CLOSED_PAYROLL_SUCCESS
    // props<{ payroll: PayrollDriverMileageResponse }>()
);
export const getPayrollCommissionDriverClosedPayrollError = createAction(
    PayrollCommissionDriverEnum.GET_PAYROLL_COMMISSION_CLOSED_PAYROLL_ERROR,
    props<{ error: string }>()
);
