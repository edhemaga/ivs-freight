import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// Components
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalComponent,
} from 'ca-components';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// Const
import { PayrollCreditConst } from '@pages/accounting/pages/payroll/state/utils/consts';

// Enums
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';

// Utils
import { PayrollSvgRoutes } from '@pages/accounting/pages/payroll/state/utils';

// Models
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import {
    DriverMinimalResponse,
    EnumValue,
    PayrollCreditModalResponse,
    PayrollCreditType,
    PayrollDeductionRecurringType,
    TruckMinimalResponse,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import {
    PayrollDriver,
    PayrollModal,
    PayrollModalType,
    PayrollTruck,
} from '@pages/accounting/pages/payroll/state/models';

// Services
import { PayrollCreditService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/services/payroll-credit.service';
import { PayrollBonusService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-bonus-modal/services/payroll-bonus.service';
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { PayrollDeductionService } from '../payroll-deduction-modal/services/payroll-deduction.service';

@Component({
    selector: 'app-payroll-base-modal',
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,

        CaModalComponent,
        CaInputComponent,
        TaInputComponent,
        TaTabSwitchComponent,
        CaInputDropdownComponent,
        TaCheckboxComponent,
        TaAppTooltipV2Component,

        // Pipes
        FormatDatePipe,
    ],
    templateUrl: './payroll-base-modal.component.html',
    styleUrls: ['./payroll-base-modal.component.scss'],
})
export class PayrollBaseModalComponent implements OnInit {
    @Input() footerTemplate: TemplateRef<Element>;
    @Input() baseForm: FormGroup;
    @Input() modalTitle: string;
    @Input() isDriverAndTruckTabs: boolean;
    @Input() modalType: PayrollModalType;
    @Input() isShortModal: boolean;
    @Input() editData: PayrollModal;
    public payrollCreditConst = PayrollCreditConst;
    public svgRoutes = PayrollSvgRoutes;
    public tabs = [];
    public selectedTab: TabOptions;

    // Drivers
    public selectedDriver: PayrollDriver;
    public driversDropdownList: PayrollDriver[];
    // Trucks
    public selectedTruck: EnumValue;
    public trucksDropdownList: PayrollTruck[];
    private destroy$ = new Subject<void>();
    public creditTitle: string = '';
    public periodTabs: TabOptions[];

    constructor(
        private payrolCreditService: PayrollCreditService,
        private payrollBonusService: PayrollBonusService,
        private ngbActiveModal: NgbActiveModal,
        private payrollFacadeService: PayrollFacadeService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.generateTabs();
        this.setupEventListeners();
        this.setupDeleteListeners();
    }

    private generateTabs(): void {
        if (this.isDriverAndTruckTabs) {
            this.tabs = this.payrollCreditConst.tabs;
            this.driverAndTruckDropdowns();
            this.selectedTab = this.tabs[0];
        }

        if (this.isDeductionModal) {
            this.periodTabs = [...this.payrollCreditConst.periodTabs];

            if (this.editData?.data?.recurringType) {
                if (
                    this.editData.data.recurringType.name ===
                    PayrollDeductionRecurringType.Monthly
                ) {
                    this.periodTabs[0].checked = true;
                } else {
                    this.periodTabs[1].checked = true;
                }
            }
        }

        if (this.isBonusModal) this.getEmployeesDropdown();
    }

    private setupEventListeners(): void {
        this.setupDeductionListeners();
        this.truckDriverListeners();
    }

    private truckDriverListeners() {
        this.payrollFacadeService.payrollModalFormSubmited$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.selectedDriver = null;
                this.selectedTruck = null;
            });
    }

    private setupDeductionListeners() {
        if (!this.isDeductionModal) return;

        this.baseForm
            .get(PayrollStringEnum.RECURRING)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    const tabToCheck = this.periodTabs[0];
                    tabToCheck.checked = true;
                } else {
                    this.periodTabs = this.payrollCreditConst.periodTabs.map(
                        (tab) => ({ ...tab, checked: false })
                    );
                }
            });

        this.baseForm
            .get(PayrollStringEnum.AMOUNT)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => this.calculateDeductionPayAmmount());

        this.baseForm
            .get(PayrollStringEnum.LIMITED_NUMBER)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => this.calculateDeductionPayAmmount());
    }

    private calculateDeductionPayAmmount(): void {
        const ammount = MethodsCalculationsHelper.convertThousanSepInNumber(
            this.baseForm.get(PayrollStringEnum.AMOUNT).value
        );
        const numberOfPayments =
            MethodsCalculationsHelper.convertThousanSepInNumber(
                this.baseForm.get(PayrollStringEnum.LIMITED_NUMBER).value
            );

        this.baseForm
            .get(PayrollStringEnum.LIMITED_AMOUNT)
            .patchValue(
                MethodsCalculationsHelper.convertNumberInThousandSep(
                    ammount / numberOfPayments
                ) ?? 0
            );
    }

    private getEmployeesDropdown(): void {
        this.payrollBonusService.getPayrollBonusModal().subscribe((res) => {});
    }

    private driverAndTruckDropdowns(): void {
        this.payrolCreditService
            .getPayrollCreditModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PayrollCreditModalResponse) => {
                    this.mapDrivers(res.drivers);
                    this.mapTrucks(res.trucks);
                    this.populateData();
                },
                error: () => {},
            });
    }

    private populateData(): void {
        if (!this.editData) return;

        if (this.editData?.data) {
            if (this.editData.creditType === PayrollCreditType.Driver) {
                const driver = this.driversDropdownList.find(
                    (_driver) => _driver.id === this.editData.data.driverId
                );
                this.selectDriver(driver);
            } else {
                const truck = this.trucksDropdownList.find(
                    (_truck) => _truck.id === this.editData.data.truckId
                );
                this.selectTruck(truck);
            }
        }
    }

    private mapDrivers(drivers: DriverMinimalResponse[]): void {
        this.driversDropdownList = drivers.map(
            ({ id, firstName, lastName, avatarFile, payType }) => {
                return {
                    id,
                    logoName: avatarFile?.url,
                    name: firstName + ' ' + lastName,
                    avatarFile: avatarFile?.url,
                    suffix: payType ? ` • ${payType.name}` : '',
                };
            }
        );
    }

    public selectDriver(driver: PayrollDriver): void {
        this.selectedDriver = driver;
        this.baseForm
            .get(PayrollStringEnum.SELECTED_DRIVER_ID)
            .patchValue(driver?.id ?? null);
        this.creditTitle = driver?.name + driver?.suffix;
    }

    private mapTrucks(trucks: TruckMinimalResponse[]): void {
        this.trucksDropdownList = trucks.map(({ id, truckNumber, owner }) => {
            return {
                id,
                name: truckNumber,
                suffix: owner ? ` • ${owner}` : '',
            };
        });
    }

    public selectTruck(truck: PayrollTruck): void {
        this.selectedTruck = truck;
        this.baseForm
            .get(PayrollStringEnum.SELECTED_TRUCK_ID)
            .patchValue(truck?.id ?? null);
        this.creditTitle = truck?.name + truck.suffix;
    }

    private clearDriverTruckValidators(): void {
        this.baseForm.get(PayrollStringEnum.DRIVER_ID).clearValidators();
        this.baseForm.get(PayrollStringEnum.TRUCK_ID).clearValidators();
    }

    public onDriverTruckTabChange(tab: TabOptions): void {
        this.selectedTab = tab;
        this.baseForm
            .get(PayrollStringEnum.SELECTED_TYPE_ID)
            .patchValue(tab.name);

        this.clearDriverTruckValidators();

        if (tab.id === 1) {
            this.baseForm
                .get(PayrollStringEnum.DRIVER_ID)
                .setValidators(Validators.required);
            this.baseForm
                .get(PayrollStringEnum.SELECTED_TRUCK_ID)
                .setValue(null);
        } else if (tab.id === 2) {
            this.baseForm
                .get(PayrollStringEnum.TRUCK_ID)
                .setValidators(Validators.required);
            this.baseForm
                .get(PayrollStringEnum.SELECTED_DRIVER_ID)
                .setValue(null);
        }

        // Re-validate the form to apply changes
        this.baseForm.get(PayrollStringEnum.DRIVER_ID).updateValueAndValidity();
        this.baseForm.get(PayrollStringEnum.TRUCK_ID).updateValueAndValidity();

        this.creditTitle = null;
    }

    public onPeriodTabChange(tab: TabOptions): void {
        this.baseForm
            .get(PayrollStringEnum.RECURRING_TYPE)
            .patchValue(tab?.value ?? null);
    }

    public get isDropdownEnabled(): boolean {
        return !!!this.editData?.data;
    }

    public get isNotRecuringPayment(): boolean {
        return (
            this.isDeductionModal &&
            !this.baseForm.get(PayrollStringEnum.RECURRING)?.value
        );
    }

    public get isLimitedPayment(): boolean {
        return (
            this.isDeductionModal &&
            this.baseForm.get(PayrollStringEnum.LIMITED)?.value
        );
    }

    public get driverConfig(): ITaInput {
        return this.payrollCreditConst.driverConfig(
            this.selectedDriver?.logoName,
            this.selectedDriver?.name
        );
    }

    public get isDeductionModal(): boolean {
        return this.modalType === PayrollStringEnum.MODAL_DEDUCTION;
    }

    public get isCreditModal(): boolean {
        return this.modalType === PayrollStringEnum.MODAL_CREDIT;
    }

    public get isBonusModal(): boolean {
        return this.modalType === PayrollStringEnum.MODAL_BONUS;
    }

    public get isEditMode(): boolean {
        return this.editData?.edit;
    }

    private setupDeleteListeners() {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.type === TableStringEnum.DELETE) {
                    this.onCloseModal();
                }
            });
    }
    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }
}
