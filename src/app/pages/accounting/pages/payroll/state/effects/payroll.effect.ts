import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// Services
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

// Effects
import * as PayrollMileageDriverEffects from '@pages/accounting/pages/payroll/state/effects/payroll_effects/driver_mileage.effects';
import * as PayrollMainEffects from '@pages/accounting/pages/payroll/state/effects/payroll_effects/payroll_main.effects';
import * as PayrollCommissionDriverEffect from '@pages/accounting/pages/payroll/state/effects/payroll_effects/driver_commission.effects';
import * as PayrollOwnerDriverEffect from '@pages/accounting/pages/payroll/state/effects/payroll_effects/driver_owner.effect';
import * as PayrollFlatRateEffect from '@pages/accounting/pages/payroll/state/effects/payroll_effects/driver_flat_rate.effects';

@Injectable()
export class PayrollEffect {
    constructor(
        private actions$: Actions,
        private payrollService: PayrollService,
        private store: Store
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
            this.payrollService,
            this.store
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
            this.store
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
            this.payrollService
        );

    public getPayrollOwnerDriverReportEffect$ =
        PayrollOwnerDriverEffect.getPayrollOwnerReportEffect(
            this.actions$,
            this.payrollService,
            this.store
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
            this.payrollService
        );

    public getPayrollFlatRateDriverReportEffect$ =
        PayrollFlatRateEffect.getPayrollFlatRateReportEffect(
            this.actions$,
            this.payrollService,
            this.store
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
