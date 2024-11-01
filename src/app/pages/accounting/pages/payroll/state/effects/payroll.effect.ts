import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { PayrollService } from '../../services/payroll.service';

// Effects
import * as PayrollMileageDriverEffects from './payroll_effects/driver_mileage.effects';
import * as PayrollMainEffects from './payroll_effects/payroll_main.effects';
import * as PayrollCommissionDriverEffect from './payroll_effects/driver_commission.effects';
import * as PayrollOwnerDriverEffect from './payroll_effects/driver_owner.effect';
import * as PayrollFlatRateEffect from './payroll_effects/driver_flat_rate.effects';

@Injectable()
export class PayrollEffect {
    constructor(
        private actions$: Actions,
        private payrollService: PayrollService
    ) {}

    // Payroll Main Effects
    public getPayrollCounts$ = PayrollMainEffects.getPayrollCountsEffect(
        this.actions$,
        this.payrollService
    );

    // Payroll Driver Mileage Effects

    public getPayrollMileageClosedPayrollById$ =
        PayrollMileageDriverEffects.getPayrollMileageClosedPayrollByIdEffect(
            this.actions$,
            this.payrollService
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
            this.payrollService
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
            this.payrollService
        );

    public getPayrollCommissionClosedPayrollReportByIdEffect$ =
        PayrollCommissionDriverEffect.getPayrollCommissionClosedPayrollReportByIdEffect(
            this.actions$,
            this.payrollService
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

    // Payroll Owner Driver
    public getPayrollOwnerDriverListEffect$ =
        PayrollOwnerDriverEffect.getPayrollOwnerDriverListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollOwnerClosedPayrollReportByIdEffect$ =
        PayrollOwnerDriverEffect.getPayrollOwnerClosedPayrollReportByIdEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollOwnerDriverReportEffect$ =
        PayrollOwnerDriverEffect.getPayrollOwnerReportEffect(
            this.actions$,
            this.payrollService
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

    // Payroll Flat List Driver
    public getPayrollFlatRateDriverListEffect$ =
        PayrollFlatRateEffect.getPayrollFlatRateDriverListEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollFlatRateClosedPayrollReportByIdEffect$ =
        PayrollFlatRateEffect.getPayrollFlatRateClosedPayrollReportByIdEffect(
            this.actions$,
            this.payrollService
        );

    public getPayrollFlatRateDriverReportEffect$ =
        PayrollFlatRateEffect.getPayrollFlatRateReportEffect(
            this.actions$,
            this.payrollService
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
}
