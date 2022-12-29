import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    creditLimitValidation,
    descriptionPayrollBonusValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-payroll-bonus-modal',
    templateUrl: './payroll-bonus-modal.component.html',
    styleUrls: ['./payroll-bonus-modal.component.scss'],
})
export class PayrollBonusModalComponent implements OnInit {
    @Input() editData: any;

    public payrollBonusForm: FormGroup;

    public labelsDriver: any[] = [];
    public selectedDriver: any = null;

    private destroy$ = new Subject<void>();

    public isFormDirty: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.createForm();

        if (this.editData?.type === 'edit') {
            this.getByIdBonus(1);
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
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
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
                    });
                } else {
                    this.addBonus();
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

    public addBonus() {}

    public updateBonus(id: number) {}

    public getByIdBonus(id: number) {}
}
