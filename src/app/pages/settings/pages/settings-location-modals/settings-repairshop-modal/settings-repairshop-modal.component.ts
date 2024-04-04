import { Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// icons
import { AngularSvgIconModule } from 'angular-svg-icon';

// validators
import {
    phoneFaxRegex,
    phoneExtension,
    addressValidation,
    addressUnitValidation,
} from '../../../../../shared/components/ta-input/validators/ta-input.regex-validations';
import {
    repairShopValidation,
    rentValidation,
} from '../../../../../shared/components/ta-input/validators/ta-input.regex-validations';

// models
import {
    AddressEntity,
    RepairShopModalResponse,
    RepairShopResponse,
} from 'appcoretruckassist';

// animations
import { tab_modal_animation } from '../../../../../core/components/shared/animations/tabs-modal.animation';

// services
import { ModalService } from '../../../../../shared/components/ta-modal/services/modal.service';
import { TaInputService } from '../../../../../shared/components/ta-input/services/ta-input.service';
import { RepairService } from 'src/app/shared/services/repair.service';
import { FormService } from '../../../../../core/services/form/form.service';

// components
import { TaInputComponent } from '../../../../../shared/components/ta-input/ta-input.component';
import { TaModalComponent } from '../../../../../shared/components/ta-modal/ta-modal.component';
import { TaInputDropdownComponent } from '../../../../../shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaTabSwitchComponent } from '../../../../../shared/components/ta-tab-switch/ta-tab-switch.component';
import { InputAddressDropdownComponent } from '../../../../../core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { TaCheckboxCardComponent } from '../../../../../shared/components/ta-checkbox-card/ta-checkbox-card.component';

// pipes
import { ActiveItemsPipe } from '../../../../../shared/pipes/active-Items.pipe';

// utils
import {
    convertThousanSepInNumber,
    convertNumberInThousandSep,
} from '../../../../../core/utils/methods.calculations';

@Component({
    selector: 'app-settings-repairshop-modal',
    templateUrl: './settings-repairshop-modal.component.html',
    styleUrls: ['./settings-repairshop-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        TaInputComponent,
        TaInputDropdownComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaCheckboxCardComponent,
        InputAddressDropdownComponent,

        // Pipe
        ActiveItemsPipe,
    ],
})
export class SettingsRepairshopModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public repairShopForm: UntypedFormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
        },
    ];

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public selectedAddress: AddressEntity = null;

    public payPeriods: any[] = [];
    public selectedPayPeriod: any = null;

    public weeklyDays: any[] = [];
    public monthlyDays: any[] = [];
    public selectedDay: any = null;

    public isPhoneExtExist: boolean = false;

    public services: any[] = [];

    public isFormDirty: boolean;

    public repairShopName: string = null;

    public isServiceCardOpen: boolean = true;

    public disableCardAnimation: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private repairService: RepairService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
    }

    private createForm() {
        this.repairShopForm = this.formBuilder.group({
            companyOwned: [false],
            name: [null, [Validators.required, ...repairShopValidation]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            phoneExt: [null, [...phoneExtension]],
            email: [null],
            rent: [null, rentValidation],
            payPeriod: [null],
            weeklyDay: [null],
            monthlyDay: [null],
            servicesHelper: [null],
        });

        this.inputService.customInputValidator(
            this.repairShopForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        let dotAnimation = document.querySelector('.animation-two-tabs');
        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.repairShopForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.repairShopForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateRepariShop(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addRepairShop();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case 'delete': {
                this.deleteRepairShopById(this.editData.id);
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
                    close: false,
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'pay-period': {
                this.selectedPayPeriod = event;
                this.repairShopForm.get('weeklyDay').patchValue(null);
                this.repairShopForm.get('monthlyDay').patchValue(null);
                this.selectedDay = null;
                break;
            }
            case 'day': {
                this.selectedDay = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    public activeRepairService(service) {
        service.active = !service.active;
        this.services = [...this.services];

        this.repairShopForm
            .get('servicesHelper')
            .patchValue(JSON.stringify(this.services));
    }

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    private updateRepariShop(id: number) {
        const { addressUnit, rent, servicesHelper, ...form } =
            this.repairShopForm.value;

        const newData: any = {
            id: id,
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            rent: rent ? convertThousanSepInNumber(rent) : null,
            payPeriod: this.selectedPayPeriod
                ? this.selectedPayPeriod.id
                : null,
            monthlyDay:
                this.selectedPayPeriod?.name === 'Monthly'
                    ? this.selectedDay
                        ? this.selectedDay.id
                        : null
                    : null,
            weeklyDay:
                this.selectedPayPeriod?.name === 'Weekly'
                    ? this.selectedDay
                        ? this.selectedDay.id
                        : null
                    : null,
            serviceTypes: this.services.map((item) => {
                return {
                    serviceType: item.serviceType,
                    active: item.active,
                };
            }),
        };

        this.repairService
            .updateRepairShop(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private addRepairShop() {
        const { addressUnit, rent, servicesHelper, ...form } =
            this.repairShopForm.value;

        const newData: any = {
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            rent: rent ? convertThousanSepInNumber(rent) : null,
            payPeriod: this.selectedPayPeriod
                ? this.selectedPayPeriod.id
                : null,
            monthlyDay:
                this.selectedPayPeriod?.name === 'Monthly'
                    ? this.selectedDay
                        ? this.selectedDay.id
                        : null
                    : null,
            weeklyDay:
                this.selectedPayPeriod?.name === 'Weekly'
                    ? this.selectedDay
                        ? this.selectedDay.id
                        : null
                    : null,
            serviceTypes: this.services.map((item) => {
                return {
                    serviceType: item.serviceType,
                    active: item.active,
                };
            }),
        };

        this.repairService
            .addRepairShop(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private deleteRepairShopById(id: number) {
        this.repairService
            .deleteRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private editRepairShopById(id: number) {
        this.repairService
            .getRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairShopResponse) => {
                    this.repairShopForm.patchValue({
                        companyOwned: res.companyOwned,
                        name: res.name,
                        address: res.address.address,
                        addressUnit: res.address.addressUnit,
                        phone: res.phone,
                        phoneExt: res.phoneExt,
                        email: res.email,
                        rent: res.rent
                            ? convertNumberInThousandSep(res.rent)
                            : null,
                        payPeriod: res.payPeriod ? res.payPeriod.name : null,
                        monthlyDay: res.payPeriod?.name
                            ? res.payPeriod.name === 'Monthly'
                                ? res.monthlyDay.name
                                : res.weeklyDay.name
                            : null,
                    });
                    this.repairShopName = res.name;
                    this.selectedAddress = res.address;
                    this.selectedPayPeriod = res.payPeriod;

                    this.selectedDay =
                        res.payPeriod?.name === 'Monthly'
                            ? res.monthlyDay
                            : res.weeklyDay;

                    this.services = res.serviceTypes.map((item) => {
                        return {
                            id: item.serviceType.id,
                            serviceType: item.serviceType.name,
                            svg: `assets/svg/common/repair-services/${item.logoName}`,
                            active: item.active,
                        };
                    });

                    this.repairShopForm
                        .get('servicesHelper')
                        .patchValue(JSON.stringify(this.services));

                    if (res.phoneExt) {
                        this.isPhoneExtExist = true;
                    }

                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getModalDropdowns() {
        this.repairService
            .getRepairShopModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairShopModalResponse) => {
                    this.payPeriods = res.payPeriods;
                    this.monthlyDays = res.monthlyDays;
                    this.weeklyDays = res.daysOfWeek;
                    this.services = res.serviceTypes.map((item) => {
                        return {
                            id: item.serviceType.id,
                            serviceType: item.serviceType.name,
                            svg: `assets/svg/common/repair-services/${item.logoName}`,
                            active: false,
                        };
                    });

                    this.repairShopForm
                        .get('servicesHelper')
                        .patchValue(JSON.stringify(this.services));

                    if (this.editData?.type === 'edit') {
                        this.disableCardAnimation = true;
                        this.editRepairShopById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.repairShopForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
