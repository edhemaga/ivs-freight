import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Subject, takeUntil } from 'rxjs';

// services
import { FormService } from '@shared/services/form.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { AddressService } from '@shared/services/address.service';

// components
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { UserModalComponent } from '@pages/user/pages/user-modal/user-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import {
    CaInputAddressDropdownComponent,
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalButtonComponent,
    CaModalComponent,
    eModalButtonClassType,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

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
    DepartmentResponse,
    EnumValue,
    UpdateCompanyOfficeCommand,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { OfficeContactExtended } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-office-modal/models/office-contact-extended.model';

// icons
import { AngularSvgIconModule } from 'angular-svg-icon';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Form configuration
import { SettingsOfficeConfig } from './config';

// Svg routes
import { RepairShopModalSvgRoutes } from '@pages/repair/pages/repair-modals/repair-shop-modal/utils/svg-routes';
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Enums
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { SettingsOfficeModalStringEnum } from './enums/settings-office-modal-string.enum';
import { DropActionsStringEnum, TableStringEnum } from '@shared/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// Helpers
import { DropActionNameHelper } from '@shared/utils/helpers';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

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
        NgbTooltipModule,

        // Component
        CaInputComponent,
        CaInputDropdownComponent,
        CaModalComponent,
        TaTabSwitchComponent,
        TaCheckboxCardComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaModalTableComponent,
        TaAppTooltipV2Component,
        CaModalButtonComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class SettingsOfficeModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit, OnDestroy
{
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

    public isCardAnimationDisabled: boolean = false;

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

    public destroy$ = new Subject<void>();

    public formConfig = SettingsOfficeConfig;

    public phoneConfig: ITaInput = SettingsOfficeConfig.getPhoneInputConfig();
    public phoneExtConfig: ITaInput =
        SettingsOfficeConfig.getPhoneExtInputConfig();
    public emailConfig: ITaInput = SettingsOfficeConfig.getEmailInputConfig();
    public addressUnitConfig: ITaInput =
        SettingsOfficeConfig.getAddressUnitInputConfig();
    public payPeriodConfig: ITaInput =
        SettingsOfficeConfig.getPayPeriodInputConfig();
    public rentConfig: ITaInput = SettingsOfficeConfig.getRentConfig();

    public repairShopModalSvgRoutes = RepairShopModalSvgRoutes;
    public modalTableTypeEnum = ModalTableTypeEnum;

    // contacts
    public departmentContacts: OfficeContactExtended[] = [];
    public updatedDepartmentContacts: OfficeContactExtended[] = [];

    public isNewContactAdded: boolean = false;
    public isEachContactRowValid: boolean = true;

    public departmentOptions: DepartmentResponse[] = [];

    public taModalActionEnum = TaModalActionEnum;
    public svgRoutes = SharedSvgRoutes;
    public eModalButtonClassType = eModalButtonClassType;
    public activeAction!: string;
    public data: CompanyOfficeResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // change detection
        private cdRef: ChangeDetectorRef,

        // services
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsLocationService: SettingsLocationService,
        private formService: FormService,
        private ngbActiveModal: NgbActiveModal,
        public dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        public addressService: AddressService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();

        this.getCompanyOfficeDropdowns();

        this.confirmationActivationSubscribe();
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.action !== TableStringEnum.CLOSE)
                    this.ngbActiveModal?.close();
            });
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
            rent: [null, rentValidation],
            payPeriod: [null],
            monthlyDay: [null],
            weeklyDay: [null],
            contacts: [null],
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

    public onModalAction(action: string): void {
        this.activeAction = action;
        if (action === TaModalActionEnum.CLOSE) {
            this.handleModalClose();
        } else if (action === TaModalActionEnum.SAVE) {
            this.handleModalSave();
        } else if (action === TaModalActionEnum.SAVE_AND_ADD_NEW) {
            this.handleModalSave(true);
        } else if (action === TaModalActionEnum.DELETE) {
            this.deleteCompanyOfficeById();
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
        } else {
            this.ngbActiveModal.close();
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
        const { address, addressUnit, rent, ...formValues } = this.officeForm.value;

        const departmentContacts = this.mapContacts(this.departmentContacts);

        const updatedOffice: UpdateCompanyOfficeCommand = {
            id,
            ...formValues,
            address: { ...address, addressUnit },
            payPeriod: this.selectedPayPeriod?.id || null,
            monthlyDay: this.getSelectedDay(
                SettingsOfficeModalStringEnum.MONTHLY
            ),
            weeklyDay: this.getSelectedDay(
                SettingsOfficeModalStringEnum.WEEKLY
            ),
            rent: rent
                ? MethodsCalculationsHelper.convertThousandSepInNumber(rent)
                : null,
            departmentContacts,
        };

        this.settingsLocationService
            .updateCompanyOffice(updatedOffice)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => this.handleModalClose(),
                error: () => (this.activeAction = null),
            });
    }

    private addCompanyOffice(addNew?: boolean): void {
        const { address, addressUnit, rent, ...formValues } = this.officeForm.value;

        const departmentContacts = this.mapContacts(this.departmentContacts);

        const newOffice: CreateCompanyOfficeCommand = {
            ...formValues,
            address: { ...address, addressUnit },
            payPeriod: this.selectedPayPeriod?.id || null,
            monthlyDay: this.getSelectedDay(
                SettingsOfficeModalStringEnum.MONTHLY
            ),
            weeklyDay: this.getSelectedDay(
                SettingsOfficeModalStringEnum.WEEKLY
            ),
            rent: rent
                ? MethodsCalculationsHelper.convertThousandSepInNumber(rent)
                : null,
            departmentContacts,
        };

        this.settingsLocationService
            .addCompanyOffice(newOffice)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.handleModalResponse();
                    if (addNew) {
                        this.modalService.openModal(
                            SettingsOfficeModalComponent,
                            {
                                size: TableStringEnum.SMALL,
                            }
                        );
                    }
                },
                error: () => (this.activeAction = null),
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
            this.ngbActiveModal.close();
        }
    }

    private mapContacts(
        contacts: OfficeContactExtended[],
        isFormPatch: boolean = false
    ): OfficeContactExtended[] {
        return contacts.map((contact, index) => {
            const { department, phone, extensionPhone, email, phoneExt } =
                contact;

            return isFormPatch
                ? {
                      department: (department as DepartmentResponse).name,
                      phone,
                      phoneExt:
                          extensionPhone ??
                          SettingsOfficeModalStringEnum.EMPTY_STRING,
                      email,
                  }
                : {
                      id: this.updatedDepartmentContacts[index]?.id,
                      departmentId: this.departmentOptions.find(
                          (item) => item.name === department
                      )?.id,
                      phone,
                      extensionPhone: phoneExt,
                      email,
                  };
        });
    }

    private getSelectedDay(payPeriodName: string): number | null {
        return this.selectedPayPeriod?.name === payPeriodName &&
            this.selectedDay
            ? this.selectedDay.id
            : null;
    }

    private deleteCompanyOfficeById(): void {
        const eventData = {
            id: this.editData.id,
            type: DropActionsStringEnum.DELETE_ITEM,
        };

        const name = DropActionNameHelper.dropActionNameDriver(
            eventData,
            DropActionsStringEnum.OFFICE
        );

        this.dropDownService.dropActionCompanyLocation(
            eventData,
            name,
            this.data
        );
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
                        contacts: this.mapContacts(
                            res.departmentContacts,
                            true
                        ),
                    });
                    this.data = res;
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

                    this.updatedDepartmentContacts = res.departmentContacts;

                    setTimeout(() => {
                        this.startFormChanges();

                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
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
                    this.weeklyDays = res.dayOfWeek;

                    this.departmentOptions = res.departments;

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

    public addContact(): void {
        if (!this.isEachContactRowValid) return;

        this.isNewContactAdded = true;

        setTimeout(() => {
            this.isNewContactAdded = false;
        }, 400);
    }

    public handleModalTableValueEmit(
        modalTableDataValue: OfficeContactExtended[]
    ): void {
        this.departmentContacts = modalTableDataValue;

        this.officeForm
            .get(SettingsOfficeModalStringEnum.CONTACTS)
            .patchValue(this.departmentContacts);

        this.cdRef.detectChanges();
    }

    public handleModalTableValidStatusEmit(
        isEachContactRowValid: boolean
    ): void {
        this.isEachContactRowValid = isEachContactRowValid;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
