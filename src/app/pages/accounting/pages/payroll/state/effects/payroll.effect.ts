import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

// Services
import { PayrollService } from '@pages/accounting/pages/payroll/services';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';

// Effects
import * as PayrollMileageDriverEffects from '@pages/accounting/pages/payroll/state/effects/payroll-effects/driver-mileage.effects';
import * as PayrollMainEffects from '@pages/accounting/pages/payroll/state/effects/payroll-effects/payroll-main.effects';
import * as PayrollCommissionDriverEffect from '@pages/accounting/pages/payroll/state/effects/payroll-effects/driver-commission.effects';
import * as PayrollOwnerDriverEffect from '@pages/accounting/pages/payroll/state/effects/payroll-effects/driver-owner.effect';
import * as PayrollFlatRateEffect from '@pages/accounting/pages/payroll/state/effects/payroll-effects/driver-flat-rate.effects';

@Injectable()
export class PayrollEffect {
    constructor(
        private actions$: Actions,
        private payrollService: PayrollService,
        private payrollFacadeService: PayrollFacadeService,
    ) {}

    // Payroll Main Effects
    public getPayrollCounts$ = PayrollMainEffects.getPayrollCountsEffect(
        this.actions$,
        this.payrollService
    );

    // Payroll Map Data Effects
    public getPayrollMapData$ = PayrollMainEffects.getPayrollMapDataEffect(
        this.actions$,
        this.payrollService
    );

    // Payroll Driver Mileage Effects

    public getPayrollMileageClosedPayrollById$ =
        PayrollMileageDriverEffects.getPayrollMileageClosedPayrollByIdEffect(
            this.actions$,
            this.payrollService,
            this.payrollFacadeService
        );

    public getPayrollMileageDriverExpandedList$ =
        PayrollMileageDriverEffects.getPayrollMileageDriverExpandedListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollMileageDriverCollapsedList$ =
        PayrollMileageDriverEffects.getPayrollMileageDriverCollapsedListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollSoloMileageReport$ =
        PayrollMileageDriverEffects.getPayrollSoloMileageReportEffect(
            this.actions$,
            this.payrollService,
            this.payrollFacadeService
        );

    public closePayrollSoloMileageReport$ =
        PayrollMileageDriverEffects.closePayrollSoloMileageReportEffect(
            this.actions$,
            this.payrollService
        );

    public addPayrollMileageClosedPayrollPayment =
        PayrollMileageDriverEffects.addPayrollMileageClosedPayrollPaymentEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollSoloMileage$ =
        PayrollMileageDriverEffects.getPayrollSoloMileageEffect(
            this.actions$,
            this.payrollService
        );

    // Payroll Commission Driver

    public getPayrollCommissionDriverListEffect$ =
        PayrollCommissionDriverEffect.getPayrollCommissionDriverListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollCommissionDriverReportEffect$ =
        PayrollCommissionDriverEffect.getPayrollCommissionReportEffect(
            this.actions$,
            this.payrollService,
            this.payrollFacadeService
        );

    public getPayrollCommissionClosedPayrollReportByIdEffect$ =
        PayrollCommissionDriverEffect.getPayrollCommissionClosedPayrollReportByIdEffect(
            this.actions$,
            this.payrollService,
            this.payrollFacadeService
        );

    public closePayrollCommissionReport$ =
        PayrollCommissionDriverEffect.closePayrollCommissionReportEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollCommissionDriverExpandedList$ =
        PayrollCommissionDriverEffect.getPayrollCommissionDriverExpandedListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollCommissionDriverCollapsedList$ =
        PayrollCommissionDriverEffect.getPayrollCommissionDriverCollapsedListEffect(
            this.actions$,
            this.payrollService
        );

    public addPayrollCommissionClosedPayrollPayment =
        PayrollCommissionDriverEffect.addPayrollCommissionClosedPayrollPaymentEffect(
            this.actions$,
            this.payrollService
        );

    // Payroll Owner Driver
    public getPayrollOwnerDriverListEffect$ =
        PayrollOwnerDriverEffect.getPayrollOwnerDriverListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollOwnerClosedPayrollReportByIdEffect$ =
        PayrollOwnerDriverEffect.getPayrollOwnerClosedPayrollReportByIdEffect(
            this.actions$,
            this.payrollService,
            this.payrollFacadeService
        );

    public getPayrollOwnerDriverReportEffect$ =
        PayrollOwnerDriverEffect.getPayrollOwnerReportEffect(
            this.actions$,
            this.payrollService,
            this.payrollFacadeService
        );
    public closePayrollOwnerReport$ =
        PayrollOwnerDriverEffect.closePayrollOwnerReportEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollOwnerDriverExpandedList$ =
        PayrollOwnerDriverEffect.getPayrollOwnerDriverExpandedListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollOwnerDriverCollapsedList$ =
        PayrollOwnerDriverEffect.getPayrollOwnerDriverCollapsedListEffect(
            this.actions$,
            this.payrollService
        );

    public addPayrollOwnerClosedPayrollPayment =
        PayrollOwnerDriverEffect.addPayrollOwnerClosedPayrollPaymentEffect(
            this.actions$,
            this.payrollService
        );

    // Payroll Flat List Driver
    public getPayrollFlatRateDriverListEffect$ =
        PayrollFlatRateEffect.getPayrollFlatRateDriverListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollFlatRateClosedPayrollReportByIdEffect$ =
        PayrollFlatRateEffect.getPayrollFlatRateClosedPayrollReportByIdEffect(
            this.actions$,
            this.payrollService,
            this.payrollFacadeService
        );

    public getPayrollFlatRateDriverReportEffect$ =
        PayrollFlatRateEffect.getPayrollFlatRateReportEffect(
            this.actions$,
            this.payrollService,
            this.payrollFacadeService
        );

    public closePayrollFlatRateReport$ =
        PayrollFlatRateEffect.closePayrollFlatRateReportEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollFlatRateDriverExpandedList$ =
        PayrollFlatRateEffect.getPayrollFlatRateDriverExpandedListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollFlatRateDriverCollapsedList$ =
        PayrollFlatRateEffect.getPayrollFlatRateDriverCollapsedListEffect(
            this.actions$,
            this.payrollService
        );

    public addPayrollFlatRateClosedPayrollPayment =
        PayrollFlatRateEffect.addPayrollFlatRateClosedPayrollPaymentEffect(
            this.actions$,
            this.payrollService
        );
}
