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
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// Animations
import { tabsModalAnimation } from '@shared/animations';

// Components
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';
import {
    CaInputDropdownTestComponent,
    CaModalComponent,
    CaTabSwitchComponent,
    InputTestComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Models
import { EditData } from '@shared/models/edit-data.model';
import { Tabs } from '@shared/models/tabs.model';
import { IPayrollProccessPaymentModal } from '@pages/accounting/pages/payroll/state/models';
import { PayrollPaymentType } from 'appcoretruckassist';

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';
import { TaInputService } from '@shared/services/ta-input.service';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Pipes
import {
    ePayrollTablesStatus,
    ePayrollString,
} from '@pages/accounting/pages/payroll/state/enums';

// Config
import {
    dropDownInputConfig,
    dropdownOption,
    inputConfig,
} from '@pages/accounting/pages/payroll/config';

// Svg
import { PayrollSvgRoutes } from '@pages/accounting/pages/payroll/state/utils';

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
        NgbTooltip,

        // Component
        CaTabSwitchComponent,
        CaModalComponent,
        CaInputDropdownTestComponent,
        TaSpinnerComponent,
        InputTestComponent,
        TaAppTooltipV2Component,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollProccessPaymentModalComponent implements OnDestroy {
    @ViewChild('tabCustomTemplate', { static: true })
    public readonly tabCustomTemplate!: ElementRef;
    @Input() editData: EditData<IPayrollProccessPaymentModal>;

    private destroy$ = new Subject<void>();
    public isPaidInFull: boolean = true;
    public svgRoutes = PayrollSvgRoutes;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private ngbActiveModal: NgbActiveModal,
        private inputService: TaInputService,
        private chDetRef: ChangeDetectorRef,
        private payrollFacadeService: PayrollFacadeService
    ) {}

    public inputConfig = inputConfig;

    public dropDownInputConfig = dropDownInputConfig;

    public dropdownOption = dropdownOption;

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

        this.setAmmoutWatchers();
    }

    private setAmmoutWatchers() {
        const ammount = this.paymentForm.get(ePayrollString.AMOUNT);

        // Manually handle the initial value
        const initialValue =
            MethodsCalculationsHelper.convertThousandSepInNumber(ammount.value);
        this.handleAmountChange(initialValue);

        ammount.valueChanges.subscribe((val) => {
            const convertToNumber =
                MethodsCalculationsHelper.convertThousandSepInNumber(val);
            this.handleAmountChange(convertToNumber);
        });
    }

    private handleAmountChange(convertToNumber: number) {
        const totalEarnings = this.modalData?.totalEarnings;

        if (convertToNumber > totalEarnings) {
            this.paymentForm
                .get(ePayrollString.AMOUNT)
                .patchValue(totalEarnings, { emitEvent: false });
        }
        this.isPaidInFull = convertToNumber === totalEarnings;
    }

    private subscribeToStore(): void {
        this.payrollFacadeService.selectPayrollReportStates$
            .pipe(skip(1), takeUntil(this.destroy$))
            .subscribe(({ loading, error }) => {
                if (!loading && !error) {
                    this.loading = false;
                    this.loadingCloseUnpaid = false;
                    this.payrollFacadeService.getPayrollCounts(true);
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

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    public get paymentFormControlls() {
        return this.paymentForm.controls;
    }

    public closePayroll(isUnpaid?: boolean): void {
        const formData = this.paymentForm.getRawValue();
        if (isUnpaid) this.loadingCloseUnpaid = true;
        else this.loading = true;

        const isOpen = this.modalData.selectedTab;

        if (isOpen === ePayrollTablesStatus.OPEN) {
            this.payrollFacadeService.closePayrollReport({
                amount: isUnpaid
                    ? 0
                    : MethodsCalculationsHelper.convertThousandSepInNumber(
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
                    amount: MethodsCalculationsHelper.convertThousandSepInNumber(
                        formData.amount
                    ),
                    paymentType:
                        this.selectedTab === 2
                            ? PayrollPaymentType.Manual
                            : PayrollPaymentType.Ach,
                    modalId: this.modalData.id,
                    otherPaymentType:
                        this.selectedTab === 2 ? formData.option : null,
                },
                this.modalData.payrollType
            );
        }
    }

    get modalData(): IPayrollProccessPaymentModal {
        return this.editData.data as IPayrollProccessPaymentModal;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
