import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tabsModalAnimation } from '@shared/animations';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { EditData } from '@shared/models/edit-data.model';
import { Tabs } from '@shared/models/tabs.model';
import { TaInputService } from '@shared/services/ta-input.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PayrollDriverMileageByIdResponse } from 'appcoretruckassist';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalComponent,
} from 'ca-components';
import { PayrollFacadeService } from '../../state/services/payroll.service';

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
        AngularSvgIconModule,

        // Component
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        CaInputComponent,
        CaModalComponent,
        CaInputDropdownComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollProccessPaymentModalComponent {
    @ViewChild('tabCustomTemplate', { static: true })
    public readonly tabCustomTemplate!: ElementRef;
    @Input() editData: EditData<PayrollDriverMileageByIdResponse>;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private ngbActiveModal: NgbActiveModal,
        private inputService: TaInputService,
        private chDetRef: ChangeDetectorRef,
        private payrollFacadeService: PayrollFacadeService
    ) {}

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

    dropDownInputConfig = {
        name: 'Input Dropdown',
        type: 'text',
        label: 'Pay Method',
        isDropdown: true,
        dropdownWidthClass: 'w-col-222',
        isRequired: true,
    };

    dropdownOption = [
        {
            id: 1,
            companyId: null,
            name: '20 ft',
        },
        {
            id: 2,
            companyId: null,
            name: '22 ft',
        },
        {
            id: 3,
            companyId: null,
            name: '24 ft',
        },
        {
            id: 4,
            companyId: null,
            name: '26 ft',
        },
        {
            id: 5,
            companyId: null,
            name: '28 ft',
        },
        {
            id: 6,
            companyId: null,
            name: '40 ft',
        },
        {
            id: 7,
            companyId: null,
            name: '42 ft',
        },
        {
            id: 8,
            companyId: null,
            name: '43 ft',
        },
        {
            id: 9,
            companyId: null,
            name: '45 ft',
        },
        {
            id: 10,
            companyId: null,
            name: '48 ft',
        },
        {
            id: 11,
            companyId: null,
            name: '53 ft',
        },
    ];

    public paymentForm: UntypedFormGroup;
    public selectedTab: number = 1;
    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };
    public tabs: Tabs[] = [
        {
            id: 1,
            name: 'carriera. ACH',
            checked: true,
            color: '3074D3',
            tabTemplate: this.tabCustomTemplate,
        },
        {
            id: 2,
            name: 'OTHER',
            checked: false,
            color: '3074D3',
        },
    ];

    ngOnInit() {
        this.tabs[0].tabTemplate = this.tabCustomTemplate;
        this.createForm();

        setTimeout(() => {
            this.chDetRef.detectChanges();
        }, 200);
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;

        this.tabs = this.tabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });
        const dotAnimation = document.querySelector('.animation-two-tabs');

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };

        if (this.selectedTab === 2) {
            this.inputService.changeValidators(this.paymentForm.get('option'));
        } else {
            this.inputService.changeValidators(
                this.paymentForm.get('option'),
                false,
                [],
                false
            );
        }
    }

    private createForm(): void {
        this.paymentForm = this.formBuilder.group({
            // Basic Tab
            amount: [null, [Validators.required]],
            option: [null],
        });
        this.chDetRef.detectChanges();
    }

    onCloseModal() {
        this.ngbActiveModal.close();
    }

    closeUnpaid() {
        console.log('CLLSE UNPPAID');
    }

    closePayroll() {
        const formData = this.paymentForm.getRawValue();
        this.payrollFacadeService.closePayrollDriverMileageReport({
            amount: formData.amount,
            reportId: this.modalData.id,
        });
    }

    selectedItem(dd: any) {}

    get modalData(): PayrollDriverMileageByIdResponse {
        //console.log('WHAT IS EDIT DATA', this.editData.data);
        return this.editData.data;
    }
}
