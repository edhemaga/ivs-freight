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
import { PayrollDeductionService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-deduction-modal/services/payroll-deduction.service';
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

// Enums
import { ePayrollString } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Components
import { PayrollBaseModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-base-modal/payroll-base-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';

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
    public taModalActionEnum = TaModalActionEnum;
    private destroy$ = new Subject<void>();
    @Input() editData: PayrollModal;
    public deduction: PayrollDeductionResponse;
    public formLoaded: boolean = false;
    public isLimited: boolean = false;
    private preselectedDriver: boolean;

    constructor(
        private fb: FormBuilder,
        private payrollDeductionService: PayrollDeductionService,
        private ngbActiveModal: NgbActiveModal,
        private payrollService: PayrollService
    ) { }

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
            [ePayrollString.DRIVER_ID]: [data?.driverId ?? null],
            [ePayrollString.TRUCK_ID]: [data?.truckId ?? null],
            [ePayrollString.SELECTED_DRIVER_ID]: [data?.driverId ?? null],
            [ePayrollString.SELECTED_TRUCK_ID]: [data?.truckId ?? null],
            [ePayrollString.SELECTED_TYPE_ID]: [creditType],
            [ePayrollString.DATE]: [
                MethodsCalculationsHelper.convertDateFromBackend(data.date) ??
                new Date(),
                Validators.required,
            ],
            [ePayrollString.DESCRIPTION]: [
                data.description ?? null,
                Validators.required,
            ],
            [ePayrollString.AMOUNT]: [
                data.amount ?? null,
                Validators.required,
            ],
            [ePayrollString.RECURRING]: [
                !!this.editData?.data?.recurringType?.name,
            ],
            [ePayrollString.RECURRING_TYPE]: [recurringType],
            [ePayrollString.LIMITED]: [
                (!!data.limitedNumber || !!data.limitedAmount) ?? null,
            ],
            [ePayrollString.LIMITED_NUMBER]: [data.limitedNumber ?? null],
            [ePayrollString.LIMITED_AMOUNT]: [data.limitedAmount ?? null],
        });

        this.setRequiredFields();
        this.formLoaded = true;
        if (data.driverId) this.preselectedDriver = true;
    }

    private setRequiredFields(): void {
        this.payrollCreditForm
            .get(ePayrollString.LIMITED)
            ?.valueChanges.subscribe((isLimited) => {
                const limitedNumberControl = this.payrollCreditForm.get(
                    ePayrollString.LIMITED_NUMBER
                );
                const limitedAmountControl = this.payrollCreditForm.get(
                    ePayrollString.LIMITED_AMOUNT
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
            ePayrollString.RECURRING
        ).value;
        return {
            type: this.payrollCreditForm.get(ePayrollString.SELECTED_TYPE_ID)
                .value,
            recurringType: isRecurring
                ? this.payrollCreditForm.get(ePayrollString.RECURRING_TYPE)
                    .value
                : null,
            driverId: this.payrollCreditForm.get(
                ePayrollString.SELECTED_DRIVER_ID
            ).value,
            truckId: this.payrollCreditForm.get(
                ePayrollString.SELECTED_TRUCK_ID
            ).value,
            description: this.payrollCreditForm.get(
                ePayrollString.DESCRIPTION
            ).value,
            date: MethodsCalculationsHelper.convertDateToBackend(
                this.payrollCreditForm.get(ePayrollString.DATE).value
            ),
            amount: MethodsCalculationsHelper.convertThousandSepInNumber(
                this.payrollCreditForm.get(ePayrollString.AMOUNT).value
            ),
            recurring: isRecurring,
            limited: this.payrollCreditForm.get(ePayrollString.LIMITED)
                .value,
            limitedAmount: isRecurring
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                    this.payrollCreditForm.get(
                        ePayrollString.LIMITED_AMOUNT
                    ).value
                )
                : null,
            limitedNumber: isRecurring
                ? this.payrollCreditForm.get(ePayrollString.LIMITED_NUMBER)
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
            action === TaModalActionEnum.SAVE ||
            action === TaModalActionEnum.SAVE_AND_ADD_NEW;
        const data = this.generateModel();

        if (addNew) {
            this.payrollDeductionService
                .addPayrollDeduction(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    if (action === TaModalActionEnum.SAVE_AND_ADD_NEW) {
                        this.payrollService.saveAndAddNew(
                            PayrollDeductionModalComponent,
                            this.preselectedDriver,
                            data.driverId,
                            this.ngbActiveModal
                        );
                    } else {
                        this.onCloseModal();
                    }
                });
        } else if (action === TaModalActionEnum.UPDATE) {
            this.payrollDeductionService
                .updatePayrollDeduction({ ...data, id: this.editData.data.id })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnum.MOVE_TO_THIS_PERIOD) {
            this.payrollDeductionService
                .moveDeduction(this.editData.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnum.DELETE) {
            const label = this.deduction.driver
                ? `${this.deduction.driver.firstName} ${this.deduction.driver.lastName}`
                : this.deduction.truck.owner;
            this.payrollService.raiseDeleteModal(
                TableStringEnum.DEDUCTION,
                ConfirmationModalStringEnum.DELETE_DEDUCTION,
                this.editData.data.id,
                {
                    title: this.deduction.description,
                    subtitle: this.deduction.amount,
                    date: this.deduction.date,
                    label: `${label}`,
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
        if (this.deduction.limited) {
            return `$${MethodsCalculationsHelper.convertNumberInThousandSep(
                Number(this.deduction.limitedAmount.toFixed(2))
            )}`;
        }

        return `$${MethodsCalculationsHelper.convertNumberInThousandSep(
            Number(this.deduction.amount.toFixed(2))
        )}`;
    }

    public formatDate(date: string): string {
        return MethodsCalculationsHelper.convertDateFromBackend(date);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
