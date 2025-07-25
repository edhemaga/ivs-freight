import { createAction, props } from '@ngrx/store';

// Enums
import { ePayrollCommissionDriver } from '@pages/accounting/pages/payroll/state/enums';

// Models
import { IDriverCommissionList } from '@pages/accounting/pages/payroll/state/models';
import {
    IAddPayrollClosedPayment,
    IGet_Payroll_Commission_Driver_Report,
    PayrollDriverMileageCollapsedListResponse,
    PayrollDriverMileageExpandedListResponse,
} from '@pages/accounting/pages/payroll/state/models';
import {
    PayrollDriverCommissionByIdResponse,
    PayrollDriverCommissionClosedByIdResponse,
    PayrollOtherPaymentType,
    PayrollPaymentType,
} from 'appcoretruckassist';

export const getPayrollCommissionDriver = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_DRIVER
);

export const getPayrollCommissionDriverSuccess = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_DRIVER_SUCCESS,
    props<{ commissionPayrollList: IDriverCommissionList }>()
);

export const getPayrollCommissionDriverError = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_DRIVER_ERROR,
    props<any>()
);

// GET DRIVER MILEAGE REPORT
export const getPayrollCommissionReportDriver = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_DRIVER_REPORT,
    props<IGet_Payroll_Commission_Driver_Report>()
);

export const getPayrollCommissionReportDriverSuccess = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_DRIVER_REPORT_SUCCESS,
    props<{ payroll: PayrollDriverCommissionByIdResponse }>()
);

export const getPayrollCommissionReportDriverError = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_DRIVER_REPORT_ERROR,
    props<any>()
);

// GET DRIVER COMMISSION CLOSED PAYROLL
export const getPayrollCommissionReportDriverClosedPayroll = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_CLOSED_PAYROLL,
    props<{ payrollId: number }>()
);
export const getPayrollCommissionReportDriverClosedPayrollSuccess =
    createAction(
        ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_CLOSED_PAYROLL_SUCCESS,
        props<{ payroll: PayrollDriverCommissionClosedByIdResponse }>()
    );
export const getPayrollCommissionReportDriverClosedPayrollError = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_CLOSED_PAYROLL_ERROR,
    props<{ error: string }>()
);

export const closePayrollCommissionReportDriver = createAction(
    ePayrollCommissionDriver.CLOSE_PAYROLL_COMMISSION_DRIVER_REPORT,
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

export const closePayrollCommissionReportDriverSuccess = createAction(
    ePayrollCommissionDriver.CLOSE_PAYROLL_COMMISSION_DRIVER_REPORT_SUCCESS
);

export const closePayrollCommissionReportDriverError = createAction(
    ePayrollCommissionDriver.CLOSE_PAYROLL_COMMISSION_DRIVER_REPORT_ERROR,
    props<any>()
);

// COMMISSSION COLLAPSED LIST
export const getPayrollCommissionDriverCollapsedList = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_COLLAPSED_LIST_DRIVER
);
export const getPayrollCommissionDriverCollapsedListSuccess = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_COLLAPSED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageCollapsedListResponse[] }>()
);
export const getPayrollCommissionDriverCollapsedListError = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_COLLAPSED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// GET DRIVER COMMISSION EXPANDED LIST
export const getPayrollCommissionDriverExpandedList = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_EXPANDED_LIST_DRIVER,
    props<{ driverId: number }>()
);
export const getPayrollCommissionDriverExpandedListSuccess = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_EXPANDED_LIST_DRIVER_SUCCESS,
    props<{ data: PayrollDriverMileageExpandedListResponse[] }>()
);
export const getPayrollCommissionDriverExpandedListError = createAction(
    ePayrollCommissionDriver.GET_PAYROLL_COMMISSION_EXPANDED_LIST_DRIVER_ERROR,
    props<{ error: string }>()
);

// DRIVER MILEAGE COMMISSION CLOSED PAYMENTS
export const driverCommissionPayrollClosedPayments = createAction(
    ePayrollCommissionDriver.CLOSE_PAYROLL_COMMISSION_DRIVER_PAYMENT,
    props<IAddPayrollClosedPayment>()
);
export const driverCommissionPayrollClosedPaymentsSuccess = createAction(
    ePayrollCommissionDriver.CLOSE_PAYROLL_COMMISSION_DRIVER_PAYMENT_SUCCESS
);
export const driverCommissionPayrollClosedPaymentsError = createAction(
    ePayrollCommissionDriver.CLOSE_PAYROLL_COMMISSION_DRIVER_PAYMENT_ERROR,
    props<{ error: string }>()
);
