import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';

// Components
import { PayrollBaseModalComponent } from '../payroll-base-modal/payroll-base-modal.component';
import { PayrollDeductionService } from './services/payroll-deduction.service';
import { CreatePayrollDeductionCommand } from 'appcoretruckassist';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

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

        PayrollBaseModalComponent
    ],
})
export class PayrollDeductionModalComponent implements OnInit {
    public payrollCreditForm: FormGroup;
  
    constructor(private fb: FormBuilder, private payrollDeductionService: PayrollDeductionService) {}
  
    ngOnInit(): void {
      this.payrollCreditForm = this.fb.group({
        [PayrollStringEnum.DRIVER_ID]: [null, Validators.required],
        [PayrollStringEnum.TRUCK_ID]: [null],
        [PayrollStringEnum.SELECTED_DRIVER_ID]: [null],
        [PayrollStringEnum.SELECTED_TRUCK_ID]: [null],
        [PayrollStringEnum.SELECTED_TYPE_ID]: ['Driver'],
        [PayrollStringEnum.DATE]: [new Date(), Validators.required],
        [PayrollStringEnum.DESCRIPTION]: [null, Validators.required],
        [PayrollStringEnum.AMOUNT]: [null, Validators.required],
        [PayrollStringEnum.RECURRING]: [false],
        [PayrollStringEnum.RECURRING_TYPE]: [false],
        [PayrollStringEnum.LIMITED]: [false],
        [PayrollStringEnum.LIMITED_NUMBER]: [null],
        [PayrollStringEnum.LIMITED_AMOUNT]: [null],
      });

      this.payrollCreditForm.valueChanges.subscribe(a => {
        console.log(a);
        console.log(this.payrollCreditForm.valid)
      });
    }

    private generateModel(): CreatePayrollDeductionCommand {
      return {
        // TODO: GET VALUES DYNAMIC FOR THIS 4 FIELDS, ALSO SET VALIDATORS BASED ON CHECKBOXES 
          type: this.payrollCreditForm.get(PayrollStringEnum.SELECTED_TYPE_ID).value,
          recurringType: this.payrollCreditForm.get(PayrollStringEnum.RECURRING_TYPE).value,
          driverId: this.payrollCreditForm.get(PayrollStringEnum.SELECTED_DRIVER_ID).value,
          truckId: this.payrollCreditForm.get(PayrollStringEnum.SELECTED_TRUCK_ID).value,
          description: this.payrollCreditForm.get(
              PayrollStringEnum.DESCRIPTION
          ).value,
          date: MethodsCalculationsHelper.convertDateToBackend(
              this.payrollCreditForm.get(PayrollStringEnum.DATE).value
          ),
          amount: MethodsCalculationsHelper.convertThousanSepInNumber(
              this.payrollCreditForm.get(PayrollStringEnum.AMOUNT).value
          ),
          recurring: this.payrollCreditForm.get(PayrollStringEnum.RECURRING).value,
          limited: this.payrollCreditForm.get(PayrollStringEnum.LIMITED).value,
          limitedAmount: this.payrollCreditForm.get(PayrollStringEnum.LIMITED_NUMBER).value,
          limitedNumber: this.payrollCreditForm.get(PayrollStringEnum.LIMITED_AMOUNT).value,
      };
  }

    public createNewDeduction(): void {
      this.payrollDeductionService.addPayrollDeduction(this.generateModel()).subscribe(response => {
        console.log(response);
      })
    }
}
