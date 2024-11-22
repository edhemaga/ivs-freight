import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

// Models
import {
    CreatePayrollDeductionCommand,
    PayrollCreditType,
    PayrollDeductionRecurringType,
    PayrollDeductionResponse,
} from 'appcoretruckassist';
import {
    PayrollActionType,
    PayrollModal,
} from '@pages/accounting/pages/payroll/state/models';

// Services
import { PayrollDeductionService } from './services/payroll-deduction.service';
import { PayrollService } from '../../services/payroll.service';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Components
import { PayrollBaseModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-base-modal/payroll-base-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

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
        TaCustomCardComponent,
    ],
})
export class PayrollDeductionModalComponent implements OnInit {
    public payrollCreditForm: FormGroup;
    public taModalActionEnums = TaModalActionEnums;
    private destroy$ = new Subject<void>();
    @Input() editData: PayrollModal;
    public deduction: PayrollDeductionResponse;
    public formLoaded: boolean = false;
    public isLimited: boolean = false;

    constructor(
        private fb: FormBuilder,
        private payrollDeductionService: PayrollDeductionService,
        private ngbActiveModal: NgbActiveModal,
        private payrollService: PayrollService
    ) {}

    ngOnInit(): void {
        this.generateDeduction();
    }

    private generateDeduction(): void {
        if (this.editData?.data?.id) {
            this.payrollDeductionService
                .getPayrollDeductionById(this.editData.data.id)
                .subscribe((deduction) => {
                    this.isLimited =
                        deduction?.childPayrollDeductions[0]?.limited;

                    this.deduction = deduction;
                    this.editData = {
                        ...this.editData,
                        data: {
                            ...deduction,
                            driverId: deduction.driver?.id,
                            truckId: deduction.truck?.id,
                        },
                    };
                    this.createForm();
                });
        } else {
            this.createForm();
        }
    }

    private createForm() {
        const data = this.editData ? this.editData.data : {};
        const creditType =
            this.editData?.creditType || PayrollCreditType.Driver;
        const recurringType =
            this.editData?.data?.recurringType?.name ||
            PayrollDeductionRecurringType.Weekly;

        this.payrollCreditForm = this.fb.group({
            [PayrollStringEnum.DRIVER_ID]: [data?.driverId ?? null],
            [PayrollStringEnum.TRUCK_ID]: [data?.truckId ?? null],
            [PayrollStringEnum.SELECTED_DRIVER_ID]: [data?.driverId ?? null],
            [PayrollStringEnum.SELECTED_TRUCK_ID]: [data?.truckId ?? null],
            [PayrollStringEnum.SELECTED_TYPE_ID]: [creditType],
            [PayrollStringEnum.DATE]: [
                data.date ?? new Date(),
                Validators.required,
            ],
            [PayrollStringEnum.DESCRIPTION]: [
                data.description ?? null,
                Validators.required,
            ],
            [PayrollStringEnum.AMOUNT]: [
                data.amount ?? null,
                Validators.required,
            ],
            [PayrollStringEnum.RECURRING]: [
                !!this.editData?.data?.recurringType?.name,
            ],
            [PayrollStringEnum.RECURRING_TYPE]: [recurringType],
            [PayrollStringEnum.LIMITED]: [
                (!!data.limitedNumber || !!data.limitedAmount) ?? null,
            ],
            [PayrollStringEnum.LIMITED_NUMBER]: [data.limitedNumber ?? null],
            [PayrollStringEnum.LIMITED_AMOUNT]: [data.limitedAmount ?? null],
        });

        this.setRequiredFields();
        this.formLoaded = true;
    }

    private setRequiredFields(): void {
        this.payrollCreditForm
            .get(PayrollStringEnum.LIMITED)
            ?.valueChanges.subscribe((isLimited) => {
                const limitedNumberControl = this.payrollCreditForm.get(
                    PayrollStringEnum.LIMITED_NUMBER
                );
                const limitedAmountControl = this.payrollCreditForm.get(
                    PayrollStringEnum.LIMITED_AMOUNT
                );

                if (isLimited) {
                    limitedNumberControl?.setValidators([Validators.required]);
                    limitedAmountControl?.setValidators([Validators.required]);
                } else {
                    limitedNumberControl?.clearValidators();
                    limitedNumberControl?.setValue(null);
                    limitedAmountControl?.clearValidators();
                    limitedAmountControl?.setValue(null);
                }

                limitedNumberControl?.updateValueAndValidity();
                limitedAmountControl?.updateValueAndValidity();
            });
    }

    private generateModel(): CreatePayrollDeductionCommand {
        const isRecurring = this.payrollCreditForm.get(
            PayrollStringEnum.RECURRING
        ).value;
        return {
            type: this.payrollCreditForm.get(PayrollStringEnum.SELECTED_TYPE_ID)
                .value,
            recurringType: isRecurring
                ? this.payrollCreditForm.get(PayrollStringEnum.RECURRING_TYPE)
                      .value
                : null,
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
            recurring: isRecurring,
            limited: this.payrollCreditForm.get(PayrollStringEnum.LIMITED)
                .value,
            limitedAmount: isRecurring
                ? MethodsCalculationsHelper.convertThousanSepInNumber(
                      this.payrollCreditForm.get(
                          PayrollStringEnum.LIMITED_AMOUNT
                      ).value
                  )
                : null,
            limitedNumber: isRecurring
                ? this.payrollCreditForm.get(PayrollStringEnum.LIMITED_NUMBER)
                      .value
                : null,
        };
    }

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    public get isDropdownEnabled(): boolean {
        return true;
    }

    public get isEditMode(): boolean {
        return !!this.editData?.edit;
    }

    public saveDeduction(action: PayrollActionType): void {
        const addNew =
            action === TaModalActionEnums.SAVE ||
            action === TaModalActionEnums.SAVE_AND_ADD_NEW;
        const data = this.generateModel();

        if (addNew) {
            this.payrollDeductionService
                .addPayrollDeduction(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    if (action === TaModalActionEnums.SAVE_AND_ADD_NEW) {
                        this.createForm();
                    } else {
                        this.onCloseModal();
                    }
                });
        } else if (action === TaModalActionEnums.UPDATE) {
            this.payrollDeductionService
                .updatePayrollDeduction({ ...data, id: this.editData.data.id })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnums.MOVE_TO_THIS_PERIOD) {
            this.payrollDeductionService
                .moveDeduction(this.editData.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnums.DELETE) {
            this.payrollService.raiseDeleteModal(
                TableStringEnum.DEDUCTION,
                ConfirmationModalStringEnum.DELETE_DEDUCTION,
                this.editData.data.id,
                {
                    title: this.deduction.description,
                    subtitle: this.deduction.amount,
                    date: this.deduction.date,
                    label: `${this.deduction.driver.firstName} ${this.deduction.driver.lastName}`,
                    id: this.deduction.id,
                }
            );
        }
    }

    public calculateRemainingPayment(index: number): string {
        const value =
            this.deduction.amount - index * this.deduction.limitedAmount;
        return `$${parseFloat(
            MethodsCalculationsHelper.convertNumberInThousandSep(value)
        ).toFixed(2)}`;
    }

    public getPaymentString(): string {
        return `$${MethodsCalculationsHelper.convertNumberInThousandSep(
            Number(this.deduction.limitedAmount.toFixed(2))
        )}`;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
