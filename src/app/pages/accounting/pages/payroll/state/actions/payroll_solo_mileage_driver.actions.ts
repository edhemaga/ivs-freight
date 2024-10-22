import { createAction, props } from '@ngrx/store';

// MODELS
import { PayrollDriverMileageListResponse } from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
import {
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
} from '../models/payroll.model';

// ENUMS
import { PayrollMileageDriverCollapsedListEnum } from '../enums/driver_mileage/payroll_mileage_driver_collapsed.enums';
import { PayrollMileageDriverExpandedListEnum } from '../enums/driver_mileage/payroll_mileage_driver_expanded.enums';
import { PayrollMileageDriverClosedPayrollEnum } from '../enums/driver_mileage/payroll_mileage_driver_closed.enums';
import { PayrollSoloMileageDriverEnum } from '../enums/driver_mileage/payroll_solo_mileage_driver.enums';

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

// GET DRIVER MILEAGE COLLAPSED LIST
export const getPayrollMileageDriverCollapsedList = createAction(
    PayrollMileageDriverCollapsedListEnum.GET_PAYROLL_MILEAGE_COLLAPSED_LIST_DRIVER
);
export const getPayrollMileageDriverCollapsedListSuccess = createAction(
    PayrollMileageDriverCollapsedListEnum.GET_PAYROLL_MILEAGE_COLLAPSED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageCollapsedListResponse[] }>()
);
export const getPayrollMileageDriverCollapsedListError = createAction(
    PayrollMileageDriverCollapsedListEnum.GET_PAYROLL_MILEAGE_COLLAPSED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// GET DRIVER MILEAGE Expanded LIST
export const getPayrollMileageDriverExpandedList = createAction(
    PayrollMileageDriverExpandedListEnum.GET_PAYROLL_MILEAGE_EXPANDED_LIST_DRIVER,
    props<{ driverId: number }>()
);
export const getPayrollMileageDriverExpandedListSuccess = createAction(
    PayrollMileageDriverExpandedListEnum.GET_PAYROLL_MILEAGE_EXPANDED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageExpandedListResponse[] }>()
);
export const getPayrollMileageDriverExpandedListError = createAction(
    PayrollMileageDriverExpandedListEnum.GET_PAYROLL_MILEAGE_EXPANDED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// GET DRIVER MILEAGE REPORT
export const getPayrollSoloMileageReportDriver = createAction(
    PayrollSoloMileageDriverEnum.GET_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT,
    props<{
        reportId: string;
        lastLoadDate: string;
        selectedCreditIds?: number[];
        selectedDeducionIds?: number[];
        selectedBonusIds?: number[];
    }>()
);

export const getPayrollSoloMileageReportDriverSuccess = createAction(
    PayrollSoloMileageDriverEnum.GET_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT_SUCCESS,
    props<{ payroll: PayrollDriverMileageResponse }>()
);

export const getPayrollSoloMileageReportDriverError = createAction(
    PayrollSoloMileageDriverEnum.GET_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER MILEAGE REPORT
export const closePayrollSoloMileageReportDriver = createAction(
    PayrollSoloMileageDriverEnum.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT,
    props<{
        amount: number;
        reportId: number;
        lastLoadDate: string;
        selectedCreditIds?: number[];
        selectedDeducionIds?: number[];
        selectedBonusIds?: number[];
        paymentType?: string,
        otherPaymentType?: string
    }>()
);

export const closePayrollSoloMileageReportDriverSuccess = createAction(
    PayrollSoloMileageDriverEnum.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT_SUCCESS,
    props<{ payroll: PayrollDriverMileageResponse }>()
);

export const closePayrollSoloMileageReportDriverError = createAction(
    PayrollSoloMileageDriverEnum.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER MILEAGE CLOSED PAYROLL
export const getPayrollMileageDriverClosedPayroll = createAction(
    PayrollMileageDriverClosedPayrollEnum.GET_PAYROLL_MILEAGE_CLOSED_PAYROLL,
    props<{ payrollId: number }>()
);
export const getPayrollMileageDriverClosedPayrollSuccess = createAction(
    PayrollMileageDriverClosedPayrollEnum.GET_PAYROLL_MILEAGE_CLOSED_PAYROLL_SUCCESS,
    props<{ payroll: PayrollDriverMileageResponse }>()
);
export const getPayrollMileageDriverClosedPayrollError = createAction(
    PayrollMileageDriverClosedPayrollEnum.GET_PAYROLL_MILEAGE_CLOSED_PAYROLL_ERROR,
    props<{ error: string }>()
);