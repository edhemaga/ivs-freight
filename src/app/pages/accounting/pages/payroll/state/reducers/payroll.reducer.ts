import { createReducer, on } from '@ngrx/store';

// Actions
import * as PayrollActions from '../actions/payroll.actions';
import * as PayrollSoloMileageDriver from '../actions/payroll_solo_mileage_driver.actions';
import * as PayrollCommissionDriverActions from '../actions/payroll_commission_driver.actions';
import * as PayrollOwnerDriverActions from '../actions/payroll_owner_driver.action';
import * as PayrollFlatRateActions from '../actions/payroll_flat_rate_driver.actions';

// Models
import { PayrollState } from '../models/payroll.model';

// Reducers
import * as PayrollMileageDriverReducers from './payroll_reducers/driver_mileage.reducer';
import * as PayrollMainReducers from './payroll_reducers/payroll_main.reducer';
import * as PayrollCommissionDriverReducers from './payroll_reducers/driver_commission.reducer';
import * as PayrollOwnerDriverReducers from './payroll_reducers/driver_owner.reducer';
import * as PayrollFlatRateDriverReducers from './payroll_reducers/driver_flat_rate.reducer';

export const payrollState: PayrollState = {
    payrollCounts: {},
    payrollDriverMileage: [],
    payrollCommissionDriverList: [],
    ownerPayrollList: [],
    driverMileageCollapsedList: [],
    driverMileageExpandedList: [],
    driverFlatRateCollapsedList: [],
    driverOwnerCollapsedList: [],
    driverFlatRateList: [],
    loading: false,
    reportLoading: false,
    expandedReportTable: false,
    closeReportPaymentLoading: false,
    payrollOpenedTab: 'open',
};

export const payrollReducer = createReducer(
    payrollState,

    // PAYROLL MAIN REDUCERS
    on(PayrollActions.getPayrollCounts, PayrollMainReducers.onGetPayrollCounts),
    on(
        PayrollActions.getPayrollCountsSuccess,
        PayrollMainReducers.onGetPayrollCountsSuccess
    ),
    on(
        PayrollActions.setPayrollopenedTab,
        PayrollMainReducers.onSetPayrollopenedTab
    ),
    on(
        PayrollActions.setTableReportExpanded,
        PayrollMainReducers.onSetTableReportExpanded
    ),

    // DRIVER PAY BY MILEAGE
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageDriver,
        PayrollMileageDriverReducers.onGetPayrollSoloMileageDriver
    ),
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageDriverSuccess,
        PayrollMileageDriverReducers.onGetPayrollSoloMileageDriverSuccess
    ),
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageReportDriver,
        PayrollMileageDriverReducers.onGetPayrollSoloMileageReportDriver
    ),
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageReportDriverSuccess,
        PayrollMileageDriverReducers.onGetPayrollSoloMileageReportDriverErrorSuccess
    ),
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageReportDriverError,
        PayrollMileageDriverReducers.onGetPayrollSoloMileageReportDriverError
    ),
    on(
        PayrollSoloMileageDriver.closePayrollSoloMileageReportDriver,
        PayrollMileageDriverReducers.onClosePayrollSoloMileageReportDriver
    ),
    on(
        PayrollSoloMileageDriver.closePayrollSoloMileageReportDriverSuccess,
        PayrollMileageDriverReducers.onClosePayrollSoloMileageReportDriverSuccess
    ),
    on(
        PayrollSoloMileageDriver.closePayrollSoloMileageReportDriverError,
        PayrollMileageDriverReducers.onClosePayrollSoloMileageReportDriverError
    ),
    on(
        PayrollSoloMileageDriver.driverMileagePayrollClosedPayments,
        PayrollMileageDriverReducers.onDriverMileagePayrollClosedPayments
    ),
    on(
        PayrollSoloMileageDriver.driverMileagePayrollClosedPaymentsSuccess,
        PayrollMileageDriverReducers.onDriverMileagePayrollClosedPaymentsSuccess
    ),
    on(
        PayrollSoloMileageDriver.driverMileagePayrollClosedPaymentsError,
        PayrollMileageDriverReducers.onDriverMileagePayrollClosedPaymentsError
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedList,
        PayrollMileageDriverReducers.onGetPayrollMileageDriverCollapsedList
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedListSuccess,
        PayrollMileageDriverReducers.onGetPayrollMileageDriverCollapsedListSuccess
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverCollapsedListError,
        PayrollMileageDriverReducers.onGetPayrollMileageDriverCollapsedListError
    ),

    // MILEAGE EXPANDED LIST REDUCERS
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverExpandedList,
        PayrollMileageDriverReducers.onGetPayrollMileageDriverExpandedList
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverExpandedListSuccess,
        PayrollMileageDriverReducers.onGetPayrollMileageDriverExpandedListSuccess
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverExpandedListError,
        PayrollMileageDriverReducers.onGetPayrollMileageDriverExpandedListError
    ),
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverClosedPayrollSuccess,
        PayrollMileageDriverReducers.onGetPayrollMileageDriverClosedPayrollSuccess
    ),
    // DRIVER PAY BY COMMISSION
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverSuccess,
        PayrollCommissionDriverReducers.onGetPayrollSoloMileageDriverSuccess
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriver,
        PayrollCommissionDriverReducers.onGetPayrollSoloMileageDriver
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionReportDriver,
        PayrollCommissionDriverReducers.onGetPayrollCommissionReportDriver
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionReportDriverSuccess,
        PayrollCommissionDriverReducers.onGetPayrollCommissionReportDriverSuccess
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionReportDriverClosedPayrollSuccess,
        PayrollCommissionDriverReducers.onGetPayrollCommissionDriverClosedPayrollSuccess
    ),

    // COMMISSION EXPANDED LIST REDUCERS
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverExpandedList,
        PayrollCommissionDriverReducers.onGetPayrollCommissionDriverExpandedList
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverExpandedListSuccess,
        PayrollCommissionDriverReducers.onGetPayrollCommissionDriverExpandedListSuccess
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverExpandedListError,
        PayrollCommissionDriverReducers.onGetPayrollCommissionDriverExpandedListError
    ),

    // COMMISSION COLLAPSED PAYROLL REPORT
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverCollapsedList,
        PayrollCommissionDriverReducers.onGetPayrollCommissionDriverCollapsedList
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverCollapsedListSuccess,
        PayrollCommissionDriverReducers.onGetPayrollCommissionDriverCollapsedListSuccess
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverCollapsedListError,
        PayrollCommissionDriverReducers.onGetPayrollCommissionDriverCollapsedListError
    ),
    // COMMISSION CLOSE PAYROLL REPORT
    on(
        PayrollCommissionDriverActions.closePayrollCommissionReportDriver,
        PayrollCommissionDriverReducers.onClosePayrollCommissionReportDriver
    ),
    on(
        PayrollCommissionDriverActions.closePayrollCommissionReportDriverSuccess,
        PayrollCommissionDriverReducers.onClosePayrollCommissionReportDriverSuccess
    ),
    on(
        PayrollCommissionDriverActions.closePayrollCommissionReportDriverError,
        PayrollCommissionDriverReducers.onClosePayrollCommissionReportDriverError
    ),

    // DRIVER OWNER
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverList,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverList
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverListSuccess,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverListSuccess
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerReportDriver,
        PayrollOwnerDriverReducers.onGetPayrollOwnerReport
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerReportDriverSuccess,
        PayrollOwnerDriverReducers.onGetPayrollOwnerReportSuccess
    ),

    // OWNER EXPANDED LIST REDUCERS
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverExpandedList,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverExpandedList
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverExpandedListSuccess,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverExpandedListSuccess
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverExpandedListError,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverExpandedListError
    ),

    // OWNER COLLAPSED PAYROLL REPORT
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverCollapsedList,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverCollapsedList
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverCollapsedListSuccess,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverCollapsedListSuccess
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverCollapsedList,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverCollapsedListError
    ),

    // OWNER CLOSE PAYROLL REPORT
    on(
        PayrollOwnerDriverActions.closePayrollOwnerReportDriver,
        PayrollOwnerDriverReducers.onClosePayrollOwnerReportDriver
    ),
    on(
        PayrollOwnerDriverActions.closePayrollOwnerReportDriverSuccess,
        PayrollOwnerDriverReducers.onClosePayrollOwnerReportDriverSuccess
    ),
    on(
        PayrollOwnerDriverActions.closePayrollOwnerReportDriverError,
        PayrollOwnerDriverReducers.onClosePayrollOwnerReportDriverError
    ),

    // DRIVER FLAT RATE
    on(
        PayrollFlatRateActions.getPayrollFlatRateReportDriverClosedPayrollSuccess,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverClosedPayrollSuccess
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriver,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriver
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverSuccess,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverSuccess
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateReportDriver,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateReportDriver
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateReportDriverSuccess,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateReportDriverSuccess
    ),

    // FLAT RATE CLOSE PAYROLL REPORT
    on(
        PayrollFlatRateActions.closePayrollFlatRateReportDriver,
        PayrollFlatRateDriverReducers.onClosePayrollFlatRateReportDriver
    ),
    on(
        PayrollFlatRateActions.closePayrollFlatRateReportDriverSuccess,
        PayrollFlatRateDriverReducers.onClosePayrollFlatRateReportDriverSuccess
    ),
    on(
        PayrollFlatRateActions.closePayrollFlatRateReportDriverError,
        PayrollFlatRateDriverReducers.onClosePayrollFlatRateReportDriverError
    ),

    // OWNER EXPANDED LIST REDUCERS
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverExpandedList,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverExpandedList
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverExpandedListSuccess,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverExpandedListSuccess
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverExpandedListError,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverExpandedListError
    ),

    // FLAT RATE COLLAPSED PAYROLL REPORT
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverCollapsedList,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverCollapsedList
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverCollapsedListSuccess,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverCollapsedListSuccess
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverCollapsedList,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverCollapsedListError
    )
);
