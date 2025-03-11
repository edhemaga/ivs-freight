import { createAction, props } from '@ngrx/store';

// MODELS
import {
    PayrollDriverMileageClosedByIdResponse,
    PayrollDriverMileageListResponse,
} from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';
import {
    IAddPayrollClosedPayment,
    IPayrollDriverMileageClosedByIdResponse,
    PayrollDriverMileageByIdResponseNumberId,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
} from '@pages/accounting/pages/payroll/state/models';

// ENUMS
import {
    ePayrollMileageDriverCollapsedList,
    ePayrollMileageDriverExpandedList,
    ePayrollMileageDriverClosedPayroll,
    ePayrollSoloMileageDriver,
} from '@pages/accounting/pages/payroll/state/enums';
import { IGet_Payroll_Solo_Mileage_Driver_Report } from '@pages/accounting/pages/payroll/state/models';

export const getPayrollSoloMileageDriver = createAction(
    ePayrollSoloMileageDriver.GET_PAYROLL_SOLO_MILEAGE_DRIVER
);

export const getPayrollSoloMileageDriverSuccess = createAction(
    ePayrollSoloMileageDriver.GET_PAYROLL_SOLO_MILEAGE_DRIVER_SUCCESS,
    props<{ payroll: PayrollDriverMileageListResponse[] }>()
);

export const getPayrollSoloMileageDriverError = createAction(
    ePayrollSoloMileageDriver.GET_PAYROLL_SOLO_MILEAGE_DRIVER_ERROR,
    props<any>()
);

// GET DRIVER MILEAGE COLLAPSED LIST
export const getPayrollMileageDriverCollapsedList = createAction(
    ePayrollMileageDriverCollapsedList.GET_PAYROLL_MILEAGE_COLLAPSED_LIST_DRIVER
);
export const getPayrollMileageDriverCollapsedListSuccess = createAction(
    ePayrollMileageDriverCollapsedList.GET_PAYROLL_MILEAGE_COLLAPSED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageCollapsedListResponse[] }>()
);
export const getPayrollMileageDriverCollapsedListError = createAction(
    ePayrollMileageDriverCollapsedList.GET_PAYROLL_MILEAGE_COLLAPSED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// GET DRIVER MILEAGE Expanded LIST
export const getPayrollMileageDriverExpandedList = createAction(
    ePayrollMileageDriverExpandedList.GET_PAYROLL_MILEAGE_EXPANDED_LIST_DRIVER,
    props<{ driverId: number }>()
);
export const getPayrollMileageDriverExpandedListSuccess = createAction(
    ePayrollMileageDriverExpandedList.GET_PAYROLL_MILEAGE_EXPANDED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageExpandedListResponse[] }>()
);
export const getPayrollMileageDriverExpandedListError = createAction(
    ePayrollMileageDriverExpandedList.GET_PAYROLL_MILEAGE_EXPANDED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// GET DRIVER MILEAGE REPORT
export const getPayrollSoloMileageReportDriver = createAction(
    ePayrollSoloMileageDriver.GET_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT,
    props<IGet_Payroll_Solo_Mileage_Driver_Report>()
);

export const getPayrollSoloMileageReportDriverSuccess = createAction(
    ePayrollSoloMileageDriver.GET_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT_SUCCESS,
    props<{ payroll: PayrollDriverMileageByIdResponseNumberId }>()
);

export const getPayrollSoloMileageReportDriverError = createAction(
    ePayrollSoloMileageDriver.GET_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER MILEAGE REPORT
export const closePayrollSoloMileageReportDriver = createAction(
    ePayrollSoloMileageDriver.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT,
    props<{
        amount: number;
        reportId: number;
        lastLoadDate: string;
        selectedCreditIds?: number[];
        selectedDeductionIds?: number[];
        selectedBonusIds?: number[];
        paymentType?: string;
        otherPaymentType?: string;
    }>()
);

export const closePayrollSoloMileageReportDriverSuccess = createAction(
    ePayrollSoloMileageDriver.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT_SUCCESS,
    props<{ payroll: PayrollDriverMileageResponse }>()
);

export const closePayrollSoloMileageReportDriverError = createAction(
    ePayrollSoloMileageDriver.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER MILEAGE CLOSED PAYROLL
export const getPayrollMileageDriverClosedPayroll = createAction(
    ePayrollMileageDriverClosedPayroll.GET_PAYROLL_MILEAGE_CLOSED_PAYROLL,
    props<{ payrollId: number }>()
);
export const getPayrollMileageDriverClosedPayrollSuccess = createAction(
    ePayrollMileageDriverClosedPayroll.GET_PAYROLL_MILEAGE_CLOSED_PAYROLL_SUCCESS,
    props<{ payroll: IPayrollDriverMileageClosedByIdResponse }>()
);
export const getPayrollMileageDriverClosedPayrollError = createAction(
    ePayrollMileageDriverClosedPayroll.GET_PAYROLL_MILEAGE_CLOSED_PAYROLL_ERROR,
    props<{ error: string }>()
);

// DRIVER MILEAGE PAYROLL CLOSED PAYMENTS
export const driverMileagePayrollClosedPayments = createAction(
    ePayrollSoloMileageDriver.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_PAYMENT,
    props<IAddPayrollClosedPayment>()
);
export const driverMileagePayrollClosedPaymentsSuccess = createAction(
    ePayrollSoloMileageDriver.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_PAYMENT_SUCCESS
);
export const driverMileagePayrollClosedPaymentsError = createAction(
    ePayrollSoloMileageDriver.CLOSE_PAYROLL_SOLO_MILEAGE_DRIVER_PAYMENT_ERROR,
    props<{ error: string }>()
);
