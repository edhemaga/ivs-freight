import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { ITaInput } from '../../../shared/ta-input/ta-input.config';
import { PayrollDeductionService } from '../../../accounting/payroll/payroll/state/payroll-deduction.service';
import { FormService } from '../../../../services/form/form.service';
import { PayrollDeductionModalResponse } from '../../../../../../../appcoretruckassist/model/payrollDeductionModalResponse';
import { PayrollDeductionResponse } from '../../../../../../../appcoretruckassist/model/payrollDeductionResponse';
import {
    convertDateToBackend,
    convertThousanSepInNumber,
} from '../../../../utils/methods.calculations';
import {
    convertDateFromBackend,
    convertNumberInThousandSep,
} from '../../../../utils/methods.calculations';

@Component({
    selector: 'app-payroll-deduction-modal',
    templateUrl: './payroll-deduction-modal.component.html',
    styleUrls: ['./payroll-deduction-modal.component.scss'],
})
export class PayrollDeductionModalComponent implements OnInit {
    @Input() editData: any;

    public payrollDeductionForm: FormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'DRIVER',
            checked: true,
            color: '3074D3',
        },
        {
            id: 2,
            name: 'TRUCK',
            checked: false,
            color: '3074D3',
        },
    ];

    public selectedTab2: number = 3;
    public tabs2: any[] = [
        {
            id: 3,
            name: 'WEEKLY', // 2
            disabled: true,
            color: '3074D3',
        },
        {
            id: 4,
            name: 'MONTHLY', // 1
            disabled: true,
            color: '3074D3',
        },
    ];

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public labelsTrucks: any[] = [];
    public labelsDriver: any[] = [];

    public selectedDriver: any = null;
    public selectedTruck: any = null;

    private destroy$ = new Subject<void>();

    public addNewAfterSave: boolean = false;

    public isFormDirty: boolean = false;

    public truckDropdownsConfig: ITaInput = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Truck',
        isDropdown: true,
        isRequired: true,
        textTransform: 'capitalize',
        blackInput: true,
        dropdownWidthClass: 'w-col-256',
    };

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private payrollDeductionService: PayrollDeductionService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        this.trackReccuringAndLimiting();
        if (this.editData?.type === 'edit') {
            this.getByIdDeduction(this.editData.data.id);
        }
    }

    public tabChange(event: any, action): void {
        switch (action) {
            case 'main-tabs': {
                this.selectedTab = event.id;
                break;
            }
            case 'week-mon-tabs': {
                this.selectedTab2 = event.id;
                break;
            }
            default: {
                break;
            }
        }
    }

    private createForm() {
        this.payrollDeductionForm = this.formBuilder.group({
            driverId: [null, Validators.required],
            truckId: [null],
            date: [null, Validators.required],
            description: [null, Validators.required],
            amount: [null, Validators.required],
            recurring: [false],
            recurringType: [null],
            limited: [false],
            numberOfPayments: [null],
            limitedNumber: [null],
        });

        this.formService.checkFormChange(this.payrollDeductionForm, 400);
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
                if (this.payrollDeductionForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.payrollDeductionForm);
                    return;
                }
                this.addDeduction();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;
                break;
            }
            case 'save': {
                if (this.payrollDeductionForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.payrollDeductionForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateDeduction(this.editData?.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addDeduction();
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

    public updateDeduction(id: number) {
        const recType = this.tabs2.find((item) => item.checked);

        this.payrollDeductionService
            .updatePayrollDeduction({
                id: id,
                ...this.payrollDeductionForm,
                driverId: this.selectedDriver ? this.selectedDriver.id : null,
                truckId: this.selectedTruck ? this.selectedTruck.id : null,
                date: convertDateToBackend(
                    this.payrollDeductionForm.get('date').value
                ),
                amount: convertThousanSepInNumber(
                    this.payrollDeductionForm.get('amount').value
                ),
                limitedNumber: this.payrollDeductionForm.get('recurring').value
                    ? convertThousanSepInNumber(
                          this.payrollDeductionForm.get('limitedNumber').value
                      )
                    : null,
                recurringType: recType ? recType.name : null,
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

    public addDeduction() {
        const recType = this.tabs2.find((item) => item.checked);
        this.payrollDeductionService
            .addPayrollDeduction({
                ...this.payrollDeductionForm,
                driverId: this.selectedDriver ? this.selectedDriver.id : null,
                truckId: this.selectedTruck ? this.selectedTruck.id : null,
                date: convertDateToBackend(
                    this.payrollDeductionForm.get('date').value
                ),
                amount: convertThousanSepInNumber(
                    this.payrollDeductionForm.get('amount').value
                ),
                limitedNumber: this.payrollDeductionForm.get('recurring').value
                    ? convertThousanSepInNumber(
                          this.payrollDeductionForm.get('limitedNumber').value
                      )
                    : null,
                recurringType: recType ? recType.name : null,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewAfterSave) {
                        this.formService.resetForm(this.payrollDeductionForm);
                        this.selectedDriver = null;
                        this.selectedTruck = null;
                        this.tabChange({ id: 1 }, 'main-tabs');
                        this.tabChange({ id: 3 }, 'week-mon-tabs');
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

    public getByIdDeduction(id: number) {
        this.payrollDeductionService
            .getPayrollDeductionById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PayrollDeductionResponse) => {
                    this.payrollDeductionForm.patchValue({
                        driverId: res.driver
                            ? res.driver.firstName.concat(
                                  ' ',
                                  res.driver.lastName
                              )
                            : null,
                        truckId: res.truck ? res.truck.truckNumber : null,
                        date: convertDateFromBackend(res.date),
                        description: res.description,
                        amount: convertNumberInThousandSep(res.amount),
                        recurringType: res.recurringType,
                        recurring: false, // TODO: Backend
                        limited: false, // TODO: Backend
                        numberOfPayments: null, // TODO: Backend
                        limitedNumber: res.limitedNumber
                            ? convertNumberInThousandSep(res.limitedNumber)
                            : null,
                    });

                    this.tabChange({ id: res.driver ? 1 : 2 }, 'main-tabs');
                    this.tabChange(
                        { id: res.recurringType.name === 'Monthly' ? 4 : 3 },
                        'week-mon-tabs'
                    );
                },
                error: () => {},
            });
    }

    public getModalDropdowns() {
        this.payrollDeductionService
            .getPayrollDeductionModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PayrollDeductionModalResponse) => {
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
                    this.labelsTrucks = [
                        {
                            id: 1,
                            name: '418952',
                            additionalText: 'R2 LOGISTICS',
                        },
                    ];

                    // If Add New By Id
                    if (
                        this.editData?.data?.driverId &&
                        this.editData?.type === 'new'
                    ) {
                        this.labelsDriver = this.labelsDriver.filter(
                            (item) => item.id === this.editData?.data?.driverId
                        );
                        this.selectedDriver = this.labelsDriver[0];
                        this.payrollDeductionForm.patchValue({
                            driverId: this.labelsDriver[0].name,
                        });
                    }
                },
                error: () => {},
            });
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'driver': {
                this.selectedDriver = event;
                break;
            }
            case 'truck': {
                this.selectedTruck = event;

                if (this.selectedTruck) {
                    this.truckDropdownsConfig = {
                        ...this.truckDropdownsConfig,
                        multipleInputValues: {
                            options: [
                                {
                                    value: event?.name,
                                },
                                {
                                    value: event?.additionalText,
                                },
                            ],
                            customClass: 'double-text-dropdown',
                        },
                    };
                } else {
                    this.truckDropdownsConfig = {
                        ...this.truckDropdownsConfig,
                        multipleInputValues: null,
                    };
                }
            }
            default: {
                break;
            }
        }
    }

    public trackReccuringAndLimiting() {
        this.payrollDeductionForm
            .get('recurring')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.tabs2 = this.tabs2.map((item, index) => {
                        return {
                            ...item,
                            checked: index === 0,
                            disabled: false,
                        };
                    });
                } else {
                    this.tabs2 = this.tabs2.map((item) => {
                        return {
                            ...item,
                            checked: false,
                            disabled: true,
                        };
                    });
                }
            });

        this.payrollDeductionForm
            .get('limited')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.payrollDeductionForm
                        .get('numberOfPayments')
                        .patchValue(0);
                } else {
                    this.payrollDeductionForm
                        .get('numberOfPayments')
                        .patchValue(null);
                }
            });
    }
}
