import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from '../../../../services/form/form.service';
import { PayrollCreditService } from '../../../accounting/payroll/payroll/state/payroll-credit.service';
import { PayrollCreditModalResponse } from '../../../../../../../appcoretruckassist/model/payrollCreditModalResponse';
import { ITaInput } from '../../../shared/ta-input/ta-input.config';

@Component({
    selector: 'app-payroll-credit-bonus',
    templateUrl: './payroll-credit-bonus.component.html',
    styleUrls: ['./payroll-credit-bonus.component.scss'],
})
export class PayrollCreditBonusComponent implements OnInit {
    @Input() editData: any;

    public payrollCreditForm: FormGroup;

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
        dropdownWidthClass: 'w-col-256',
    };

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private payrolCreditService: PayrollCreditService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        if (this.editData.type === 'edit') {
            this.getByIdCredit(1);
        }
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
    }

    private createForm() {
        this.payrollCreditForm = this.formBuilder.group({
            driverId: [null, Validators.required],
            truckId: [null],
            date: [null, Validators.required],
            description: [null, Validators.required],
            amount: [null, Validators.required],
        });

        this.formService.checkFormChange(this.payrollCreditForm, 400);
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
                    this.updateCredit(this.editData?.id);
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
            default: {
                break;
            }
        }
    }

    public updateCredit(id: number) {}

    public addCredit() {
        // TODO: dodati addNewAfterSave
    }

    public getByIdCredit(id: number) {}

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
                            additionalText: 'Kucas',
                        };
                    });
                    this.labelsTrucks = [
                        {
                            id: 1,
                            name: '418952',
                            additionalText: 'R2 LOGISTICS',
                        },
                    ];
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

                break;
            }
            default: {
                break;
            }
        }
    }
}
