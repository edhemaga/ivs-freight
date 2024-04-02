import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { SettingsLocationService } from 'src/app/pages/settings/pages/settings-location/services/settings-location.service';

import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

// services
import { FormService } from '../../../../../core/services/form/form.service';
import { TaInputService } from '../../../../../core/components/shared/ta-input/ta-input.service';
import { ModalService } from '../../../../../core/components/shared/ta-modal/modal.service';

// enums
import { SettingsOfficeModalStringEnum } from './enums/settings-office-modal-string.enum';

// components
import { InputAddressDropdownComponent } from '../../../../../core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { TaCheckboxCardComponent } from '../../../../../core/components/shared/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputDropdownComponent } from '../../../../../core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '../../../../../core/components/shared/ta-input/ta-input.component';
import { TaModalComponent } from '../../../../../core/components/shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../../../core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';
import { UserModalComponent } from '../../../../../core/components/modals/user-modal/user-modal.component';

// validations
import {
    addressUnitValidation,
    addressValidation,
    departmentValidation,
    officeNameValidation,
    phoneExtension,
    phoneFaxRegex,
    rentValidation,
} from '../../../../../core/components/shared/ta-input/ta-input.regex-validations';

// types
import {
    AddressEntity,
    CompanyOfficeModalResponse,
    CompanyOfficeResponse,
    CreateCompanyOfficeCommand,
    EnumValue,
    UpdateCompanyOfficeCommand,
} from 'appcoretruckassist';

// icons
import { AngularSvgIconModule } from 'angular-svg-icon';

// utils
import {
    convertNumberInThousandSep,
    convertThousanSepInNumber,
} from '../../../../../core/utils/methods.calculations';
import { tab_modal_animation } from '../../../../../core/components/shared/animations/tabs-modal.animation';

@Component({
    selector: 'app-settings-office-modal',
    templateUrl: './settings-office-modal.component.html',
    styleUrls: ['./settings-office-modal.component.scss'],
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

    public dayOptions: EnumValue[];

    private destroy$ = new Subject<void>();

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

    public get departmentContacts(): UntypedFormArray {
        return this.officeForm.get('departmentContacts') as UntypedFormArray;
    }

    private createDepartmentContacts(data?: {
        id: any;
        departmentId: any;
        phone: any;
        extensionPhone: any;
        email: any;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : 0],
            departmentId: [
                data?.departmentId ? data.departmentId : null,
                [Validators.required, ...departmentValidation],
            ],
            phone: [
                data?.phone ? data.phone : null,
                [Validators.required, phoneFaxRegex],
            ],
            extensionPhone: [data?.extensionPhone ? data.extensionPhone : null],
            email: [data?.email ? data.email : null, [Validators.required]],
        });
    }

    public addDepartmentContacts(event: { check: boolean; action: string }) {
        const form = this.createDepartmentContacts();
        if (event.check) {
            this.departmentContacts.push(this.createDepartmentContacts());
        }

        this.inputService.customInputValidator(
            form.get('email'),
            'email',
            this.destroy$
        );
    }

    public removeDepartmentContacts(id: number) {
        this.departmentContacts.removeAt(id);
        this.selectedDepartmentFormArray.splice(id, 1);
    }

    public onSelectContactDepartment(event: any, index: number) {
        this.selectedDepartmentFormArray[index] = event;
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
                    event?.name === SettingsOfficeModalStringEnum.WEEKLY
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
        const { addressUnit, departmentContacts, rent, ...form } =
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
            rent: rent ? convertThousanSepInNumber(rent) : null,
        };

        for (let index = 0; index < departmentContacts.length; index++) {
            departmentContacts[index].departmentId =
                this.selectedDepartmentFormArray[index].id;
        }

        newData = {
            ...newData,
            departmentContacts,
        };

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
        const { addressUnit, departmentContacts, rent, ...form } =
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
            rent: rent ? convertThousanSepInNumber(rent) : null,
        };

        for (let index = 0; index < departmentContacts.length; index++) {
            departmentContacts[index].departmentId =
                this.selectedDepartmentFormArray[index].id;
        }

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
                            ? convertNumberInThousandSep(res.rent)
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
                        this.departmentContacts.push(
                            this.createDepartmentContacts({
                                id: res.departmentContacts[index].id,
                                departmentId:
                                    res.departmentContacts[index].department
                                        .name,
                                phone: res.departmentContacts[index].phone,
                                extensionPhone:
                                    res.departmentContacts[index]
                                        .extensionPhone,
                                email: res.departmentContacts[index].email,
                            })
                        );

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

    public onScrollingBrokerContacts(event: any) {
        this.isDepartmentCardsScrolling = event.target.scrollLeft > 1;
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.officeForm);
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
