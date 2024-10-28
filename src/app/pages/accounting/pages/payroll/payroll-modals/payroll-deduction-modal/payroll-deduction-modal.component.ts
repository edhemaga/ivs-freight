import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Models
import {
    CreatePayrollDeductionCommand,
    PayrollDeductionRecurringType,
    PayrollDeductionType,
} from 'appcoretruckassist';

// Services
import { PayrollDeductionService } from './services/payroll-deduction.service';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Components
import { PayrollBaseModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-base-modal/payroll-base-modal.component';

@Component({
    selector: 'app-payroll-deduction-modal',
    templateUrl: './payroll-deduction-modal.component.html',
    styleUrls: ['./payroll-deduction-modal.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        PayrollBaseModalComponent,
    ],
})
export class PayrollDeductionModalComponent implements OnInit {
    public payrollCreditForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private payrollDeductionService: PayrollDeductionService
    ) {}

    ngOnInit(): void {
        this.payrollCreditForm = this.fb.group({
            [PayrollStringEnum.DRIVER_ID]: [null, Validators.required],
            [PayrollStringEnum.TRUCK_ID]: [null],
            [PayrollStringEnum.SELECTED_DRIVER_ID]: [null],
            [PayrollStringEnum.SELECTED_TRUCK_ID]: [null],
            [PayrollStringEnum.SELECTED_TYPE_ID]: [PayrollDeductionType.Driver],
            [PayrollStringEnum.DATE]: [new Date(), Validators.required],
            [PayrollStringEnum.DESCRIPTION]: [null, Validators.required],
            [PayrollStringEnum.AMOUNT]: [null, Validators.required],
            [PayrollStringEnum.RECURRING]: [false],
            [PayrollStringEnum.RECURRING_TYPE]: [
                PayrollDeductionRecurringType.Weekly,
            ],
            [PayrollStringEnum.LIMITED]: [false],
            [PayrollStringEnum.LIMITED_NUMBER]: [null],
            [PayrollStringEnum.LIMITED_AMOUNT]: [null],
        });
    }

    private generateModel(): CreatePayrollDeductionCommand {
        return {
            type: this.payrollCreditForm.get(PayrollStringEnum.SELECTED_TYPE_ID)
                .value,
            recurringType: this.payrollCreditForm.get(
                PayrollStringEnum.RECURRING_TYPE
            ).value,
            driverId: this.payrollCreditForm.get(
                PayrollStringEnum.SELECTED_DRIVER_ID
            ).value,
            truckId: this.payrollCreditForm.get(
                PayrollStringEnum.SELECTED_TRUCK_ID
            ).value,
            description: this.payrollCreditForm.get(
                PayrollStringEnum.DESCRIPTION
            ).value,
            date: MethodsCalculationsHelper.convertDateToBackend(
                this.payrollCreditForm.get(PayrollStringEnum.DATE).value
            ),
            amount: MethodsCalculationsHelper.convertThousanSepInNumber(
                this.payrollCreditForm.get(PayrollStringEnum.AMOUNT).value
            ),
            recurring: this.payrollCreditForm.get(PayrollStringEnum.RECURRING)
                .value,
            limited: this.payrollCreditForm.get(PayrollStringEnum.LIMITED)
                .value,
            limitedAmount: this.payrollCreditForm.get(
                PayrollStringEnum.LIMITED_AMOUNT
            ).value,
            limitedNumber: this.payrollCreditForm.get(
                PayrollStringEnum.LIMITED_NUMBER
            ).value,
        };
    }

    public createNewDeduction(): void {
        this.payrollDeductionService
            .addPayrollDeduction(this.generateModel())
            .subscribe((response) => {
                console.log(response);
            });
    }
}
