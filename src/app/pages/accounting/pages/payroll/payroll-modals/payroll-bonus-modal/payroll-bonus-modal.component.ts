import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PayrollBaseModalComponent } from '../payroll-base-modal/payroll-base-modal.component';
import { PayrollCreditConst } from '../../state/utils/consts';

// Components

@Component({
    selector: 'app-payroll-bonus-modal',
    templateUrl: './payroll-bonus-modal.component.html',
    styleUrls: ['./payroll-bonus-modal.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        PayrollBaseModalComponent
    ],
})
export class PayrollBonusModalComponent implements OnInit {
    public payrollCreditForm: FormGroup;
  
    constructor(private fb: FormBuilder) {}
  
    ngOnInit(): void {
      this.payrollCreditForm = this.fb.group({
        description: ['', Validators.required],
        date: ['', Validators.required],
        amount: ['', [Validators.required, Validators.min(0)]],
      });

      this.payrollCreditForm.valueChanges.subscribe(a => console.log(a));
    }
   
}
