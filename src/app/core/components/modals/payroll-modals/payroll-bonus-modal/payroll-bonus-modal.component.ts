import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    creditLimitValidation,
    descriptionPayrollBonusValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { PayrollBonusService } from '../../../accounting/payroll/payroll/state/payroll-bonus.service';
import { PayrollBonusModalResponse } from '../../../../../../../appcoretruckassist/model/payrollBonusModalResponse';
import { FormService } from '../../../../services/form/form.service';
import { PayrollBonusResponse } from '../../../../../../../appcoretruckassist/model/payrollBonusResponse';
import {
    convertDateFromBackend,
    convertNumberInThousandSep,
} from '../../../../utils/methods.calculations';
import {
    convertDateToBackend,
    convertThousanSepInNumber,
} from '../../../../utils/methods.calculations';

@Component({
    selector: 'app-payroll-bonus-modal',
    templateUrl: './payroll-bonus-modal.component.html',
    styleUrls: ['./payroll-bonus-modal.component.scss'],
})
export class PayrollBonusModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public payrollBonusForm: FormGroup;

    public labelsDriver: any[] = [];
    public selectedDriver: any = null;

    private destroy$ = new Subject<void>();

    public isFormDirty: boolean = false;

    public addNewAfterSave: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private payrollBonusService: PayrollBonusService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        if (
            this.editData?.type === 'edit' ||
            (this.editData?.type === 'new' && this.editData?.data?.id)
        ) {
            this.getByIdBonus(this.editData.data.id);
        }
    }

    private createForm() {
        this.payrollBonusForm = this.formBuilder.group({
            driverId: [null, Validators.required],
            date: [null, Validators.required],
            description: [
                null,
                [Validators.required, ...descriptionPayrollBonusValidation],
            ],
            amount: [null, [Validators.required, ...creditLimitValidation]],
        });

        this.formService.checkFormChange(this.payrollBonusForm, 400);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save and add new': {
                if (this.payrollBonusForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.payrollBonusForm);
                    return;
                }
                this.addBonus();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;
                break;
            }
            case 'save': {
                if (this.payrollBonusForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.payrollBonusForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateBonus(this.editData?.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addBonus();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'driver': {
                this.selectedDriver = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    public addBonus() {
        this.payrollBonusService
            .addPayrollBonus({
                ...this.payrollBonusForm.value,
                driverId: this.selectedDriver.id,
                date: convertDateToBackend(
                    this.payrollBonusForm.get('date').value
                ),
                amount: convertThousanSepInNumber(
                    this.payrollBonusForm.get('amount').value
                ),
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
                        this.formService.resetForm(this.payrollBonusForm);

                        this.selectedDriver = null;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    public updateBonus(id: number) {
        this.payrollBonusService
            .updatePayrollBonus({
                id: id,
                ...this.payrollBonusForm.value,
                driverId: this.selectedDriver.id,
                date: convertDateToBackend(
                    this.payrollBonusForm.get('date').value
                ),
                amount: convertThousanSepInNumber(
                    this.payrollBonusForm.get('amount').value
                ),
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    public getByIdBonus(id: number) {
        this.payrollBonusService
            .getPayrollBonusById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PayrollBonusResponse) => {
                    // If Edit Bonus by Id
                    if (this.editData.type === 'edit') {
                        this.payrollBonusForm.patchValue({
                            driverId: res.driver.firstName.concat(
                                ' ',
                                res.driver.lastName
                            ),
                            date: res.date
                                ? convertDateFromBackend(res.date)
                                : null,
                            description: res.description,
                            amount: convertNumberInThousandSep(res.amount),
                        });
                    }

                    this.selectedDriver = {
                        id: res.driver.id,
                        name: res.driver.firstName.concat(
                            ' ',
                            res.driver.lastName
                        ),
                        logoName:
                            res.driver.avatar === null ||
                            res.driver.avatar === undefined ||
                            res.driver.avatar === ''
                                ? null
                                : res.driver.avatar,
                        isDriver: true,
                    };

                    // If Add New By Id
                    if (
                        this.editData?.data?.id &&
                        this.editData?.type === 'new'
                    ) {
                        this.payrollBonusForm.patchValue({
                            driverId: res.driver.firstName.concat(
                                ' ',
                                res.driver.lastName
                            ),
                        });
                        this.labelsDriver = this.labelsDriver.filter(
                            (item) => item.id === this.selectedDriver.id
                        );
                    }
                },
                error: () => {},
            });
    }

    public getModalDropdowns() {
        this.payrollBonusService
            .getPayrollBonusModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PayrollBonusModalResponse) => {
                    this.labelsDriver = res.drivers.map((item) => {
                        return {
                            id: item.id,
                            name: item.firstName.concat(' ', item.lastName),
                            logoName:
                                item.avatar === null ||
                                item.avatar === undefined ||
                                item.avatar === ''
                                    ? null
                                    : item.avatar,
                            isDriver: true,
                            additionalText: 'Kucas',
                        };
                    });
                },
                error: () => {},
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
