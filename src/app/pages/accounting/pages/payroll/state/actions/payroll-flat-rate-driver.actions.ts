import { createAction, props } from '@ngrx/store';

// Enums
import { ePayrollFlatRateDriver } from '@pages/accounting/pages/payroll/state/enums';

// Models
import { IDriverFlatRateList } from '@pages/accounting/pages/payroll/state/models';
import {
    IAddPayrollClosedPayment,
    IGet_Payroll_Commission_Driver_Report,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
} from '@pages/accounting/pages/payroll/state/models';
import {
    PayrollDriverFlatRateByIdResponse,
    PayrollDriverFlatRateClosedByIdResponse,
    PayrollOtherPaymentType,
    PayrollPaymentType,
} from 'appcoretruckassist';

export const getPayrollFlatRateDriver = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLAT_RATE_DRIVER
);

export const getPayrollFlatRateDriverSuccess = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLAT_RATE_DRIVER_SUCCESS,
    props<{ flatListPayrollList: IDriverFlatRateList }>()
);

export const getPayrollFlatRateDriverError = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLAT_RATE_DRIVER_ERROR,
    props<any>()
);

// GET DRIVER FLAT RATE REPORT
export const getPayrollFlatRateReportDriver = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLAT_RATE_DRIVER_REPORT,
    props<IGet_Payroll_Commission_Driver_Report>()
);

export const getPayrollFlatRateReportDriverSuccess = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLAT_RATE_DRIVER_REPORT_SUCCESS,
    props<{ payroll: PayrollDriverFlatRateByIdResponse }>()
);

export const getPayrollFlatRateReportDriverError = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLAT_RATE_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER FLAT RATE CLOSED PAYROLL REPORT
export const getPayrollFlatRateReportDriverClosedPayroll = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_CLOSED_REPORT_PAYROLL,
    props<{ payrollId: number }>()
);
export const getPayrollFlatRateReportDriverClosedPayrollSuccess = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_CLOSED_REPORT_PAYROLL_SUCCESS,
    props<{ payroll: PayrollDriverFlatRateClosedByIdResponse }>()
);
export const getPayrollFlatRateReportDriverClosedPayrollError = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_CLOSED_REPORT_PAYROLL_SUCCESS,
    props<{ error: string }>()
);

export const closePayrollFlatRateReportDriver = createAction(
    ePayrollFlatRateDriver.CLOSE_PAYROLL_FLAT_RATE_DRIVER_REPORT,
    props<{
        amount: number;
        reportId: number;
        selectedLoadIds?: number[];
        selectedCreditIds?: number[];
        selectedDeductionIds?: number[];
        selectedBonusIds?: number[];
        paymentType?: PayrollPaymentType;
        otherPaymentType?: PayrollOtherPaymentType;
    }>()
);

export const closePayrollFlatRateReportDriverSuccess = createAction(
    ePayrollFlatRateDriver.CLOSE_PAYROLL_FLAT_RATE_DRIVER_REPORT_SUCCESS
    //props<{ payroll: PayrollDriverMileageResponse }>()
);

export const closePayrollFlatRateReportDriverError = createAction(
    ePayrollFlatRateDriver.CLOSE_PAYROLL_FLAT_RATE_DRIVER_REPORT_ERROR,
    props<any>()
);

// COMMISSSION COLLAPSED LIST
export const getPayrollFlatRateDriverCollapsedList = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_COLLAPSED_LIST_DRIVER
);
export const getPayrollFlatRateDriverCollapsedListSuccess = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_COLLAPSED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageCollapsedListResponse[] }>()
);
export const getPayrollFlatRateDriverCollapsedListError = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_COLLAPSED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// GET DRIVER MILEAGE Expanded LIST
export const getPayrollFlatRateDriverExpandedList = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_EXPANDED_LIST_DRIVER,
    props<{ driverId: number }>()
);
export const getPayrollFlatRateDriverExpandedListSuccess = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_EXPANDED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageExpandedListResponse[] }>()
);
export const getPayrollFlatRateDriverExpandedListError = createAction(
    ePayrollFlatRateDriver.GET_PAYROLL_FLATRATE_EXPANDED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// DRIVER MILEAGE FLAT RATE CLOSED PAYMENTS
export const driverFlatRatePayrollClosedPayments = createAction(
    ePayrollFlatRateDriver.CLOSE_PAYROLL_FLAT_RATE_DRIVER_PAYMENT,
    props<IAddPayrollClosedPayment>()
);
export const driverFlatRatePayrollClosedPaymentsSuccess = createAction(
    ePayrollFlatRateDriver.CLOSE_PAYROLL_FLAT_RATE_DRIVER_PAYMENT_SUCCESS
);
export const driverFlatRatePayrollClosedPaymentsError = createAction(
    ePayrollFlatRateDriver.CLOSE_PAYROLL_FLAT_RATE_DRIVER_PAYMENT_ERROR,
    props<{ error: string }>()
);
