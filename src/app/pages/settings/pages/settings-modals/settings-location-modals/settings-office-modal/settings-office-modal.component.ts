import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormArray,
    FormGroup,
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
    CompanyOfficeDepartmentContactResponse,
    CompanyOfficeModalResponse,
    CompanyOfficeResponse,
    CreateCompanyOfficeCommand,
    DepartmentResponse,
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
import { SettingsOfficeModalStringEnum } from './enums/settings-office-modal-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TaModalActionEnums } from '@shared/components/ta-modal/enums';
import { SettingsFormEnum } from '@pages/settings/pages/settings-modals/enums';

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
        TaModalTableComponent,
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

    private destroy$ = new Subject<void>();

    public svgRoutes = SettingsLocationSvgRoutes;

    public formConfig = SettingsOfficeConfig;

    public phoneConfig: ITaInput = SettingsOfficeConfig.getPhoneInputConfig();
    public phoneExtConfig: ITaInput =
        SettingsOfficeConfig.getPhoneExtInputConfig();
    public emailConfig: ITaInput = SettingsOfficeConfig.getEmailInputConfig();
    public addressConfig: ITaInput =
        SettingsOfficeConfig.getAddressInputConfig();
    public addressUnitConfig: ITaInput =
        SettingsOfficeConfig.getAddressUnitInputConfig();
    public payPeriodConfig: ITaInput =
        SettingsOfficeConfig.getPayPeriodInputConfig();
    public rentConfig: ITaInput = SettingsOfficeConfig.getRentConfig();

    public repairShopModalSvgRoutes = RepairShopModalSvgRoutes;
    public modalTableTypeEnum = ModalTableTypeEnum;
    public departmentFormValid: boolean = true;
    public isNewContactAdded: boolean;
    public isCreatedNewDepartmentRow: boolean;
    public departmentContactsVisible: boolean;
    public departments: DepartmentResponse[];
    public departmentContacts: CompanyOfficeDepartmentContactResponse[] = [];

    public isResetSelected: boolean = false;

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

    private createForm(): void {
        this.officeForm = this.formBuilder.group({
            isOwner: [false],
            name: [null, [Validators.required, ...officeNameValidation]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, phoneFaxRegex],
            extensionPhone: [null, [...phoneExtension]],
            email: [null],
            departmentContacts: this.formBuilder.array([]),
            rent: [null, rentValidation],
            payPeriod: [null],
            monthlyDay: [null],
            weeklyDay: [null],
        });

        this.inputService.customInputValidator(
            this.officeForm.get(TableStringEnum.EMAIL_2),
            TableStringEnum.EMAIL_2,
            this.destroy$
        );
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        const dotAnimation = document.querySelector('.animation-two-tabs');
        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public onModalAction({ action }: { action: string }): void {
        if (action === TaModalActionEnums.CLOSE) {
            this.handleModalClose();
        } else if (action === TaModalActionEnums.SAVE) {
            this.handleModalSave();
        } else if (action === TaModalActionEnums.SAVE_AND_ADD_NEW) {
            this.handleModalSave(true);
        } else if (action === TaModalActionEnums.DELETE) {
            this.deleteCompanyOfficeById(this.editData.id);
            this.setModalSpinner({
                action: TaModalActionEnums.DELETE,
                status: true,
                close: false,
            });
        }
    }

    private handleModalClose(): void {
        if (this.editData?.canOpenModal) {
            switch (this.editData?.key) {
                case 'user-modal':
                    this.modalService.setProjectionModal({
                        action: TableStringEnum.CLOSE,
                        payload: { key: this.editData.key, value: null },
                        component: UserModalComponent,
                        size: TableStringEnum.SMALL,
                        type: this.editData.type,
                        closing: 'fastest',
                    });
                    break;
                default:
                    break;
            }
        }
    }

    private handleModalSave(addNew?: boolean): void {
        if (this.officeForm.invalid || !this.isFormDirty) {
            this.inputService.markInvalid(this.officeForm);
            return;
        }
        if (this.editData?.type === TableStringEnum.EDIT) {
            this.updateCompanyOffice(this.editData.id);
        } else {
            this.addCompanyOffice(addNew);
        }
        this.setModalSpinner({ action: null, status: true, close: false });
    }

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onSelectDropdown(event: EnumValue, action: string): void {
        switch (action) {
            case SettingsOfficeModalStringEnum.PAY_PERIOD:
                this.handlePayPeriodSelection(event);
                break;
            case SettingsOfficeModalStringEnum.DAY:
                this.selectedDay = event;
                break;
            default:
                break;
        }
    }

    private handlePayPeriodSelection(event: EnumValue): void {
        this.selectedPayPeriod = event;

        this.officeForm
            .get(SettingsOfficeModalStringEnum.MONTHLY_DAY)
            .patchValue(null);

        this.officeForm
            .get(SettingsOfficeModalStringEnum.WEEKLY_DAY)
            .patchValue(null);

        this.selectedDay = null;

        this.dayOptions =
            event.name === SettingsOfficeModalStringEnum.WEEKLY
                ? this.weeklyDays
                : this.monthlyDays;

        this.inputService.changeValidators(
            this.officeForm.get(SettingsOfficeModalStringEnum.MONTHLY_DAY),
            true
        );
    }

    private updateCompanyOffice(id: number): void {
        const { addressUnit, rent, ...formValues } = this.officeForm.value;

        const updatedOffice: UpdateCompanyOfficeCommand = {
            id,
            ...formValues,
            address: { ...this.selectedAddress, addressUnit },
            payPeriod: this.selectedPayPeriod?.id || null,
            monthlyDay: this.getSelectedDay(
                SettingsOfficeModalStringEnum.MONTHLY
            ),
            weeklyDay: this.getSelectedDay(
                SettingsOfficeModalStringEnum.WEEKLY
            ),
            rent: rent
                ? MethodsCalculationsHelper.convertThousanSepInNumber(rent)
                : null,
            departmentContacts: this.mapDepartmentContacts(),
        };

        this.settingsLocationService
            .updateCompanyOffice(updatedOffice)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () =>
                    this.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    }),
                error: () =>
                    this.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    }),
            });
    }

    private addCompanyOffice(addNew?: boolean): void {
        const { addressUnit, rent, ...formValues } = this.officeForm.value;

        const newOffice: CreateCompanyOfficeCommand = {
            ...formValues,
            address: { ...this.selectedAddress, addressUnit },
            payPeriod: this.selectedPayPeriod?.id || null,
            monthlyDay: this.getSelectedDay(
                SettingsOfficeModalStringEnum.MONTHLY
            ),
            weeklyDay: this.getSelectedDay(
                SettingsOfficeModalStringEnum.WEEKLY
            ),
            rent: rent
                ? MethodsCalculationsHelper.convertThousanSepInNumber(rent)
                : null,
            departmentContacts: this.mapDepartmentContacts(),
        };

        this.settingsLocationService
            .addCompanyOffice(newOffice)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (addNew) {
                        this.officeForm.reset();
                        this.officeForm
                            .get(SettingsFormEnum.IS_OWNER)
                            .patchValue(true);
                        this.departmentContacts = [];
                        this.isCreatedNewDepartmentRow = false;
                        this.isNewContactAdded = false;
                        this.departmentContactsVisible = false;
                        this.isResetSelected = !this.isResetSelected;
                        this.setModalSpinner({
                            action: null,
                            status: false,
                            close: false,
                        });
                    } else {
                        this.handleModalResponse();
                    }
                },
                error: () =>
                    this.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    }),
            });
    }

    private handleModalResponse(): void {
        if (this.editData?.canOpenModal) {
            this.modalService.setProjectionModal({
                action: TableStringEnum.CLOSE,
                payload: { key: this.editData.key, value: null },
                component: UserModalComponent,
                size: TableStringEnum.SMALL,
                type: this.editData.type,
                closing: 'slowlest',
            });
        } else {
            this.setModalSpinner({ action: null, status: true, close: true });
        }
    }

    private mapDepartmentContacts(): FormArray {
        const departmentContactsArray = this.officeForm.get(
            SettingsOfficeModalStringEnum.DEPARTMENT_CONTACTS
        ) as FormArray;

        return departmentContactsArray.value.map(
            (contact: CompanyOfficeDepartmentContactResponse) => ({
                ...contact,
                departmentId: this.departments.find(
                    (dept) => dept.name === contact.department
                ).id,
            })
        );
    }

    private getSelectedDay(payPeriodName: string): number | null {
        return this.selectedPayPeriod?.name === payPeriodName &&
            this.selectedDay
            ? this.selectedDay.id
            : null;
    }

    private deleteCompanyOfficeById(id: number): void {
        this.settingsLocationService
            .deleteCompanyOfficeById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () =>
                    this.setModalSpinner({
                        action: TableStringEnum.DELETE,
                        status: true,
                        close: true,
                    }),
                error: () =>
                    this.setModalSpinner({
                        action: TableStringEnum.DELETE,
                        status: false,
                        close: false,
                    }),
            });
    }

    private editCompanyOfficeById(id: number): void {
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
                        monthlyDay:
                            res.payPeriod?.name ===
                            SettingsOfficeModalStringEnum.MONTHLY
                                ? res.monthlyDay?.name
                                : null,
                        weeklyDay:
                            res.payPeriod?.name ===
                            SettingsOfficeModalStringEnum.WEEKLY
                                ? res.weeklyDay?.name
                                : null,
                    });

                    this.officeName = res.name;
                    this.selectedAddress = res.address;
                    this.selectedPayPeriod = res.payPeriod;
                    this.selectedDay =
                        res.payPeriod?.name ===
                        SettingsOfficeModalStringEnum.MONTHLY
                            ? res.monthlyDay
                            : res.weeklyDay;

                    if (res.extensionPhone) {
                        this.isPhoneExtExist = true;
                    }
                    this.departmentContacts = res.departmentContacts;
                    this.departmentContactsVisible =
                        !!res.departmentContacts.length;

                    // Set up the department contacts
                    this.officeForm.setControl(
                        SettingsOfficeModalStringEnum.DEPARTMENT_CONTACTS,
                        this.formBuilder.array(
                            res.departmentContacts.map((contact) => ({
                                ...contact,
                                departmentId: this.departments.find(
                                    (department) =>
                                        department.name ===
                                        contact.department.name
                                )?.id,
                            }))
                        )
                    );

                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getCompanyOfficeDropdowns(): void {
        this.settingsLocationService
            .getModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyOfficeModalResponse) => {
                    this.monthlyDays = res.payPeriodMonthly;
                    this.payPeriods = res.payPeriod;
                    this.departments = res.departments;
                    this.weeklyDays = res.dayOfWeek;
                    if (this.editData?.type === TableStringEnum.EDIT) {
                        this.editCompanyOfficeById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
            });
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.officeForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormDirty: boolean) => {
                this.isFormDirty = isFormDirty;
            });
    }

    public handleModalTableValueEmit(
        departmentForm: CompanyOfficeDepartmentContactResponse[]
    ): void {
        const departmentContactsArray = this.officeForm.get(
            SettingsOfficeModalStringEnum.DEPARTMENT_CONTACTS
        ) as FormArray;

        departmentContactsArray.clear();

        departmentForm.forEach((contact) => {
            departmentContactsArray.push(
                this.createDepartmentContactFormGroup(contact)
            );
        });

        this.departmentContactsVisible = !!departmentForm.length;
    }

    private createDepartmentContactFormGroup(
        contact: CompanyOfficeDepartmentContactResponse
    ): FormGroup {
        return this.formBuilder.group({
            department: [contact.department || null],
            phone: [contact.phone || null],
            extensionPhone: [contact.extensionPhone || null],
            email: [contact.email || null],
        });
    }

    public handleModalTableValidStatusEmit(validStatus: boolean): void {
        this.departmentFormValid = validStatus;
        this.isFormDirty = true;
    }

    public addContact(): void {
        if (this.departmentFormValid) {
            this.isNewContactAdded = true;
            this.isCreatedNewDepartmentRow = true;
            this.departmentContactsVisible = true;

            setTimeout(() => {
                this.isNewContactAdded = false;
                this.isCreatedNewDepartmentRow = false;
            }, 400);
        }
    }

    private setModalSpinner(config: {
        action: string;
        status: boolean;
        close: boolean;
    }): void {
        this.modalService.setModalSpinner(config);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
