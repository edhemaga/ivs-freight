import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
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
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';

@Component({
    selector: 'app-payroll-bonus-modal',
    templateUrl: './payroll-bonus-modal.component.html',
    styleUrls: ['./payroll-bonus-modal.component.scss'],
    standalone: true,
    imports: [
            CommonModule, 
            FormsModule, 
            TaModalComponent, 
            TaTabSwitchComponent, 
            ReactiveFormsModule, 
            TaInputComponent, 
            TaInputDropdownComponent
    ]
})
export class PayrollBonusModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public payrollBonusForm: UntypedFormGroup;

    public labelsDriver: any[] = [];
    public selectedDriver: any = null;

    private destroy$ = new Subject<void>();

    public isFormDirty: boolean = false;

    public addNewAfterSave: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private payrollBonusService: PayrollBonusService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();

        this.getModalDropdowns();
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

        this.formService.checkFormChange(this.payrollBonusForm);
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
                    this.updateBonus(this.editData?.data?.id);
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
            case 'delete': {
                this.deletePayrollBonusById(this.editData?.data.id);
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
                    close: false,
                });
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
                        this.modalService.setModalSpinner({
                            action: null,
                            status: false,
                            close: false,
                        });
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
                        };
                    });

                    // If Add New By Id
                    if (
                        this.editData?.data?.driverId &&
                        this.editData?.type === 'new'
                    ) {
                        this.labelsDriver = this.labelsDriver.filter(
                            (item) => item.id === this.editData?.data?.driverId
                        );
                        this.selectedDriver = this.labelsDriver[0];
                        this.payrollBonusForm.patchValue({
                            driverId: this.labelsDriver[0].name,
                        });
                    }

                    if (this.editData?.type === 'edit') {
                        this.getByIdBonus(this.editData.data.id);
                    }
                },
                error: () => {},
            });
    }

    public deletePayrollBonusById(id: number) {
        this.payrollBonusService
            .deletePayrollBonusById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: true,
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
