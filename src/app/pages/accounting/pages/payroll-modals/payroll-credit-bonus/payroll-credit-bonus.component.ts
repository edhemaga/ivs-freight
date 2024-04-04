import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TaInputService } from '../../../../../shared/components/ta-input/services/ta-input.service';
import { ModalService } from '../../../../../shared/components/ta-modal/services/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { PayrollCreditService } from 'src/app/pages/accounting/services/payroll-credit.service';
import { PayrollCreditModalResponse } from '../../../../../../../appcoretruckassist/model/payrollCreditModalResponse';
import { ITaInput } from '../../../../../shared/components/ta-input/config/ta-input.config';
import { PayrollCreditResponse } from '../../../../../../../appcoretruckassist/model/payrollCreditResponse';
import {
    convertDateToBackend,
    convertThousanSepInNumber,
} from '../../../../../core/utils/methods.calculations';
import {
    convertDateFromBackend,
    convertNumberInThousandSep,
} from '../../../../../core/utils/methods.calculations';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../../../../shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../../../shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../../../../shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../../../shared/components/ta-input-dropdown/ta-input-dropdown.component';

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

        // Component
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputDropdownComponent,
    ],
})
export class PayrollCreditBonusComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public payrollCreditForm: UntypedFormGroup;

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
        private formService: FormService,
        private payrolCreditService: PayrollCreditService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;

        this.tabs = this.tabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });

        if (this.selectedTab === 1) {
            this.inputService.changeValidators(
                this.payrollCreditForm.get('truckId'),
                false,
                [],
                false
            );
            this.inputService.changeValidators(
                this.payrollCreditForm.get('driverId'),
                true,
                [],
                false
            );
        }

        if (this.selectedTab === 2) {
            this.inputService.changeValidators(
                this.payrollCreditForm.get('truckId'),
                true,
                [],
                false
            );
            this.inputService.changeValidators(
                this.payrollCreditForm.get('driverId'),
                false,
                [],
                false
            );
        }
    }

    private createForm() {
        this.payrollCreditForm = this.formBuilder.group({
            driverId: [null, Validators.required],
            truckId: [null],
            date: [new Date(), Validators.required],
            description: [null, Validators.required],
            amount: [null, Validators.required],
        });

        this.formService.checkFormChange(this.payrollCreditForm);
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
                if (this.payrollCreditForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.payrollCreditForm);
                    return;
                }
                this.addCredit();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;
                break;
            }
            case 'save': {
                if (this.payrollCreditForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.payrollCreditForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateCredit(this.editData?.data?.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addCredit();
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

    public updateCredit(id: number) {
        this.payrolCreditService
            .updatePayrollCredit({
                ...this.payrollCreditForm.value,
                id: id,
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
                    this.payrollCreditForm.get('date').value
                ),
                amount: convertThousanSepInNumber(
                    this.payrollCreditForm.get('amount').value
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

    public addCredit() {
        this.payrolCreditService
            .addPayrollCredit({
                ...this.payrollCreditForm.value,
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
                    this.payrollCreditForm.get('date').value
                ),
                amount: convertThousanSepInNumber(
                    this.payrollCreditForm.get('amount').value
                ),
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewAfterSave) {
                        this.formService.resetForm(this.payrollCreditForm);
                        this.selectedDriver = null;
                        this.selectedTruck = null;
                        this.tabChange({ id: 1 });
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
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

    public getByIdCredit(id: number) {
        this.payrolCreditService
            .getPayrollCreditById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PayrollCreditResponse) => {
                    this.payrollCreditForm.patchValue({
                        driverId: res.driver
                            ? res.driver.firstName.concat(
                                  ' ',
                                  res.driver.lastName
                              )
                            : null,
                        // truckId: res.truck ? res.truck.truckNumber : null,
                        date: convertDateFromBackend(res.date),
                        description: res.description,
                        amount: convertNumberInThousandSep(res.amount),
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
                                        value: res.truck?.truckNumber,
                                    },
                                    {
                                        value: res?.truck?.owner,
                                    },
                                ],
                                customClass: 'double-text-dropdown',
                            },
                        };
                    }

                    setTimeout(() => {
                        this.tabChange({ id: res.type.id });
                    }, 150);
                },
                error: () => {},
            });
    }

    public getModalDropdowns() {
        this.payrolCreditService
            .getPayrollCreditModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PayrollCreditModalResponse) => {
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
                        this.payrollCreditForm.patchValue({
                            driverId: this.labelsDriver[0].name,
                        });
                        this.selectedTruck = null;
                    }

                    if (this.editData?.type === 'edit') {
                        this.getByIdCredit(this.editData.data.id);
                    }
                },
                error: () => {},
            });
    }

    public deletePayrollCreeditById(id: number) {
        this.payrolCreditService
            .deletePayrollCreditById(id)
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

                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
