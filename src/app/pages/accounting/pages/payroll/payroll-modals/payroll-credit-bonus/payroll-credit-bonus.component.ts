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
import { Subject, takeUntil } from 'rxjs';

// Services
import { PayrollCreditService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/services/payroll-credit.service';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';
import { PayrollService as PayrollInternalService } from '../../services/payroll.service';

// Models
import {
    PayrollActionType,
    PayrollModal,
} from '@pages/accounting/pages/payroll/state/models';
import {
    CreatePayrollCreditCommand,
    PayrollCreditResponse,
    PayrollCreditType,
    PayrollService,
} from 'appcoretruckassist';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';

// Components
import { PayrollBaseModalComponent } from '@pages/accounting/pages/payroll/payroll-modals/payroll-base-modal/payroll-base-modal.component';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

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
    public formLoaded: boolean;
    private credit: PayrollCreditResponse;

    constructor(
        private payrolCreditService: PayrollCreditService,
        private payrollService: PayrollService,
        private payrollInternalService: PayrollInternalService,
        private ngbActiveModal: NgbActiveModal,
        private formBuilder: UntypedFormBuilder,
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngOnInit() {
        this.createForm();
    }

    private createForm(): void {
        const data = this.editData ? this.editData.data : {};
        this.getCredit();
        
        const creditType =
            this.editData?.creditType || PayrollCreditType.Driver;

        this.payrollCreditForm = this.formBuilder.group({
            [PayrollStringEnum.DRIVER_ID]: [data?.driverId ?? null],
            [PayrollStringEnum.TRUCK_ID]: [data?.truckId ?? null],
            [PayrollStringEnum.DATE]: [
                data.date ?? new Date(),
                Validators.required,
            ],
            [PayrollStringEnum.DESCRIPTION]: [
                data.description ?? null,
                Validators.required,
            ],
            [PayrollStringEnum.AMOUNT]: [
                data.subtotal ?? null,
                Validators.required,
            ],
            [PayrollStringEnum.SELECTED_DRIVER_ID]: [data?.driverId ?? null],
            [PayrollStringEnum.SELECTED_TRUCK_ID]: [data?.truckId ?? null],
            [PayrollStringEnum.SELECTED_TYPE_ID]: [creditType],
        });
        this.formLoaded = true;
    }

    public getCredit(): void {
        if (this.editData?.data?.id) {
            this.payrollService
                .apiPayrollCreditIdGet(this.editData?.data?.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((credit) => (this.credit = credit));
        }
    }

    public get isEditMode(): boolean {
        return !!this.editData?.edit;
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
                        this.payrollFacadeService.resetForm();
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
                .updatePayrollCredit({ ...data, id: this.editData.data.id })
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnums.MOVE_TO_THIS_PERIOD) {
            this.payrolCreditService
                .movePayrollCredit(this.editData.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnums.DELETE) {
            this.payrollInternalService.raiseDeleteModal(
                TableStringEnum.CREDIT,
                ConfirmationModalStringEnum.DELETE_CREDIT,
                this.editData.data.id,
                {
                    title: this.credit.description,
                    subtitle: this.credit.amount,
                    date: this.credit.date,
                    label: `${this.credit.driver.firstName} ${this.credit.driver.lastName}`,
                    id: this.credit.id
                }
            );
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
