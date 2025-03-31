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
import { PayrollService as PayrollInternalService } from '@pages/accounting/pages/payroll/services';

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
import { ePayrollString } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

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
    public taModalActionEnum = TaModalActionEnum;

    private destroy$ = new Subject<void>();

    // Form
    public payrollCreditForm: UntypedFormGroup;
    public formLoaded: boolean;
    private credit: PayrollCreditResponse;
    private preselectedDriver: boolean;

    constructor(
        private payrolCreditService: PayrollCreditService,
        private payrollService: PayrollService,
        private payrollInternalService: PayrollInternalService,
        private ngbActiveModal: NgbActiveModal,
        private formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
    }

    private createForm(): void {
        const data = this.editData ? this.editData.data : {};
        this.getCredit();

        const creditType =
            this.editData?.creditType || PayrollCreditType.Driver;

        this.payrollCreditForm = this.formBuilder.group({
            [ePayrollString.DRIVER_ID]: [data?.driverId ?? null],
            [ePayrollString.TRUCK_ID]: [data?.truckId ?? null],
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
                data.subtotal ?? null,
                Validators.required,
            ],
            [ePayrollString.SELECTED_DRIVER_ID]: [data?.driverId ?? null],
            [ePayrollString.SELECTED_TRUCK_ID]: [data?.truckId ?? null],
            [ePayrollString.SELECTED_TYPE_ID]: [creditType],
        });
        this.formLoaded = true;
        if (data.driverId) this.preselectedDriver = true;
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
        if (this.isEditMode) return ePayrollString.EDIT_CREDIT;

        return ePayrollString.ADD_CREDIT;
    }

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    public saveCredit(action: PayrollActionType): void {
        const addNew =
            action === TaModalActionEnum.SAVE ||
            action === TaModalActionEnum.SAVE_AND_ADD_NEW;

        if (addNew) {
            // Don't clear if we have preselected driver or truck
            const data = this.generateCreditModel();

            this.payrolCreditService.addPayrollCredit(data).subscribe(() => {
                if (action === TaModalActionEnum.SAVE_AND_ADD_NEW) {
                    if (this.isDropdownEnabled) {
                        this.payrollInternalService.saveAndAddNew(
                            PayrollCreditBonusComponent,
                            this.preselectedDriver,
                            data.driverId,
                            this.ngbActiveModal
                        );
                    } else {
                        this.payrollCreditForm
                            .get(ePayrollString.DATE)
                            .patchValue(null);
                        this.payrollCreditForm
                            .get(ePayrollString.AMOUNT)
                            .patchValue(null);
                        this.payrollCreditForm
                            .get(ePayrollString.DESCRIPTION)
                            .patchValue(null);
                    }
                } else {
                    this.onCloseModal();
                }
            });
        } else if (action === TaModalActionEnum.UPDATE) {
            const data = this.generateCreditModel();
            this.payrolCreditService
                .updatePayrollCredit({ ...data, id: this.editData.data.id })
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnum.MOVE_TO_THIS_PERIOD) {
            this.payrolCreditService
                .movePayrollCredit(this.editData.data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                    this.onCloseModal();
                });
        } else if (action === TaModalActionEnum.DELETE) {
            const label = this.credit.driver
                ? `${this.credit.driver.firstName} ${this.credit.driver.lastName}`
                : this.credit.truck.owner;
            this.payrollInternalService.raiseDeleteModal(
                TableStringEnum.CREDIT,
                ConfirmationModalStringEnum.DELETE_CREDIT,
                this.editData.data.id,
                {
                    title: this.credit.description,
                    subtitle: this.credit.amount,
                    date: this.credit.date,
                    label: `${label}`,
                    id: this.credit.id,
                }
            );
        }
    }

    private generateCreditModel(): CreatePayrollCreditCommand {
        return {
            type: this.payrollCreditForm.get(ePayrollString.SELECTED_TYPE_ID)
                .value,
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
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
