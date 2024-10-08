import { createReducer, on } from '@ngrx/store';
import * as PayrollActions from '../actions/payroll.actions';
import * as PayrollSoloMileageDriver from '../actions/payroll_solo_mileage_driver.actions';
import { PayrollState } from '../models/payroll.model';

export const payrollState: PayrollState = {
    payrollCounts: {},
    payrollDriverMileage: [],
    loading: false,
    reportLoading: false,
};

export const payrollReducer = createReducer(
    payrollState,
    // Payroll Get Counts Actions
    on(PayrollActions.getPayrollCounts, (state) => ({
        ...state,
        loading: true,
    })),
    on(PayrollActions.getPayrollCountsSuccess, (state, results) => ({
        ...state,
        payrollCounts: results.payrollCounts,
        loading: false,
    })),
    on(PayrollSoloMileageDriver.getPayrollSoloMileageDriver, (state) => ({
        ...state,
        loading: true,
    })),
    // Payroll Get Driver Solo Mileage
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageDriverSuccess,
        (state, data) => ({
            ...state,
            payrollDriverMileage: data.payroll,
            loading: false,
        })
    ),

    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageReportDriver,
        (state, params) => {
            return {
                ...state,
                // reportLoading: true,
                lastLoadDate: params.lastLoadDate,
                selectedDeducionIds:
                    params.selectedDeducionIds ?? state.selectedDeducionIds,
                selectedBonusIds:
                    params.selectedBonusIds ?? state.selectedBonusIds,
                selectedCreditIds:
                    params.selectedCreditIds ?? state.selectedCreditIds,
            };
        }
    ),
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageReportDriverError,
        (state) => ({
            ...state,
            reportLoading: false,
        })
    ),
    // Payroll Get Driver Solo Mileage
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageReportDriverSuccess,
        (state, data) => {
            return {
                ...state,
                payrollOpenedReport: data.payroll,
                reportLoading: false,
            };
        }
    )
);

//
