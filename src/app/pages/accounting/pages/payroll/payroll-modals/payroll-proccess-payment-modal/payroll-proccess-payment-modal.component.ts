import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';

@Component({
    selector: 'app-payroll-proccess-payment-modal',
    templateUrl: './payroll-proccess-payment-modal.component.html',
    styleUrls: ['./payroll-proccess-payment-modal.component.scss'],
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
export class PayrollProccessPaymentModalComponent {
    public tabs: any[] = [
        {
            id: 1,
            name: 'carriera. ACH',
            checked: true,
            color: '3074D3',
        },
        {
            id: 2,
            name: 'OTHER',
            checked: false,
            color: '3074D3',
        },
    ];

    public tabChange(event: any, action): void {}
}
