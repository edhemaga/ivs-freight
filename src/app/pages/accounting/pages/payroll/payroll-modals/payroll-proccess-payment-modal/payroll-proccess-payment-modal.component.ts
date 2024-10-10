import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { tabsModalAnimation } from '@shared/animations';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { CaInputComponent } from 'ca-components';

@Component({
    selector: 'app-payroll-proccess-payment-modal',
    templateUrl: './payroll-proccess-payment-modal.component.html',
    styleUrls: ['./payroll-proccess-payment-modal.component.scss'],
    standalone: true,
    animations: [tabsModalAnimation('animationTabsModal')],
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
        CaInputComponent,
    ],
})
export class PayrollProccessPaymentModalComponent {
    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit() {
        this.createForm();
    }

    inputConfig = {
        name: 'price-separator',
        type: 'text',
        label: 'Amount',
        isRequired: true,
        priceSeparator: true,
        priceSeparatorLimitation: 6,
        placeholderIcon: 'dollar',
        placeholderIconColor: 'blue',
        hideErrorMessage: true,
        hideRequiredCheck: true,
    };

    public paymentForm: UntypedFormGroup;
    public selectedTab: number = 1;
    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };
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

    private createForm(): void {
        this.paymentForm = this.formBuilder.group({
            // Basic Tab
            amount: [null, [Validators.required]],
        });
    }
}
