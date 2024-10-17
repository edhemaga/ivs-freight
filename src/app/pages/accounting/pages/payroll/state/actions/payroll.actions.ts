import { createAction, props } from '@ngrx/store';
import { PayrollEnum } from '../enums/payroll.enums';
import { PayrollCountsResponse } from 'appcoretruckassist';

export const getPayrollCounts = createAction(
    PayrollEnum.GET_PAYROLL_COUNTS,
    props<{ ShowOpen: boolean }>()
);

export const getPayrollCountsSuccess = createAction(
    PayrollEnum.GET_PAYROLL_COUNTS_SUCCESS,
    props<{ payrollCounts: PayrollCountsResponse }>()
);

export const getPayrollCountsError = createAction(
    PayrollEnum.GET_PAYROLL_COUNTS_ERROR,
    props<any>()
);

export const setTableReportExpanded = createAction(
    PayrollEnum.SET_TABLE_REPORT_EXPANDED,
    props<{ expanded: boolean }>()
);
