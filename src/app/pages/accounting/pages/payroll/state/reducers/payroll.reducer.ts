import { createReducer, on } from '@ngrx/store';

// Actions
import * as PayrollActions from '@pages/accounting/pages/payroll/state/actions/payroll.actions';
import * as PayrollSoloMileageDriver from '@pages/accounting/pages/payroll/state/actions/payroll_solo_mileage_driver.actions';
import * as PayrollCommissionDriverActions from '@pages/accounting/pages/payroll/state/actions/payroll_commission_driver.actions';
import * as PayrollOwnerDriverActions from '@pages/accounting/pages/payroll/state/actions/payroll_owner_driver.action';
import * as PayrollFlatRateActions from '@pages/accounting/pages/payroll/state/actions/payroll_flat_rate_driver.actions';

// Models
import { PayrollState } from '@pages/accounting/pages/payroll/state/models/payroll.model';

// Reducers
import * as PayrollMileageDriverReducers from '@pages/accounting/pages/payroll/state/reducers/payroll_reducers/driver_mileage.reducer';
import * as PayrollMainReducers from '@pages/accounting/pages/payroll/state/reducers/payroll_reducers/payroll_main.reducer';
import * as PayrollCommissionDriverReducers from '@pages/accounting/pages/payroll/state/reducers/payroll_reducers/driver_commission.reducer';
import * as PayrollOwnerDriverReducers from '@pages/accounting/pages/payroll/state/reducers/payroll_reducers/driver_owner.reducer';
import * as PayrollFlatRateDriverReducers from '@pages/accounting/pages/payroll/state/reducers/payroll_reducers/driver_flat_rate.reducer';

// Enums
import { PayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';

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
    payrollOpenedTab: PayrollTablesStatus.OPEN,
};

export const payrollReducer = createReducer(
    payrollState,

    /*
        PAYROLL MAIN REDUCERS
    */
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

    /*
        PAYROLL DRIVER BY MILEAGE REDUCERS
    */

    // OPEN MILEAGE LIST
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageDriver,
        PayrollMileageDriverReducers.onGetPayrollSoloMileageDriver
    ),
    on(
        PayrollSoloMileageDriver.getPayrollSoloMileageDriverSuccess,
        PayrollMileageDriverReducers.onGetPayrollSoloMileageDriverSuccess
    ),

    // OPEN MILEAGE REPORT
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

    // CLOSE MILEAGE REPORT
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

    // CLOSE MILEAGE PAYMENT
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
    // DRIVER MILEAGE COLLAPSED LIST
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

    // MILEAGE EXPANDED LIST
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
    // MILEAGE CLOSED PAYROLL BY ID
    on(
        PayrollSoloMileageDriver.getPayrollMileageDriverClosedPayrollSuccess,
        PayrollMileageDriverReducers.onGetPayrollMileageDriverClosedPayrollSuccess
    ),

    /*
        PAYROLL DRIVER BY COMMISSION REDUCERS
    */

    // OPEN COMMISSION LIST
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriver,
        PayrollCommissionDriverReducers.onGetPayrollSoloMileageDriver
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverSuccess,
        PayrollCommissionDriverReducers.onGetPayrollSoloMileageDriverSuccess
    ),
    on(
        PayrollCommissionDriverActions.getPayrollCommissionDriverError,
        PayrollCommissionDriverReducers.onGetPayrollSoloMileageDriverError
    ),

    // OPEN COMMISSION REPORT
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

    // CLOSE COMMISSION PAYMENT
    on(
        PayrollCommissionDriverActions.driverCommissionPayrollClosedPayments,
        PayrollCommissionDriverReducers.onDriverCommissionPayrollClosedPayments
    ),
    on(
        PayrollCommissionDriverActions.driverCommissionPayrollClosedPaymentsSuccess,
        PayrollCommissionDriverReducers.onDriverCommissionPayrollClosedPaymentsSuccess
    ),
    on(
        PayrollCommissionDriverActions.driverCommissionPayrollClosedPaymentsError,
        PayrollCommissionDriverReducers.onDriverCommissionPayrollClosedPaymentsError
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

    /*
        PAYROLL DRIVER BY OWNER REDUCERS
    */
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverList,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverList
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverListSuccess,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverListSuccess
    ),
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverListError,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverListError
    ),

    // OPEN OWNER REPORT
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
        PayrollOwnerDriverActions.getPayrollOwnerDriverCollapsedListError,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverCollapsedListError
    ),

    // CLOSED OWNER REPORT
    on(
        PayrollOwnerDriverActions.getPayrollOwnerDriverClosedReportPayrollSuccess,
        PayrollOwnerDriverReducers.onGetPayrollOwnerDriverClosedPayrollSuccess
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

    // CLOSE OWNER PAYMENT
    on(
        PayrollOwnerDriverActions.driverOwnerPayrollClosedPayments,
        PayrollOwnerDriverReducers.onDriverOwnerPayrollClosedPayments
    ),
    on(
        PayrollOwnerDriverActions.driverOwnerPayrollClosedPaymentsSuccess,
        PayrollOwnerDriverReducers.onDriverOwnerPayrollClosedPaymentsSuccess
    ),
    on(
        PayrollOwnerDriverActions.driverOwnerPayrollClosedPaymentsError,
        PayrollOwnerDriverReducers.onDriverOwnerPayrollClosedPaymentsError
    ),

    /*
        PAYROLL DRIVER BY FLAT RATE REDUCERS
    */
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriver,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriver
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverSuccess,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverSuccess
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateDriverError,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverError
    ),

    // OPEN FLAT RATE REPORT
    on(
        PayrollFlatRateActions.getPayrollFlatRateReportDriver,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateReportDriver
    ),
    on(
        PayrollFlatRateActions.getPayrollFlatRateReportDriverSuccess,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateReportDriverSuccess
    ),

    // CLOSED FLAT RATE REPORT
    on(
        PayrollFlatRateActions.getPayrollFlatRateReportDriverClosedPayrollSuccess,
        PayrollFlatRateDriverReducers.onGetPayrollFlatRateDriverClosedPayrollSuccess
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

    // OWNER FLAT RATE LIST REDUCERS
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
    ),

    // CLOSE FLAT RATE PAYMENT
    on(
        PayrollFlatRateActions.driverFlatRatePayrollClosedPayments,
        PayrollFlatRateDriverReducers.onDriverFlatRatePayrollClosedPayments
    ),
    on(
        PayrollFlatRateActions.driverFlatRatePayrollClosedPaymentsSuccess,
        PayrollFlatRateDriverReducers.onDriverFlatRatePayrollClosedPaymentsSuccess
    ),
    on(
        PayrollFlatRateActions.driverFlatRatePayrollClosedPaymentsError,
        PayrollFlatRateDriverReducers.onDriverFlatRatePayrollClosedPaymentsError
    )
);
