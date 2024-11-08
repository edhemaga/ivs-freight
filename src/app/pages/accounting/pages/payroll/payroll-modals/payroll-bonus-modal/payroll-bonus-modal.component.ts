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

// Components
import { PayrollBaseModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-base-modal/payroll-base-modal.component';

// Models
import {
    PayrollActionType,
    PayrollModal,
} from '@pages/accounting/pages/payroll/state/models';
import { CreatePayrollBonusCommand } from 'appcoretruckassist';

// Services
import { PayrollBonusService } from './services/payroll-bonus.service';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

@Component({
    selector: 'app-payroll-bonus-modal',
    templateUrl: './payroll-bonus-modal.component.html',
    styleUrls: ['./payroll-bonus-modal.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        PayrollBaseModalComponent,
    ],
})
export class PayrollBonusModalComponent implements OnInit {
    public payrollCreditForm: FormGroup;
    public taModalActionEnums = TaModalActionEnums;

    @Input() editData: PayrollModal;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private payrollBonusService: PayrollBonusService,
        private payrollFacadeService: PayrollFacadeService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.generateDeduction();
    }

    private generateDeduction(): void {
        if (this.editData?.data?.id) {
            this.payrollBonusService
                .getPayrollBonusById(this.editData.data.id)
                .subscribe((deduction) => {
                    this.editData = {
                        ...this.editData,
                        data: {
                            ...deduction,
                            driverId: deduction.driver?.id,
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
        this.payrollCreditForm = this.fb.group({
            [PayrollStringEnum.DRIVER_ID]: [data?.driverId ?? null],
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
            [PayrollStringEnum.SELECTED_DRIVER_ID]: [data?.driverId ?? null],
        });
    }

    public get isEditMode(): boolean {
        return !!this.editData?.edit;
    }

    private generateCreditModel(): CreatePayrollBonusCommand {
        return {
            driverId: this.payrollCreditForm.get(
                PayrollStringEnum.SELECTED_DRIVER_ID
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
        };
    }

    public saveBonus(action: PayrollActionType): void {
        const addNew =
            action === TaModalActionEnums.SAVE ||
            action === TaModalActionEnums.SAVE_AND_ADD_NEW;
        const data = this.generateCreditModel();

        if (addNew) {
            this.payrollBonusService.addPayrollBonus(data).subscribe(() => {
                if (action === TaModalActionEnums.SAVE_AND_ADD_NEW) {
                    this.createForm();
                    this.payrollFacadeService.resetForm();
                } else {
                    this.onCloseModal();
                }
            });
        } else if (action === TaModalActionEnums.UPDATE) {
            this.payrollBonusService
                .updatePayrollBonus({ ...data, id: this.editData.data.id })
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnums.MOVE_TO_THIS_PERIOD) {
            this.payrollBonusService
                .movePayrollBonus(this.editData.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnums.DELETE) {
            this.payrollBonusService
                .deletePayrollBonusById(this.editData.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.onCloseModal();
                });
        }
    }
    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
