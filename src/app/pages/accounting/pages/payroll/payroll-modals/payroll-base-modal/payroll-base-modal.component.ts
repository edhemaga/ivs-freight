import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

// Components
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalComponent,
} from 'ca-components';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';

// Const
import { PayrollCreditConst } from '@pages/accounting/pages/payroll/state/utils/consts';
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { PayrollSvgRoutes } from '@pages/accounting/pages/payroll/state/utils';

// Models
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import {
    DriverMinimalResponse,
    EnumValue,
    PayrollCreditModalResponse,
    TruckMinimalResponse,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { PayrollModalType } from '@pages/accounting/pages/payroll/state/models';

// Services
import { PayrollCreditService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-credit-bonus/services/payroll-credit.service';
import { PayrollBonusService } from '@pages/accounting/pages/payroll/payroll-modals/payroll-bonus-modal/services/payroll-bonus.service';

@Component({
    selector: 'app-payroll-base-modal',
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        CaModalComponent,
        CaInputComponent,
        TaInputComponent,
        TaTabSwitchComponent,
        CaInputDropdownComponent,
        TaCheckboxComponent,
    ],
    templateUrl: './payroll-base-modal.component.html',
    styleUrls: ['./payroll-base-modal.component.scss'],
})
export class PayrollBaseModalComponent implements OnInit {
    @Input() footerTemplate: TemplateRef<any>;
    @Input() baseForm: FormGroup;
    @Input() modalTitle: string;
    @Input() isDriverAndTruckTabs: boolean;
    @Input() modalType: PayrollModalType;
    public payrollCreditConst = PayrollCreditConst;
    public svgRoutes = PayrollSvgRoutes;
    public tabs = [];
    public selectedTab: TabOptions;

    // Drivers
    public selectedDriver: any;
    public driversDropdownList: EnumValue[];
    // Trucks
    public selectedTruck: EnumValue;
    public trucksDropdownList: { id: number; name: string }[];
    private destroy$ = new Subject<void>();
    public creditTitle: string = '';
    public periodTabs: TabOptions[];

    constructor(
        private payrolCreditService: PayrollCreditService,
        private payrollBonusService: PayrollBonusService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.generateTabs();
        this.setupEventListeners();
    }

    private generateTabs(): void {
        if (this.isDriverAndTruckTabs) {
            this.tabs = this.payrollCreditConst.tabs;
            this.driverAndTruckDropdowns();
            this.selectedTab = this.tabs[0];
        }

        if (this.isDeductionModal) {
            this.periodTabs = [...this.payrollCreditConst.periodTabs];
        }

        if (this.isBonusModal) {
            this.getEmployeesDropdown();
        }
    }

    private setupEventListeners(): void {
        this.setupDeductionListeners();
    }

    private setupDeductionListeners() {
        if (!this.isDeductionModal) return;

        this.baseForm
            .get(PayrollStringEnum.RECURRING)
            .valueChanges.subscribe((value) => {
                const payAmount = this.baseForm.get(
                    PayrollStringEnum.LIMITED_AMOUNT
                );
                const numberOfPayments = this.baseForm.get(
                    PayrollStringEnum.LIMITED_NUMBER
                );

                if (value) {
                    const tabToCheck = this.periodTabs[0];
                    tabToCheck.checked = true;
                    payAmount.setValidators(Validators.required);
                    numberOfPayments.setValidators(Validators.required);
                } else {
                    this.periodTabs = this.payrollCreditConst.periodTabs.map(
                        (tab) => ({ ...tab, checked: false })
                    );
                    numberOfPayments.patchValue(null);
                    payAmount.patchValue(null);
                    payAmount.clearValidators();
                    numberOfPayments.clearValidators();
                }

                payAmount.updateValueAndValidity();
                numberOfPayments.updateValueAndValidity();
            });
    }

    private getEmployeesDropdown(): void {
        this.payrollBonusService.getPayrollBonusModal().subscribe((res) => {
            console.log(res);
        });
    }

    private driverAndTruckDropdowns(): void {
        this.payrolCreditService
            .getPayrollCreditModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: PayrollCreditModalResponse) => {
                    this.mapDrivers(res.drivers);
                    this.mapTrucks(res.trucks);
                },
                error: () => {},
            });
    }

    private mapDrivers(drivers: DriverMinimalResponse[]): void {
        this.driversDropdownList = drivers.map(
            ({ id, firstName, lastName, avatarFile }) => {
                return {
                    id,
                    logoName: avatarFile?.url,
                    name: firstName + ' ' + lastName,
                    avatarFile: avatarFile?.url,
                };
            }
        );
    }

    public selectDriver(driver: any): void {
        this.selectedDriver = driver;
        this.baseForm
            .get(PayrollStringEnum.SELECTED_DRIVER_ID)
            .patchValue(driver?.id ?? null);
        this.creditTitle = driver?.name;
    }

    private mapTrucks(trucks: TruckMinimalResponse[]): void {
        this.trucksDropdownList = trucks.map(({ id, truckNumber }) => {
            return {
                id,
                name: truckNumber,
            };
        });
    }

    public selectTruck(truck: any): void {
        this.selectedTruck = truck;
        this.baseForm
            .get(PayrollStringEnum.SELECTED_TRUCK_ID)
            .patchValue(truck?.id ?? null);
        this.creditTitle = truck?.name;
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
        } else if (tab.id === 2) {
            this.baseForm
                .get(PayrollStringEnum.TRUCK_ID)
                .setValidators(Validators.required);
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
        return true;
    }

    public get isNotRecuringPayment(): boolean {
        return (
            this.isDeductionModal &&
            !this.baseForm.get(PayrollStringEnum.RECURRING)?.value
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

    public get isBonusModal(): boolean {
        return this.modalType === PayrollStringEnum.MODAL_BONUS;
    }

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }
}
