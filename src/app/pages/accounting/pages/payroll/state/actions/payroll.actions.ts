import { createAction, props } from '@ngrx/store';

// Enums
import {
    ePayrollTablesStatus,
    ePayrollEnum,
} from '@pages/accounting/pages/payroll/state/enums';

// Models
import { PayrollCountsResponse, RoutingResponse } from 'appcoretruckassist';

export const getPayrollCounts = createAction(
    ePayrollEnum.GET_PAYROLL_COUNTS,
    props<{ ShowOpen: boolean }>()
);

export const getPayrollCountsSuccess = createAction(
    ePayrollEnum.GET_PAYROLL_COUNTS_SUCCESS,
    props<{ payrollCounts: PayrollCountsResponse }>()
);

export const getPayrollCountsError = createAction(
    ePayrollEnum.GET_PAYROLL_COUNTS_ERROR,
    props<any>()
);

export const setTableReportExpanded = createAction(
    ePayrollEnum.SET_TABLE_REPORT_EXPANDED,
    props<{ expanded: boolean }>()
);

export const setPayrollopenedTab = createAction(
    ePayrollEnum.SET_PAYROLL_TAB,
    props<{ tabStatus: ePayrollTablesStatus }>()
);

export const getPayrollMapData = createAction(
    ePayrollEnum.GET_PAYROLL_MAP_DATA,
    props<{ locations: string }>()
);

export const getPayrollMapDataSuccess = createAction(
    ePayrollEnum.GET_PAYROLL_MAP_DATA_SUCCESS,
    props<{ mapData: RoutingResponse }>()
);

export const getPayrollMapDataError = createAction(
    ePayrollEnum.GET_PAYROLL_MAP_DATA_ERROR,
    props<any>()
);
