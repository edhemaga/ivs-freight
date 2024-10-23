import { Component, Input, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Subject, takeUntil } from 'rxjs';

// Services
import { PayrollCreditService } from './services/payroll-credit.service';

// Models
import { TabOptions } from '@shared/components/ta-tab-switch/models/tab-options.model';
import { PayrollActionType } from '@pages/accounting/pages/payroll/state/models';
import {
    CreatePayrollCreditCommand,
    DriverMinimalResponse,
    EnumValue,
    PayrollCreditModalResponse,
    PayrollCreditType,
    TruckMinimalResponse,
} from 'appcoretruckassist';

// Helpers
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';

import { PayrollSvgRoutes } from '@pages/accounting/pages/payroll/state/utils';

import { PayrollCreditConst } from '@pages/accounting/pages/payroll/state/utils/consts';

import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Components
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalComponent,
} from 'ca-components';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';

@Component({
    selector: 'app-payroll-credit-bonus',
    templateUrl: './payroll-credit-bonus.component.html',
    styleUrls: ['./payroll-credit-bonus.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        CaModalComponent,
        TaTabSwitchComponent,
        CaInputComponent,
        CaInputDropdownComponent,
    ],
})
export class PayrollCreditBonusComponent implements OnInit {
    // Inputs
    @Input() editData: any;

    // Utils
    public svgRoutes = PayrollSvgRoutes;
    public payrollStrings = PayrollStringEnum;
    public taModalActionEnums = TaModalActionEnums;

    private destroy$ = new Subject<void>();

    // State
    public creditTitle: string = '';
    public payrollCreditConst = PayrollCreditConst;

    // Tabs
    public tabs = this.payrollCreditConst.tabs;
    public selectedTab: TabOptions = this.tabs[0];

    // Form
    public payrollCreditForm: UntypedFormGroup;

    // Driver
    public selectedDriver: any;
    public driversDropdownList: EnumValue[];

    // Trucks
    public selectedTruck: EnumValue;
    public trucksDropdownList: { id: number; name: string }[];

    constructor(
        private payrolCreditService: PayrollCreditService,
        private ngbActiveModal: NgbActiveModal,
        private formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.getModalDropdowns();
        this.createForm();
    }

    private createForm(): void {
        this.payrollCreditForm = this.formBuilder.group({
            [PayrollStringEnum.DRIVER_ID]: [null, Validators.required],
            [PayrollStringEnum.TRUCK_ID]: [null],
            [PayrollStringEnum.DATE]: [new Date(), Validators.required],
            [PayrollStringEnum.DESCRIPTION]: [null, Validators.required],
            [PayrollStringEnum.AMOUNT]: [null, Validators.required],
        });
    }

    private getModalDropdowns(): void {
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

    public selectTruck(truck: any): void {
        this.selectedTruck = truck;
        this.creditTitle = truck?.name;
    }

    private mapTrucks(trucks: TruckMinimalResponse[]): void {
        this.trucksDropdownList = trucks.map(({ id, truckNumber }) => {
            return {
                id,
                name: truckNumber,
            };
        });
    }

    public selectDriver(driver: any): void {
        this.selectedDriver = driver;
        this.creditTitle = driver?.name;
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

    // Getters
    public get isEditMode(): boolean {
        return false;
    }

    // TODO: Check this on load to avoid re-rendering
    public get modalTitle(): string {
        if (this.isEditMode) return this.payrollStrings.EDIT_CREDIT;

        return this.payrollStrings.ADD_CREDIT;
    }

    public get driverConfig() {
        return this.payrollCreditConst.driverConfig(
            this.selectedDriver?.logoName,
            this.selectedDriver?.name
        );
    }

    // Tabs
    public onTabChange(tab: TabOptions): void {
        this.selectedTab = tab;

        this.payrollCreditForm
            .get(PayrollStringEnum.DRIVER_ID)
            .clearValidators();
        this.payrollCreditForm
            .get(PayrollStringEnum.TRUCK_ID)
            .clearValidators();

        if (tab.id === 1) {
            this.payrollCreditForm
                .get(PayrollStringEnum.DRIVER_ID)
                .setValidators(Validators.required);
        } else if (tab.id === 2) {
            this.payrollCreditForm
                .get(PayrollStringEnum.TRUCK_ID)
                .setValidators(Validators.required);
        }

        // Re-validate the form to apply changes
        this.payrollCreditForm
            .get(PayrollStringEnum.DRIVER_ID)
            .updateValueAndValidity();
        this.payrollCreditForm
            .get(PayrollStringEnum.TRUCK_ID)
            .updateValueAndValidity();

        this.creditTitle = null;
    }

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    public saveCredit(action: PayrollActionType): void {
        const data = this.generateCreditModel();
        const addNew =
            action === TaModalActionEnums.SAVE ||
            action === TaModalActionEnums.SAVE_AND_ADD_NEW;

        if (addNew)
            this.payrolCreditService
                .addPayrollCredit(data)
                .subscribe(() => {
                    if (action === TaModalActionEnums.SAVE_AND_ADD_NEW) {
                        this.createForm();
                        this.selectDriver('');
                        this.selectTruck('');
                    } else {
                        this.onCloseModal();
                    }
                });
    }

    private generateCreditModel(): CreatePayrollCreditCommand {
        return {
            type: this.selectedTab.name as PayrollCreditType,
            driverId: this.selectedTab.id === 1 ? this.selectedDriver.id : null,
            truckId: this.selectedTab.id === 2 ? this.selectedTruck.id : null,
            description: this.payrollCreditForm.get(
                PayrollStringEnum.DESCRIPTION
            ).value,
            date: MethodsCalculationsHelper.convertDateToBackend(
                this.payrollCreditForm.get(PayrollStringEnum.DATE).value
            ),
            amount: MethodsCalculationsHelper.convertThousanSepInNumber(
                this.payrollCreditForm.get(PayrollStringEnum.AMOUNT).value
            ),
        };
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
