import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';

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

    public isFormDirty: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.createForm();

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
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
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
                    });
                } else {
                    this.addCredit();
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

    public updateCredit(id: number) {}

    public addCredit() {}

    public getByIdCredit(id: number) {}

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
}
