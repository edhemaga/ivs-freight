import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-payroll-deducation-modal',
    templateUrl: './payroll-deducation-modal.component.html',
    styleUrls: ['./payroll-deducation-modal.component.scss'],
})
export class PayrollDeducationModalComponent implements OnInit {
    @Input() editData: any;

    public payrollDeducationForm: FormGroup;

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

    public selectedTab2: number = 3;
    public tabs2: any[] = [
        {
            id: 3,
            name: 'WEEKLY',
            disabled: true,
            color: '3074D3',
        },
        {
            id: 4,
            name: 'MONTHLY',
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

    public isFormDirty: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.createForm();
        this.trackReccuringAndLimiting();
        if (this.editData?.type === 'edit') {
            this.getByIdDeducation(1);
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
        this.payrollDeducationForm = this.formBuilder.group({
            driverId: [null, Validators.required],
            truckId: [null],
            date: [null, Validators.required],
            description: [null, Validators.required],
            amount: [null, Validators.required],
            isRecurring: [false],
            isLimited: [false],
            numberOfPayments: [null],
            limitedAmount: [null],
        });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.payrollDeducationForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.payrollDeducationForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateDeducation(this.editData?.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addDeducation();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public updateDeducation(id: number) {}

    public addDeducation() {}

    public getByIdDeducation(id: number) {}

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'driver': {
                this.selectedDriver = event;
                break;
            }
            case 'truck': {
                this.selectedTruck = event;
            }
            default: {
                break;
            }
        }
    }

    public trackReccuringAndLimiting() {
        this.payrollDeducationForm
            .get('isRecurring')
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

        this.payrollDeducationForm
            .get('isLimited')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.payrollDeducationForm
                        .get('numberOfPayments')
                        .patchValue(0);
                } else {
                    this.payrollDeducationForm
                        .get('numberOfPayments')
                        .patchValue(null);
                }
            });
    }
}
