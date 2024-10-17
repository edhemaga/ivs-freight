import { createReducer, on } from '@ngrx/store';
import * as PayrollActions from '../actions/payroll.actions';
import * as PayrollSoloMileageDriver from '../actions/payroll_solo_mileage_driver.actions';
import { PayrollState } from '../models/payroll.model';

export const payrollState: PayrollState = {
    payrollCounts: {},
    payrollDriverMileage: [],
    driverMileageCollapsedList: [],
    loading: false,
    reportLoading: false,
    expandedReportTable: false,
    closeReportPaymentLoading: false,
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
    ),
    on(PayrollActions.setTableReportExpanded, (state, data) => {
        return {
            ...state,
            expandedReportTable: data.expanded,
        };
    }),
    on(
        PayrollSoloMileageDriver.closePayrollSoloMileageReportDriver,
        (state) => {
            return {
                ...state,
                closeReportPaymentLoading: true,
                closeReportPaymentError: false,
            };
        }
    ),
    on(
        PayrollSoloMileageDriver.closePayrollSoloMileageReportDriverSuccess,
        (state) => {
            return {
                ...state,
                expandedReportTable: false,
                closeReportPaymentLoading: false,
            };
        }
    ),
    on(
        PayrollSoloMileageDriver.closePayrollSoloMileageReportDriverError,
        (state) => {
            return {
                ...state,
                closeReportPaymentLoading: false,
                closeReportPaymentError: true,
            };
        }
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedList,
        (state) => {
            return {
                ...state,
                loading: true,
            };
        }
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedListSuccess,
        (state, data) => {
            console.log('WHAT IS RESULT FROM HEREE', data);
            return {
                ...state,
                driverMileageCollapsedList: data.data,
                loading: false,
            };
        }
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedListError,
        (state) => {
            return {
                ...state,
                loading: false,
            };
        }
    )
);
