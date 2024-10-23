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
import {
    DriverMinimalResponse,
    EnumValue,
    PayrollCreditModalResponse,
    TruckMinimalResponse,
} from 'appcoretruckassist';

// Helpers
import { PayrollSvgRoutes } from '@pages/accounting/pages/payroll/state/utils';
import { PayrollStringEnum } from '@pages/accounting/pages/payroll/state/enums';
import { PayrollCreditConst } from '@pages/accounting/pages/payroll/state/utils/consts';

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
            driverId: [null, Validators.required],
            truckId: [null, Validators.required],
            date: [new Date(), Validators.required],
            description: [null, Validators.required],
            amount: [null, Validators.required],
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

    private mapTrucks(trucks: TruckMinimalResponse[]): void {
        this.trucksDropdownList = trucks.map(({ id, truckNumber }) => {
            return {
                id,
                name: truckNumber,
            };
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
        console.log(this.driversDropdownList);
    }

    public selectDriver(driver: any) {
        this.selectedDriver = driver;
        console.log(this.selectedDriver);
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
    }

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
