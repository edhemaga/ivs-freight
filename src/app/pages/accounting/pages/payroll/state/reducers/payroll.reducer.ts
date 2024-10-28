import { createReducer, on } from '@ngrx/store';

// Actions
import * as PayrollActions from '../actions/payroll.actions';
import * as PayrollSoloMileageDriver from '../actions/payroll_solo_mileage_driver.actions';
import * as PyarollCommissionDriverActions from '../actions/payroll_commission_driver.actions';
import * as PayrollOwnerDriverActions from '../actions/payroll_owner_driver.action';

// Models
import { PayrollState } from '../models/payroll.model';

// Reducers
import * as PayrollMileageDriverReducers from './payroll_reducers/driver_mileage.reducer';
import * as PayrollMainReducers from './payroll_reducers/payroll_main.reducer';
import * as PayrollCommissionDriverReducers from './payroll_reducers/driver_commission.reducer';
import * as PayrollOwnerDriverReducers from './payroll_reducers/driver_owner.reducer';
import { getPayrollOwnerDriverListSuccess } from '../actions/payroll_owner_driver.action';

export const payrollState: PayrollState = {
    payrollCounts: {},
    payrollDriverMileage: [],
    payrollCommissionDriverList: [],
    ownerPayrollList: [],
    driverMileageCollapsedList: [],
    driverMileageExpandedList: [],
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
        PyarollCommissionDriverActions.getPayrollCommissionDriverSuccess,
        PayrollCommissionDriverReducers.onGetPayrollSoloMileageDriverSuccess
    ),
    on(
        PyarollCommissionDriverActions.getPayrollCommissionDriver,
        PayrollCommissionDriverReducers.onGetPayrollSoloMileageDriver
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

);
