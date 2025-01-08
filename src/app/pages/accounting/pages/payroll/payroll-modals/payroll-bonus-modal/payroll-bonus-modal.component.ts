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
import {
    CreatePayrollBonusCommand,
} from 'appcoretruckassist';

// Services
import { PayrollBonusService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-bonus-modal/services/payroll-bonus.service';
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

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
    private preselectedDriver: boolean;

    @Input() editData: PayrollModal;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private payrollBonusService: PayrollBonusService,
        private ngbActiveModal: NgbActiveModal,
        private payrollService: PayrollService
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
                MethodsCalculationsHelper.convertDateFromBackend(data.date) ??
                    new Date(),
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

        if (data.driverId) this.preselectedDriver = true;
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
                    this.payrollService.saveAndAddNew(PayrollBonusModalComponent, this.preselectedDriver, data.driverId, this.ngbActiveModal);
                } else {
                    this.onCloseModal();
                }
            });
        } else if (action === TaModalActionEnums.UPDATE) {
            this.payrollBonusService
                .updatePayrollBonus({ ...data, id: this.editData.data.id })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.onCloseModal());
        } else if (action === TaModalActionEnums.DELETE) {
            const label = this.editData.data.driver
                ? `${this.editData.data.driver.firstName} ${this.editData.data.driver.lastName}`
                : this.editData.data.truck.owner;
            this.payrollService.raiseDeleteModal(
                TableStringEnum.BONUS,
                ConfirmationModalStringEnum.DELETE_BONUS,
                this.editData.data.id,
                {
                    title: this.editData.data.description,
                    subtitle: this.editData.data.amount,
                    date: this.editData.data.date,
                    label: `${label}`,
                    id: this.editData.data.id,
                }
            );
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
