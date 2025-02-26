import { createAction, props } from '@ngrx/store';
import { ePayrollOwnerDriver } from '@pages/accounting/pages/payroll/state/enums';
import { IDriverOwnerList } from '@pages/accounting/pages/payroll/state/models';
import {
    IAddPayrollClosedPayment,
    IGet_Payroll_Commission_Driver_Report,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
} from '@pages/accounting/pages/payroll/state/models';
import {
    PayrollOtherPaymentType,
    PayrollOwnerClosedResponse,
    PayrollOwnerResponse,
    PayrollPaymentType,
} from 'appcoretruckassist';

export const getPayrollOwnerDriverList = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_DRIVER
);

export const getPayrollOwnerDriverListSuccess = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_DRIVER_SUCCESS,
    props<{ ownerPayrollList: IDriverOwnerList }>()
);

export const getPayrollOwnerDriverListError = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_DRIVER_ERROR,
    props<any>()
);

// OWNER PAYROLL REPORT
export const getPayrollOwnerReportDriver = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_DRIVER_REPORT,
    props<IGet_Payroll_Commission_Driver_Report>()
);

export const getPayrollOwnerReportDriverSuccess = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_DRIVER_REPORT_SUCCESS,
    props<{ ownerPayrollReport: PayrollOwnerResponse }>()
);

export const getPayrollOwnerReportDriverError = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER OWNER CLOSED PAYROLL
export const getPayrollOwnerDriverClosedReportPayroll = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_CLOSED_PAYROLL,
    props<{ payrollId: number }>()
);
export const getPayrollOwnerDriverClosedReportPayrollSuccess = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_CLOSED_PAYROLL_SUCCESS,
    props<{ payroll: PayrollOwnerClosedResponse }>()
);
export const getPayrollOwnerDriverClosedReportPayrollError = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_CLOSED_PAYROLL_ERROR,
    props<{ error: string }>()
);

export const closePayrollOwnerReportDriver = createAction(
    ePayrollOwnerDriver.CLOSE_PAYROLL_OWNER_DRIVER_REPORT,
    props<{
        amount: number;
        reportId: number;
        selectedLoadIds?: number[];
        selectedCreditIds?: number[];
        selectedDeductionIds?: number[];
        paymentType?: PayrollPaymentType;
        otherPaymentType?: PayrollOtherPaymentType;
    }>()
);

export const closePayrollOwnerReportDriverSuccess = createAction(
    ePayrollOwnerDriver.CLOSE_PAYROLL_OWNER_DRIVER_REPORT_SUCCESS
    //props<{ payroll: PayrollDriverMileageResponse }>()
);

export const closePayrollOwnerReportDriverError = createAction(
    ePayrollOwnerDriver.CLOSE_PAYROLL_OWNER_DRIVER_REPORT_ERROR,
    props<any>()
);

// OWNER COLLAPSED LIST
export const getPayrollOwnerDriverCollapsedList = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_COLLAPSED_LIST_DRIVER
);
export const getPayrollOwnerDriverCollapsedListSuccess = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_COLLAPSED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageCollapsedListResponse[] }>()
);
export const getPayrollOwnerDriverCollapsedListError = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_COLLAPSED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// GET DRIVER OWNER EXPANDED LIST
export const getPayrollOwnerDriverExpandedList = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_EXPANDED_LIST_DRIVER,
    props<{ trailerId: number }>()
);
export const getPayrollOwnerDriverExpandedListSuccess = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_EXPANDED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageExpandedListResponse[] }>()
);
export const getPayrollOwnerDriverExpandedListError = createAction(
    ePayrollOwnerDriver.GET_PAYROLL_OWNER_EXPANDED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// DRIVER OWNER FLAT RATE CLOSED PAYMENTS
export const driverOwnerPayrollClosedPayments = createAction(
    ePayrollOwnerDriver.CLOSE_PAYROLL_OWNER_DRIVER_PAYMENT,
    props<IAddPayrollClosedPayment>()
);
export const driverOwnerPayrollClosedPaymentsSuccess = createAction(
    ePayrollOwnerDriver.CLOSE_PAYROLL_OWNER_DRIVER_PAYMENT_SUCCESS
);
export const driverOwnerPayrollClosedPaymentsError = createAction(
    ePayrollOwnerDriver.CLOSE_PAYROLL_OWNER_DRIVER_PAYMENT_ERROR,
    props<{ error: string }>()
);
