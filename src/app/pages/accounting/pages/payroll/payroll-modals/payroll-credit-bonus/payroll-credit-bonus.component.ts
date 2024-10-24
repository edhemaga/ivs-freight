import { Component, Input, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Subject } from 'rxjs';

// Services
import { PayrollCreditService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/services/payroll-credit.service';

// Models
import {
    PayrollActionType,
    PayrollModal,
} from '@pages/accounting/pages/payroll/state/models';
import {
    CreatePayrollCreditCommand,
    PayrollService,
} from 'appcoretruckassist';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';

// Components
import { PayrollBaseModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-base-modal/payroll-base-modal.component';

@Component({
    selector: 'app-payroll-credit-bonus',
    templateUrl: './payroll-credit-bonus.component.html',
    styleUrls: ['./payroll-credit-bonus.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        PayrollBaseModalComponent,
    ],
})
export class PayrollCreditBonusComponent implements OnInit {
    // Inputs
    @Input() editData: PayrollModal;

    // Utils
    public taModalActionEnums = TaModalActionEnums;

    private destroy$ = new Subject<void>();

    // Form
    public payrollCreditForm: UntypedFormGroup;

    constructor(
        private payrolCreditService: PayrollCreditService,
        private payrollService: PayrollService,
        private ngbActiveModal: NgbActiveModal,
        private formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.createForm();
    }

    private createForm(): void {
        this.payrollCreditForm = this.formBuilder.group({
            [PayrollStringEnum.DRIVER_ID]: [null, Validators.required],
            [PayrollStringEnum.TRUCK_ID]: [null],
            [PayrollStringEnum.DATE]: [new Date(), Validators.required],
            [PayrollStringEnum.DESCRIPTION]: [null, Validators.required],
            [PayrollStringEnum.AMOUNT]: [null, Validators.required],
            [PayrollStringEnum.SELECTED_DRIVER_ID]: [null],
            [PayrollStringEnum.SELECTED_TRUCK_ID]: [null],
            [PayrollStringEnum.SELECTED_TYPE_ID]: ['Driver'],
        });
    }

    public get isEditMode(): boolean {
        return !!this.editData?.editCredit;
    }

    public get isDropdownEnabled(): boolean {
        return true;
    }

    public get modalTitle(): string {
        if (this.isEditMode) return PayrollStringEnum.EDIT_CREDIT;

        return PayrollStringEnum.ADD_CREDIT;
    }

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    public saveCredit(action: PayrollActionType): void {
        const addNew =
            action === TaModalActionEnums.SAVE ||
            action === TaModalActionEnums.SAVE_AND_ADD_NEW;

        if (addNew) {
            // Don't clear if we have preselected driver or truck
            const data = this.generateCreditModel();
            this.payrolCreditService.addPayrollCredit(data).subscribe(() => {
                if (action === TaModalActionEnums.SAVE_AND_ADD_NEW) {
                    if (this.isDropdownEnabled) {
                        // TODO: CHECK THIS, validators stays here all the time
                        this.createForm();
                        // this.selectDriver('');
                        // this.selectTruck('');
                    } else {
                        this.payrollCreditForm
                            .get(PayrollStringEnum.DATE)
                            .patchValue(null);
                        this.payrollCreditForm
                            .get(PayrollStringEnum.AMOUNT)
                            .patchValue(null);
                        this.payrollCreditForm
                            .get(PayrollStringEnum.DESCRIPTION)
                            .patchValue(null);
                    }
                } else {
                    this.onCloseModal();
                }
            });
        } else if (action === TaModalActionEnums.UPDATE) {
            const data = this.generateCreditModel();
            this.payrolCreditService
                .updatePayrollCredit(data)
                .subscribe((response) => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnums.MOVE_TO_THIS_PERIOD) {
            this.payrollService
                .apiPayrollBonusMoveIdPut(this.editData.editCredit.id)
                .subscribe((response) => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnums.DELETE) {
            this.payrolCreditService
                .deletePayrollCreditById(this.editData.editCredit.id)
                .subscribe((res) => {
                    this.onCloseModal();
                });
        }
    }

    private generateCreditModel(): CreatePayrollCreditCommand {
        return {
            type: this.payrollCreditForm.get(PayrollStringEnum.SELECTED_TYPE_ID)
                .value,
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
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
