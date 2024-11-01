import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { skip, Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Animations
import { tabsModalAnimation } from '@shared/animations';

// Components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalComponent,
} from 'ca-components';

// Models
import { EditData } from '@shared/models/edit-data.model';
import { Tabs } from '@shared/models/tabs.model';
import { IPayrollProccessPaymentModal } from '../../state/models/payroll.model';
import { PayrollPaymentType } from 'appcoretruckassist';

// Services
import { PayrollFacadeService } from '../../state/services/payroll.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { GetNumbersPipe } from '../../pipes/get-numbers/get-numbers.pipe';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

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
        TaSpinnerComponent,
        GetNumbersPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollProccessPaymentModalComponent implements OnDestroy {
    @ViewChild('tabCustomTemplate', { static: true })
    public readonly tabCustomTemplate!: ElementRef;
    @Input() editData: EditData<IPayrollProccessPaymentModal>;

    private destroy$ = new Subject<void>();

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
            name: 'WireTransfer',
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

    public loading: boolean;
    public loadingCloseUnpaid: boolean;

    ngOnInit() {
        this.tabs[0].tabTemplate = this.tabCustomTemplate;
        this.createForm();

        this.subscribeToStore();

        setTimeout(() => {
            this.chDetRef.detectChanges();
        }, 200);
    }

    private subscribeToStore() {
        this.payrollFacadeService.selectPayrollReportStates$
            .pipe(skip(1), takeUntil(this.destroy$))
            .subscribe(({ loading, error }) => {
                if (!loading && !error) {
                    this.loading = false;
                    this.loadingCloseUnpaid = false;
                    this.payrollFacadeService.getPayrollCounts();
                    this.onCloseModal();
                    this.destroy$.next();
                    this.destroy$.complete();
                } else if (error) {
                    this.chDetRef.detectChanges();
                    this.loading = false;
                    this.loadingCloseUnpaid = false;
                }
            });
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
            amount: [this.modalData.totalEarnings, [Validators.required]],
            option: [null],
        });
        this.chDetRef.detectChanges();
    }

    onCloseModal() {
        this.ngbActiveModal.close();
    }

    get paymentFormControlls() {
        return this.paymentForm.controls;
    }

    closePayroll(isUnpaid?: boolean) {
        const formData = this.paymentForm.getRawValue();
        if (isUnpaid) this.loadingCloseUnpaid = true;
        else this.loading = true;

        const isOpen = this.modalData.selectedTab;

        if (isOpen === 'open') {
            this.payrollFacadeService.closePayrollReport({
                amount: isUnpaid
                    ? 0
                    : MethodsCalculationsHelper.convertThousanSepInNumber(
                          formData.amount
                      ),
                reportId: this.modalData.id,
                paymentType:
                    this.selectedTab === 2
                        ? PayrollPaymentType.Manual
                        : PayrollPaymentType.Ach,
                otherPaymentType:
                    this.selectedTab === 2 ? formData.option : null,
                payrollType: this.modalData.payrollType,
            });
        } else {
            this.payrollFacadeService.addPayrollClosedPayment(
                {
                    amount: MethodsCalculationsHelper.convertThousanSepInNumber(
                        formData.amount
                    ),
                    paymentType: this.selectedTab === 2 ? 'Manual' : 'Ach',
                    modalId: this.modalData.id,
                    otherPaymentType:
                        this.selectedTab === 2 ? formData.option : null,
                },
                this.modalData.payrollType
            );
        }
    }

    selectedItem(dd: any) {}

    get modalData(): IPayrollProccessPaymentModal {
        return this.editData.data as IPayrollProccessPaymentModal;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
