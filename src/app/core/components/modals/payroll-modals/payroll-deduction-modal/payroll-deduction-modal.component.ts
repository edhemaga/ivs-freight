import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { ITaInput } from '../../../shared/ta-input/ta-input.config';
import { PayrollDeductionService } from 'src/app/pages/accounting/services/payroll-deduction.service';
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
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCheckboxComponent } from '../../../shared/ta-checkbox/ta-checkbox.component';

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

        // Component
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCheckboxComponent,
    ],
})
export class PayrollDeductionModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public payrollDeductionForm: UntypedFormGroup;

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
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private payrollDeductionService: PayrollDeductionService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        this.trackReccuringAndLimiting();
    }

    public tabChange(event: any, action): void {
        switch (action) {
            case 'main-tabs': {
                this.selectedTab = event.id;

                this.tabs = this.tabs.map((item) => {
                    return {
                        ...item,
                        checked: item.id === this.selectedTab,
                    };
                });

                if (this.selectedTab === 1) {
                    this.inputService.changeValidators(
                        this.payrollDeductionForm.get('driverId')
                    );
                    this.inputService.changeValidators(
                        this.payrollDeductionForm.get('truckId'),
                        false,
                        [],
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.payrollDeductionForm.get('truckId')
                    );
                    this.inputService.changeValidators(
                        this.payrollDeductionForm.get('driverId'),
                        false,
                        [],
                        false
                    );
                }
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
            date: [new Date(), Validators.required],
            description: [null, Validators.required],
            amount: [null, Validators.required],
            recurring: [false],
            recurringType: [null],
            limited: [false],
            limitedAmount: [null],
            limitedNumber: [null],
        });

        this.formService.checkFormChange(this.payrollDeductionForm);
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
                    this.updateDeduction(this.editData?.data?.id);
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
            case 'delete': {
                this.deletePayrollCreeditById(this.editData?.data.id);
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

    public updateDeduction(id: number) {
        const reccType = this.tabs2.find((item) => item.checked);
        this.payrollDeductionService
            .updatePayrollDeduction({
                ...this.payrollDeductionForm.value,
                id: id,
                ...this.payrollDeductionForm.value,
                type: this.tabs.find((item) => item.checked).id,
                driverId:
                    this.tabs.find((item) => item.checked).id === 1
                        ? this.selectedDriver
                            ? this.selectedDriver.id
                            : null
                        : null,
                truckId:
                    this.tabs.find((item) => item.checked).id === 2
                        ? this.selectedTruck
                            ? this.selectedTruck.id
                            : null
                        : null,
                date: convertDateToBackend(
                    this.payrollDeductionForm.get('date').value
                ),
                amount: convertThousanSepInNumber(
                    this.payrollDeductionForm.get('amount').value
                ),
                recurringType: reccType ? (reccType.id === 3 ? 2 : 1) : null,
                limitedNumber: this.payrollDeductionForm.get('recurring').value
                    ? parseInt(
                          this.payrollDeductionForm.get('limitedNumber').value
                      )
                    : null,
                limitedAmount: this.payrollDeductionForm.get('limitedAmount')
                    .value
                    ? convertThousanSepInNumber(
                          this.payrollDeductionForm.get('limitedAmount').value
                      )
                    : null,
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
        const reccType = this.tabs2.find((item) => item.checked);
        this.payrollDeductionService
            .addPayrollDeduction({
                ...this.payrollDeductionForm.value,
                type: this.tabs.find((item) => item.checked).id,
                driverId:
                    this.tabs.find((item) => item.checked).id === 1
                        ? this.selectedDriver
                            ? this.selectedDriver.id
                            : null
                        : null,
                truckId:
                    this.tabs.find((item) => item.checked).id === 2
                        ? this.selectedTruck
                            ? this.selectedTruck.id
                            : null
                        : null,
                date: convertDateToBackend(
                    this.payrollDeductionForm.get('date').value
                ),
                amount: convertThousanSepInNumber(
                    this.payrollDeductionForm.get('amount').value
                ),
                recurringType: reccType ? (reccType.id === 3 ? 2 : 1) : null,
                limitedNumber: this.payrollDeductionForm.get('recurring').value
                    ? parseInt(
                          this.payrollDeductionForm.get('limitedNumber').value
                      )
                    : null,
                limitedAmount: this.payrollDeductionForm.get('limitedAmount')
                    .value
                    ? convertThousanSepInNumber(
                          this.payrollDeductionForm.get('limitedAmount').value
                      )
                    : null,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewAfterSave) {
                        this.formService.resetForm(this.payrollDeductionForm);
                        this.selectedDriver = null;
                        this.selectedTruck = null;

                        this.payrollDeductionForm
                            .get('recurring')
                            .patchValue(false);
                        this.payrollDeductionForm
                            .get('limited')
                            .patchValue(false);

                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });

                        setTimeout(() => {
                            this.tabChange({ id: 1 }, 'main-tabs');
                            this.tabChange({ id: 3 }, 'week-mon-tabs');
                        }, 150);
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

    public deletePayrollCreeditById(id: number) {
        this.payrollDeductionService
            .deletePayrollDeductionById(id)
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
                        recurringType: res.recurringType
                            ? res.recurringType.id
                            : null,
                        recurring: !!res.recurringType?.name,
                        limited: !!(res.limitedAmount && res.limitedNumber),
                        limitedAmount: res.limitedAmount
                            ? convertNumberInThousandSep(res.limitedAmount)
                            : null,
                        limitedNumber: res.limitedNumber,
                    });

                    if (res.driver) {
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
                    }

                    if (res.truck) {
                        this.selectedTruck = {
                            ...res.truck,
                            name: res.truck.truckNumber,
                            additionalText: res.truck.owner,
                        };

                        this.truckDropdownsConfig = {
                            ...this.truckDropdownsConfig,
                            multipleInputValues: {
                                options: [
                                    {
                                        value: res?.truck?.truckNumber,
                                    },
                                    {
                                        value: res.truck?.owner,
                                    },
                                ],
                                customClass: 'double-text-dropdown',
                            },
                        };
                    }

                    setTimeout(() => {
                        this.tabChange({ id: res.type.id }, 'main-tabs');
                        if (res.recurringType) {
                            this.tabChange(
                                {
                                    id:
                                        res.recurringType.name === 'Monthly'
                                            ? 4
                                            : 3,
                                },
                                'week-mon-tabs'
                            );
                        }
                    }, 150);
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
                    this.labelsTrucks = res.trucks.map((item) => {
                        return {
                            ...item,
                            name: item.truckNumber,
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
                        this.payrollDeductionForm.patchValue({
                            driverId: this.labelsDriver[0].name,
                        });
                        this.selectedTruck = null;
                    }

                    if (this.editData?.type === 'edit') {
                        this.getByIdDeduction(this.editData.data.id);
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
                if (!value) {
                    this.payrollDeductionForm
                        .get('limitedAmount')
                        .patchValue(null);

                    this.payrollDeductionForm
                        .get('limitedNumber')
                        .patchValue(null);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
