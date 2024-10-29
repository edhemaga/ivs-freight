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
        PayrollCommissionDriverEffect.getPayrollSoloMileageReportEffect(
            this.actions$,
            this.payrollService
        );

    // Payroll Owner Driver
    public getPayrollOwnerDriverListEffect$ =
        PayrollOwnerDriverEffect.getPayrollOwnerDriverListEffect(
            this.actions$,
            this.payrollService
        );

    // Payroll Flat List Driver
    public getPayrollFlatRateDriverListEffect$ =
        PayrollFlatRateEffect.getPayrollFlatRateDriverListEffect(
            this.actions$,
            this.payrollService
        );
}
