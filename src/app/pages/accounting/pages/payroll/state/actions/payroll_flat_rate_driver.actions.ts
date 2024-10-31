import { createAction, props } from '@ngrx/store';
import { PayrollFlatRateDriverEnum } from '../enums/driver_flat_rate/payroll_driver_flat_rate.enums';
import { IDriverFlatRateList } from '../models/driver_flat_rate.model';
import { IGet_Payroll_Commission_Driver_Report } from '../models/payroll.model';
import {
    PayrollDriverCommissionByIdResponse,
    PayrollDriverFlatRateByIdResponse,
    PayrollOtherPaymentType,
    PayrollPaymentType,
} from 'appcoretruckassist';

export const getPayrollFlatRateDriver = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER
);

export const getPayrollFlatRateDriverSuccess = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER_SUCCESS,
    props<{ flatListPayrollList: IDriverFlatRateList }>()
);

export const getPayrollFlatRateDriverError = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER_ERROR,
    props<any>()
);

// GET DRIVER FLAT RATE REPORT
export const getPayrollFlatRateReportDriver = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER_REPORT,
    props<IGet_Payroll_Commission_Driver_Report>()
);

export const getPayrollFlatRateReportDriverSuccess = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER_REPORT_SUCCESS,
    props<{ payroll: PayrollDriverFlatRateByIdResponse }>()
);

export const getPayrollFlatRateReportDriverError = createAction(
    PayrollFlatRateDriverEnum.GET_PAYROLL_FLAT_RATE_DRIVER_REPORT_ERROR,
    props<any>()
);

export const closePayrollFlatRateReportDriver = createAction(
    PayrollFlatRateDriverEnum.CLOSE_PAYROLL_FLAT_RATE_DRIVER_PAYMENT,
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
    PayrollFlatRateDriverEnum.CLOSE_PAYROLL_FLAT_RATE_DRIVER_PAYMENT_SUCCESS
    //props<{ payroll: PayrollDriverMileageResponse }>()
);

export const closePayrollFlatRateReportDriverError = createAction(
    PayrollFlatRateDriverEnum.CLOSE_PAYROLL_FLAT_RATE_DRIVER_PAYMENT_ERROR,
    props<any>()
);
