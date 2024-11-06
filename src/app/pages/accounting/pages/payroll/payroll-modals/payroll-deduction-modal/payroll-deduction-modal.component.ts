import { Component, Input, OnInit } from '@angular/core';
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
    PayrollCreditType,
    PayrollDeductionRecurringType,
} from 'appcoretruckassist';
import { PayrollActionType } from '@pages/accounting/pages/payroll/state/models';

// Services
import { PayrollDeductionService } from './services/payroll-deduction.service';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Components
import { PayrollBaseModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-base-modal/payroll-base-modal.component';
import { PayrollModal } from '../../state/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    public taModalActionEnums = TaModalActionEnums;
    @Input() editData: PayrollModal;

    constructor(
        private fb: FormBuilder,
        private payrollDeductionService: PayrollDeductionService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        const data = this.editData ? this.editData.data : {};
        const creditType =
            this.editData?.creditType || PayrollCreditType.Driver;

        this.payrollCreditForm = this.fb.group({
            [PayrollStringEnum.DRIVER_ID]: [data?.driverId ?? null],
            [PayrollStringEnum.TRUCK_ID]: [data?.truckId ?? null],
            [PayrollStringEnum.SELECTED_DRIVER_ID]: [data?.driverId ?? null],
            [PayrollStringEnum.SELECTED_TRUCK_ID]: [data?.truckId ?? null],
            [PayrollStringEnum.SELECTED_TYPE_ID]: [creditType],
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

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    public get isDropdownEnabled(): boolean {
        return true;
    }

    public saveDeduction(action: PayrollActionType): void {
        const addNew =
            action === TaModalActionEnums.SAVE ||
            action === TaModalActionEnums.SAVE_AND_ADD_NEW;
        const data = this.generateModel();

        if (addNew) {
            this.payrollDeductionService
                .addPayrollDeduction(data)
                .subscribe(() => {
                    if (action === TaModalActionEnums.SAVE_AND_ADD_NEW) {
                        this.createForm();
                    } else {
                        this.onCloseModal();
                    }
                });
        }
    }
}
