import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// services
import { FormService } from '@shared/services/form.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';

// components
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';

// validations
import {
    addressUnitValidation,
    addressValidation, 
    officeNameValidation,
    phoneExtension,
    phoneFaxRegex,
    rentValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// models
import {
    AddressEntity,
    CompanyOfficeModalResponse,
    CompanyOfficeResponse,
    CreateCompanyOfficeCommand,
    EnumValue,
    UpdateCompanyOfficeCommand,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// icons
import { AngularSvgIconModule } from 'angular-svg-icon';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Form configuration
import { SettingsOfficeConfig } from './config';

// Svg routes
import { SettingsLocationSvgRoutes } from '@pages/settings/pages/settings-location/utils';
import { RepairShopModalSvgRoutes } from '@pages/repair/pages/repair-modals/repair-shop-modal/utils/svg-routes/repair-shop-modal-svg-routes';

// Enums
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';

@Component({
    selector: 'app-settings-office-modal',
    templateUrl: './settings-office-modal.component.html',
    styleUrls: ['./settings-office-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
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
        TaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaModalTableComponent
    ],
})
export class SettingsOfficeModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public officeForm: UntypedFormGroup;

    public selectedTab: number = 1;

    public selectedAddress: AddressEntity = null;
    public isPhoneExtExist: boolean = false;

    public payPeriods: EnumValue[] = [];
    public selectedPayPeriod: EnumValue = null;

    public weeklyDays: EnumValue[] = [];
    public monthlyDays: EnumValue[] = [];
    public selectedDay: EnumValue = null;

    public departments: any[] = [];
    public selectedDepartmentFormArray: any[] = [];
    public isDepartmentContactCardOpen: boolean = false;

    public isFormDirty: boolean;

    public officeName: string = null;

    public isDepartmentCardsScrolling: boolean = false;

    public disableCardAnimation: boolean = false;

    public tabs: any[] = [
        {
            id: 1,
            name: 'Detail',
            checked: true,
        },
        {
            id: 2,
            name: 'Contact',
        },
    ];

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public dayOptions: EnumValue[];
    public contacts = [];

    private destroy$ = new Subject<void>();

    public svgRoutes = SettingsLocationSvgRoutes;
    
    public formConfig = SettingsOfficeConfig;
    
    public phoneConfig: ITaInput = SettingsOfficeConfig.getPhoneInputConfig();
    public phoneExtConfig: ITaInput = SettingsOfficeConfig.getPhoneExtInputConfig();
    public emailConfig: ITaInput = SettingsOfficeConfig.getEmailInputConfig();
    public addressConfig: ITaInput = SettingsOfficeConfig.getAddressInputConfig();
    public addressUnitConfig: ITaInput = SettingsOfficeConfig.getAddressUnitInputConfig();
    public payPeriodConfig: ITaInput = SettingsOfficeConfig.getPayPeriodInputConfig();
    public rentConfig: ITaInput = SettingsOfficeConfig.getRentConfig();

    public repairShopModalSvgRoutes = RepairShopModalSvgRoutes;
    public modalTableTypeEnum = ModalTableTypeEnum;
    public contactAddedCounter: number = 0;
    public isContactFormValid: boolean;
    public isNewContactAdded: boolean;
    public modalTableDataValue: any;
    public isCreatedNewStopItemsRow: boolean;
    public isDeliveryItemsVisible: boolean;
    
    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsLocationService: SettingsLocationService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getCompanyOfficeDropdowns();
    }

    private createForm() {
        this.officeForm = this.formBuilder.group({
            isOwner: [false],
            name: [null, [Validators.required, ...officeNameValidation]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            extensionPhone: [null, [...phoneExtension]],
            email: [null],
            departmentContacts: this.formBuilder.array([]),
            rent: [null, rentValidation],
            payPeriod: [null],
            monthlyDay: [null],
            weeklyDay: [null],
        });

        this.inputService.customInputValidator(
            this.officeForm.get('email'),
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
                if (this.editData?.canOpenModal) {
                    switch (this.editData?.key) {
                        case 'user-modal': {
                            this.modalService.setProjectionModal({
                                action: 'close',
                                payload: {
                                    key: this.editData?.key,
                                    value: null,
                                },
                                component: UserModalComponent,
                                size: 'small',
                                type: this.editData?.type,
                                closing: 'fastest',
                            });
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
                break;
            }
            case 'save': {
                if (this.officeForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.officeForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateCompanyOffice(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addCompanyOffice();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case 'delete': {
                this.deleteCompanyOfficeById(this.editData.id);
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

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onSelectDropdown(event: EnumValue, action: string) {
        switch (action) {
            case 'pay-period': {
                this.selectedPayPeriod = event;

                this.officeForm.get('monthlyDay').patchValue(null);
                this.officeForm.get('weeklyDay').patchValue(null);
                this.selectedDay = null;
                this.dayOptions =
                    event?.name === 'Weekly'
                        ? this.weeklyDays
                        : this.monthlyDays;
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

    private updateCompanyOffice(id: number) {
        const { addressUnit, rent, ...form } =
            this.officeForm.value;

        let newData: UpdateCompanyOfficeCommand = {
            id: id,
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
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
            rent: rent
                ? MethodsCalculationsHelper.convertThousanSepInNumber(rent)
                : null,
        };

       
        const departmentContacts = this.modalTableDataValue;
        for (let index = 0; index < departmentContacts.length; index++) {
            departmentContacts[index].departmentId =
                this.selectedDepartmentFormArray[index].id;
        }

        this.settingsLocationService
            .updateCompanyOffice(newData)
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

    private addCompanyOffice() {
        const { addressUnit, rent, ...form } =
            this.officeForm.value;

        let newData: CreateCompanyOfficeCommand = {
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
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
            rent: rent
                ? MethodsCalculationsHelper.convertThousanSepInNumber(rent)
                : null,
        };

        const departmentContacts = this.modalTableDataValue;
        for (let index = 0; index < departmentContacts.length; index++) {
            departmentContacts[index].departmentId =
                this.selectedDepartmentFormArray[index].id;
        }

        console.log(departmentContacts);

        newData = {
            ...newData,
            departmentContacts,
        };

        this.settingsLocationService
            .addCompanyOffice(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case 'user-modal': {
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: UserModalComponent,
                                    size: 'small',
                                    type: this.editData?.type,
                                    closing: 'slowlest',
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
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

    private deleteCompanyOfficeById(id: number) {
        this.settingsLocationService
            .deleteCompanyOfficeById(id)
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

    private editCompanyOfficeById(id: number) {
        this.settingsLocationService
            .getCompanyOfficeById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyOfficeResponse) => {
                    this.officeForm.patchValue({
                        isOwner: res.isOwner,
                        name: res.name,
                        address: res.address.address,
                        addressUnit: res.address.addressUnit,
                        phone: res.phone,
                        extensionPhone: res.extensionPhone,
                        email: res.email,
                        rent: res.rent
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.rent
                              )
                            : null,
                        payPeriod: res.payPeriod ? res.payPeriod.name : null,
                        monthlyDay: res.payPeriod?.name
                            ? res.payPeriod.name === 'Monthly'
                                ? res.monthlyDay.name
                                : res.weeklyDay.name
                            : null,
                    });
                    this.officeName = res.name;
                    this.selectedAddress = res.address;
                    this.selectedPayPeriod = res.payPeriod;

                    this.selectedDay = res.payPeriod
                        ? res.payPeriod.name === 'Monthly'
                            ? res.monthlyDay
                            : res.weeklyDay
                        : null;

                    if (res.extensionPhone) {
                        this.isPhoneExtExist = true;
                    }

                    for (
                        let index = 0;
                        index < res.departmentContacts.length;
                        index++
                    ) {

                        this.selectedDepartmentFormArray[index] = {
                            ...res.departmentContacts[index],
                            name: res.departmentContacts[index].department.name,
                            duplicateId:
                                res.departmentContacts[index].department.id,
                        };
                    }
                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getCompanyOfficeDropdowns() {
        this.settingsLocationService
            .getModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyOfficeModalResponse) => {
                    this.monthlyDays = res.payPeriodMonthly;
                    this.payPeriods = res.payPeriod;
                    this.departments = res.departments;
                    this.weeklyDays = res.dayOfWeek;

                    if (this.editData?.type === 'edit') {
                        this.disableCardAnimation = true;
                        this.editCompanyOfficeById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.officeForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public handleModalTableValueEmit(modalTableDataValue): void {
        this.modalTableDataValue = modalTableDataValue;
    }

    public handleModalTableValidStatusEmit(validStatus: boolean): void {
        this.isContactFormValid = validStatus;
        this.isFormDirty = true; 
    }

    public addContact(): void {
        this.isNewContactAdded = true;
        this.isCreatedNewStopItemsRow = true;
        this.isDeliveryItemsVisible = true;

        setTimeout(() => {
            this.isNewContactAdded = false;
            this.isCreatedNewStopItemsRow = false;
        }, 400);
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
