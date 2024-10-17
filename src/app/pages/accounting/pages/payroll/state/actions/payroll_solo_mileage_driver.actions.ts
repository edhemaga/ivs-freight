import { createAction, props } from '@ngrx/store';
import { PayrollSoloMileageDriverEnum } from '../enums/payroll_solo_mileage_driver.enums';
import { PayrollDriverMileageListResponse } from 'appcoretruckassist';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';

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
