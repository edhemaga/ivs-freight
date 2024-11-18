import { createAction, props } from '@ngrx/store';

// Enums
import { PayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';
import { PayrollEnum } from '@pages/accounting/pages/payroll/state/enums/payroll.enums';

// Models
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

export const setPayrollopenedTab = createAction(
    PayrollEnum.SET_PAYROLL_TAB,
    props<{ tabStatus: PayrollTablesStatus }>()
);
