import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
    distinctUntilChanged,
    Subject,
    takeUntil,
    switchMap,
    of,
    debounceTime,
    takeWhile,
} from 'rxjs';

// bootstrap
import { Options } from 'ng5-slider';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// validations
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    departmentValidation,
    firstNameValidation,
    lastNameValidation,
    phoneExtension,
    phoneFaxRegex,
    routingBankValidation,
    salaryValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { UserService } from '@pages/user/services/user.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { UserProfileUpdateService } from '@shared/services/user-profile-update.service';

//Animation
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

//Utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

//Models
import {
    CompanyUserModalResponse,
    CompanyUserResponse,
    CreateCompanyUserCommand,
    UpdateCompanyUserCommand,
    CheckUserByEmailResponse,
    AddressEntity,
    CreateResponse,
    EnumValue,
} from 'appcoretruckassist';
import { Tabs } from '@shared/models/tabs.model';

//Components
import { SettingsOfficeModalComponent } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-office-modal/settings-office-modal.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaNgxSliderComponent } from '@shared/components/ta-ngx-slider/ta-ngx-slider.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { UserModalStringEnum } from '@pages/user/pages/user-modal/enums';

// svg-routes
import { UserModalSvgRoutes } from '@pages/user/pages/user-modal/utils/svg-routes/user-modal-svg-routes';

// config
import { UserModalConfig } from '@pages/user/pages/user-modal/utils/constants';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [ModalService, BankVerificationService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        TaAppTooltipV2Component,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaCheckboxCardComponent,
        TaNgxSliderComponent,
        TaInputNoteComponent,
        TaInputDropdownComponent,
    ],
})
export class UserModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;
    public userForm: UntypedFormGroup;
    public selectedTab: number = 1;
    public tabs: Tabs[] = UserModalConfig.MODAL_MAIN_TABS;
    public typeOfEmploye = UserModalConfig.TYPE_OF_EMPLOYEE;
    public typeOfPayroll = UserModalConfig.TYPE_OF_PAYROLL;
    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };
    public commissionOptions: Options = {
        floor: 2.5,
        ceil: 25,
        step: 0.5,
        showSelectionBar: true,
        hideLimitLabels: true,
    };
    public labelsBank: any[] = [];
    public departments: any[] = [];
    public offices: any[] = [];
    public paymentOptions: any[] = [];
    public helperForManagers: any[] = [];
    public heleperForDispatchers: any[] = [];
    public selectedDepartment: any = null;
    public selectedOffice: any = null;
    public selectedBank: any = null;
    public selectedPayment: any = null;
    public selectedAddress: AddressEntity = null;
    public selectedUserType: EnumValue = null;
    public selectedUserAdmin: any = this.typeOfEmploye[0];
    public selectedW21099: any = this.typeOfPayroll[0];
    public isPhoneExtExist: boolean = false;
    public isBankSelected: boolean = false;
    public isFormDirty: boolean;
    public isPaymentTypeAvailable: boolean = false;
    public allowOnlyCommission: boolean = false;
    public allowPairCommissionBase: boolean = false;
    public userFullName: string = null;
    public userStatus: boolean = true;
    public disableCardAnimation: boolean = false;
    private destroy$ = new Subject<void>();
    public isEmailCheckCompleted: boolean;
    public currentUserStatus: string;
    public userModalSvgRoutes: UserModalSvgRoutes = UserModalSvgRoutes;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private companyUserService: UserService,
        private userProfileUpdateService: UserProfileUpdateService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        this.onBankSelected();

        this.trackUserPayroll();

        this.checkUserEmail();
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        const mappedEvent = {
            ...this.editData,
            data: {
                ...this.editData?.data,
                name: this.editData?.data?.firstName,
            },
        };

        switch (data.action) {
            case TableStringEnum.SAVE: {
                if (this.userForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.userForm);
                    return;
                }
                if (this.editData?.id) {
                    this.updateUser(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addUser();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case TableStringEnum.DEACTIVATE:
                this.ngbActiveModal.close();

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.USER_1,
                        type: this.selectedTab
                            ? TableStringEnum.DEACTIVATE
                            : TableStringEnum.ACTIVATE,
                        image: true,
                    }
                );
                break;

            case TableStringEnum.DELETE:
                this.ngbActiveModal.close();

                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.USER_1,
                        type: TableStringEnum.DELETE,
                        image: true,
                    }
                );
                break;
            default:
                break;
        }
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        let dotAnimation = document.querySelector('.animation-two-tabs');
        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) {
            this.selectedAddress = event.address;
        }
    }

    public onSaveNewBank(bank: { data: any; action: string }) {
        this.selectedBank = bank.data;

        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: bank.data.name,
                    };
                    this.labelsBank = [...this.labelsBank, this.selectedBank];
                },
                error: () => {},
            });
    }

    public onSelectedTab(event: Tabs, action: string): void {
        event.checked = true;
        switch (action) {
            case UserModalStringEnum.USER_ADMIN:
                this.selectedUserAdmin = event;
                break;
            case UserModalStringEnum.W2_1099:
                this.selectedW21099 = event;
                break;
            default:
                break;
        }
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'department': {
                this.selectedDepartment = event;

                if (this.userForm.get('includeInPayroll').value) {
                    this.inputService.changeValidators(
                        this.userForm.get('salary'),
                        true,
                        [],
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('startDate'),
                        true,
                        [],
                        false
                    );
                    if (
                        ['Dispatch', 'Manager'].includes(
                            this.selectedDepartment?.name
                        )
                    ) {
                        this.isPaymentTypeAvailable = true;
                        this.inputService.changeValidators(
                            this.userForm.get('paymentType')
                        );
                        this.paymentOptions =
                            this.selectedDepartment.name === 'Dispatch'
                                ? this.heleperForDispatchers
                                : this.helperForManagers;
                    } else {
                        this.isPaymentTypeAvailable = false;
                        this.paymentOptions = [];
                        this.allowOnlyCommission = false;
                        this.allowPairCommissionBase = false;
                        this.inputService.changeValidators(
                            this.userForm.get('paymentType'),
                            false
                        );
                        this.selectedPayment = null;
                    }
                }

                break;
            }
            case 'office': {
                let newData = { data: {} };
                if (!this.editData?.id) {
                    const {
                        addressUnit,
                        includeInPayroll,
                        salary,
                        startDate,
                        base,
                        commission,
                        ...form
                    } = this.userForm.value;

                    newData.data = {
                        ...form,
                        phone: form.phone ?? null,
                        address: this.updateSelectedAddressUnit(addressUnit),
                        departmentId: this.selectedDepartment
                            ? this.selectedDepartment.id
                            : null,
                        companyOfficeId: this.selectedOffice
                            ? this.selectedOffice.id
                            : null,
                        userType: this.selectedUserType
                            ? this.selectedUserType.name === 'Owner'
                                ? this.selectedUserType.id
                                : 0
                            : 0,
                        email: form.email ?? null,
                        isAdmin:
                            this.selectedUserAdmin.name === 'User'
                                ? false
                                : true,
                        includeInPayroll: includeInPayroll,
                        paymentType: this.selectedPayment
                            ? this.selectedPayment.id
                            : null,
                        salary: salary
                            ? MethodsCalculationsHelper.convertThousanSepInNumber(
                                  salary
                              )
                            : null,
                        startDate: startDate
                            ? MethodsCalculationsHelper.convertDateToBackend(
                                  startDate
                              )
                            : null,
                        is1099: this.selectedW21099
                            ? this.selectedW21099.name === '1099'
                            : false,
                        bankId: this.selectedBank ? this.selectedBank.id : null,
                        base: base
                            ? MethodsCalculationsHelper.convertThousanSepInNumber(
                                  base
                              )
                            : null,
                        commission: commission ? parseFloat(commission) : null,
                    };
                }
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();
                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'user-modal',
                            value: this.editData?.id ? this.editData : newData,
                        },
                        component: SettingsOfficeModalComponent,
                        size: 'small',
                        type: 'user-modal',
                    });
                } else {
                    this.selectedOffice = event;
                }

                break;
            }
            case 'bank': {
                this.selectedBank = event;
                if (!event) {
                    this.userForm.get('bankId').patchValue(null);
                }
                break;
            }
            case 'payment': {
                this.selectedPayment = event;

                this.allowOnlyCommission = ['Load %', 'Revenue %'].includes(
                    this.selectedPayment?.name
                );

                this.allowPairCommissionBase = [
                    'Base + Load %',
                    'Base + Revenue %',
                ].includes(this.selectedPayment?.name);

                if (this.allowPairCommissionBase) {
                    this.inputService.changeValidators(
                        this.userForm.get('base')
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('salary'),
                        false
                    );
                } else {
                    this.inputService.changeValidators(
                        this.userForm.get('base'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('salary'),
                        true
                    );
                }

                if (this.allowOnlyCommission) {
                    this.inputService.changeValidators(
                        this.userForm.get('salary'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('base'),
                        false
                    );
                }

                break;
            }
            default: {
                break;
            }
        }
    }
    private updateSelectedAddressUnit(addressUnit: string): AddressEntity {
        if (this.selectedAddress) {
            const updatedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };

            return updatedAddress.address ? updatedAddress : null;
        }

        return null;
    }

    private createForm() {
        this.userForm = this.formBuilder.group({
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            personalPhone: [null, [phoneFaxRegex]],
            personalEmail: [null],
            departmentId: [
                null,
                [Validators.required, ...departmentValidation],
            ],
            companyOfficeId: [null],
            userType: [null],
            isAdmin: [false],
            phone: [null, [phoneFaxRegex]],
            extensionPhone: [null, [...phoneExtension]],
            email: [null, [Validators.required]],
            //  Payroll part
            includeInPayroll: [false],
            paymentType: [null],
            salary: [null, salaryValidation],
            startDate: [null],
            is1099: [null],
            bankId: [null, [...bankValidation]],
            routingNumber: [null, routingBankValidation],
            accountNumber: [null, accountBankValidation],
            base: [null],
            commission: [null],
            note: [null],
            resetPassword: [false],
        });

        this.inputService.customInputValidator(
            this.userForm.get('personalEmail'),
            'email',
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.userForm.get('email'),
            'email',
            this.destroy$
        );
    }

    private checkUserEmail(): void {
        if (this.editData?.type === TableStringEnum.EDIT) return;
        this.userForm
            .get(TableStringEnum.EMAIL_2)
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                takeWhile(() => !this.isEmailCheckCompleted),
                debounceTime(500),
                switchMap((value) => {
                    if (this.userForm.get(TableStringEnum.EMAIL_2).valid)
                        return this.userProfileUpdateService.checkUserByEmail(
                            value
                        );
                    return of(null);
                })
            )
            .subscribe({
                next: (res: CheckUserByEmailResponse) => {
                    this.isEmailCheckCompleted = true;
                    if (res) {
                        this.userForm.patchValue({
                            firstName: res.firstName,
                            lastName: res.lastName,
                            email: res.email,
                            phone: res.phone,
                            address: res.address.address,
                        });

                        this.selectedAddress = res.address;
                    }
                },
                error: () => {
                    this.isEmailCheckCompleted = false;
                },
            });
    }

    public resetDataByEmail(event: boolean) {
        if (event) {
            this.isEmailCheckCompleted = false;
            this.userForm.patchValue({
                firstName: null,
                lastName: null,
                email: null,
                phone: null,
                address: null,
            });
            this.selectedAddress = null;
            this.checkUserEmail();
        }
    }

    private trackUserPayroll() {
        this.userForm
            .get('includeInPayroll')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.userForm.get('salary')
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('startDate')
                    );
                    if (
                        ['Dispatch', 'Manager'].includes(
                            this.selectedDepartment?.name
                        )
                    ) {
                        this.isPaymentTypeAvailable = true;
                        this.inputService.changeValidators(
                            this.userForm.get('paymentType')
                        );
                        this.paymentOptions =
                            this.selectedDepartment.name === 'Dispatch'
                                ? this.heleperForDispatchers
                                : this.helperForManagers;
                    } else {
                        this.isPaymentTypeAvailable = false;
                        this.paymentOptions = [];
                        this.allowOnlyCommission = false;
                        this.allowPairCommissionBase = false;
                        this.inputService.changeValidators(
                            this.userForm.get('paymentType'),
                            false
                        );
                        this.selectedPayment = null;
                    }

                    this.inputService.changeValidators(
                        this.userForm.get('bankId')
                    );
                } else {
                    this.inputService.changeValidators(
                        this.userForm.get('paymentType'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('salary'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('base'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('startDate'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('bankId'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('routingNumber'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.userForm.get('accountNumber'),
                        false
                    );

                    this.selectedBank = null;
                    this.selectedPayment = null;
                }
            });
    }

    private onBankSelected(): void {
        this.userForm
            .get('bankId')
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(() => {
                const timeout = setTimeout(async () => {
                    this.isBankSelected =
                        await this.bankVerificationService.onSelectBank(
                            this.selectedBank ? this.selectedBank.name : null,
                            this.userForm.get('routingNumber'),
                            this.userForm.get('accountNumber')
                        );
                    clearTimeout(timeout);
                }, 100);
            });
    }

    private updateUser(id: number) {
        const {
            addressUnit,
            includeInPayroll,
            salary,
            startDate,
            base,
            commission,
            ...form
        } = this.userForm.value;

        const newData: UpdateCompanyUserCommand = {
            id: id,
            ...form,
            address: this.updateSelectedAddressUnit(addressUnit),
            departmentId: this.selectedDepartment
                ? this.selectedDepartment.id
                : null,
            companyOfficeId: this.selectedOffice
                ? this.selectedOffice.id
                : null,
            userType: this.selectedUserType
                ? this.selectedUserType.name === 'Owner'
                    ? this.selectedUserType.id
                    : 0
                : 0,
            isAdmin: this.selectedUserAdmin
                ? this.selectedUserAdmin.name === 'Admin'
                : false,
            includeInPayroll: includeInPayroll,
            paymentType: this.selectedPayment ? this.selectedPayment.id : null,
            salary: salary
                ? MethodsCalculationsHelper.convertThousanSepInNumber(salary)
                : null,
            startDate: startDate
                ? MethodsCalculationsHelper.convertDateToBackend(startDate)
                : null,
            is1099: this.selectedW21099
                ? this.selectedW21099.name === '1099'
                : false,
            bankId: this.selectedBank ? this.selectedBank.id : null,
            base: base
                ? MethodsCalculationsHelper.convertThousanSepInNumber(base)
                : null,
            commission: commission ? parseFloat(commission) : null,
        };

        this.companyUserService
            .updateUser(newData)
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

    private addUser() {
        const {
            addressUnit,
            includeInPayroll,
            salary,
            startDate,
            base,
            commission,
            ...form
        } = this.userForm.value;

        const newData: CreateCompanyUserCommand = {
            ...form,
            address: this.updateSelectedAddressUnit(addressUnit),
            departmentId: this.selectedDepartment
                ? this.selectedDepartment.id
                : null,
            companyOfficeId: this.selectedOffice
                ? this.selectedOffice.id
                : null,
            userType: null,
            isAdmin: this.selectedUserAdmin
                ? this.selectedUserAdmin.name === 'Admin'
                : false,
            includeInPayroll: includeInPayroll,
            paymentType: this.selectedPayment ? this.selectedPayment.id : null,
            salary: salary
                ? MethodsCalculationsHelper.convertThousanSepInNumber(salary)
                : null,
            startDate: startDate
                ? MethodsCalculationsHelper.convertDateToBackend(startDate)
                : null,
            is1099: this.selectedW21099
                ? this.selectedW21099.name === '1099'
                : false,
            bankId: this.selectedBank ? this.selectedBank.id : null,
            base: base
                ? MethodsCalculationsHelper.convertThousanSepInNumber(base)
                : null,
            commission: commission ? parseFloat(commission) : null,
        };

        this.companyUserService
            .addUser(newData)
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

    private deleteUserById(id: number) {
        this.companyUserService
            .deleteUserById(
                id,
                this.selectedTab
                    ? TableStringEnum.ACTIVE
                    : TableStringEnum.INACTIVE
            )
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

    private getUserById(id: number) {
        this.companyUserService
            .getUserByid(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyUserResponse) => {
                    this.userForm.patchValue({
                        firstName: res.firstName,
                        lastName: res.lastName,
                        address: res.address?.address,
                        addressUnit: res.address?.addressUnit,
                        personalPhone: res.personalPhone,
                        personalEmail: res.personalEmail,
                        departmentId: res.department
                            ? res.department.name
                            : null,
                        companyOfficeId: res.companyOffice
                            ? res.companyOffice.name
                            : null,
                        userType: res.userType ? res.userType.name : null,
                        isAdmin: res.isAdmin,
                        phone: res.phone,
                        extensionPhone: res.extensionPhone,
                        email: res.email,
                        includeInPayroll: res.includeInPayroll ? true : false,
                        paymentType: res.paymentType
                            ? res.paymentType.name
                            : null,
                        salary: res.salary
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.salary
                              )
                            : null,
                        startDate: res.startDate
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  res.startDate
                              )
                            : null,
                        is1099: res.is1099,
                        bankId: res.bank ? res.bank.name : null,
                        routingNumber: res.routingNumber,
                        accountNumber: res.accountNumber,
                        base: res.base
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.base
                              )
                            : null,
                        commission: res.commission,
                        note: res.note,
                    });

                    this.selectedAddress = res.address;
                    this.selectedDepartment = res.department;
                    this.selectedOffice = res.companyOffice;
                    this.selectedUserType = res.userType;
                    this.selectedPayment = res.paymentType;
                    this.currentUserStatus = res.userStatus;

                    this.typeOfEmploye = this.typeOfEmploye.map(
                        (item, index) => ({
                            ...item,
                            checked: index === (res.isAdmin ? 1 : 0),
                        })
                    );

                    this.selectedUserAdmin = {
                        ...this.typeOfEmploye[res.isAdmin ? 1 : 0],
                    };

                    this.allowOnlyCommission = ['Load %', 'Revenue %'].includes(
                        this.selectedPayment?.name
                    );

                    this.allowPairCommissionBase = [
                        'Base + Load %',
                        'Base + Revenue %',
                    ].includes(this.selectedPayment?.name);

                    this.userStatus = res.status !== 1;

                    this.isPaymentTypeAvailable = [
                        'Dispatch',
                        'Manager',
                    ].includes(this.selectedDepartment?.name);

                    if (
                        ['Dispatch', 'Manager'].includes(
                            this.selectedDepartment?.name
                        )
                    ) {
                        this.paymentOptions =
                            this.selectedDepartment.name === 'Dispatch'
                                ? this.heleperForDispatchers
                                : this.helperForManagers;
                    }

                    this.typeOfEmploye = this.typeOfEmploye.map(
                        (item, index) => {
                            return {
                                ...item,
                                checked: res.isAdmin && index === 1,
                            };
                        }
                    );

                    this.typeOfPayroll = this.typeOfPayroll.map(
                        (item, index) => {
                            return {
                                ...item,
                                checked: !res.is1099 && index === 1,
                            };
                        }
                    );

                    this.onSelectedTab(
                        res.isAdmin
                            ? this.typeOfEmploye[1]
                            : this.typeOfEmploye[0],
                        'user-admin'
                    );

                    this.onSelectedTab(
                        res.is1099
                            ? this.typeOfPayroll[0]
                            : this.typeOfPayroll[1],
                        '1099-w2'
                    );

                    this.selectedBank = res.bank;

                    this.isBankSelected = !!this.selectedBank;

                    this.userFullName = res.firstName?.concat(
                        ' ',
                        res.lastName
                    );

                    this.isPhoneExtExist = !!res.extensionPhone;
                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getModalDropdowns() {
        this.companyUserService
            .getModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyUserModalResponse) => {
                    this.departments = res.departments;
                    this.labelsBank = res.banks;
                    this.offices = res.officeShortResponses;
                    this.helperForManagers = res.managerResponses;
                    this.heleperForDispatchers = res.dispatcherResponses;

                    if (this.editData?.id) {
                        this.disableCardAnimation = true;
                        this.getUserById(this.editData.id);
                    }
                    if (this.editData?.data && !this.editData?.id) {
                        this.userForm.patchValue({
                            firstName: this.editData.data.firstName,
                            lastName: this.editData.data.lastName,
                            address:
                                this.editData.data.address?.address ?? null,
                            addressUnit:
                                this.editData.data.address?.addressUnit ?? null,
                            personalPhone: this.editData.data.personalPhone,
                            personalEmail: this.editData.data.personalEmail,
                            departmentId: this.editData.data.departmentId
                                ? this.departments[
                                      this.editData.data.departmentId - 1
                                  ].name
                                : null,
                            companyOfficeId:
                                this.editData.data.companyOfficeId ?? null,
                            userType: this.editData.data.userType
                                ? this.editData.data.userType.name
                                : null,
                            isAdmin: this.editData.data.isAdmin,
                            phone: this.editData.data.phone,
                            extensionPhone: this.editData.data.extensionPhone,
                            email: this.editData.data.email,
                            includeInPayroll: this.editData.data
                                .includeInPayroll
                                ? true
                                : false,
                            paymentType: this.editData.data.paymentType
                                ? this.editData.data.paymentType.name
                                : null,
                            salary: this.editData.data.salary
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      this.editData.data.salary
                                  )
                                : null,
                            startDate: this.editData.data.startDate
                                ? MethodsCalculationsHelper.convertDateFromBackend(
                                      this.editData.data.startDate
                                  )
                                : null,
                            is1099: this.editData.data.is1099,
                            bankId: this.editData.data.bank
                                ? this.editData.data.bank.name
                                : null,
                            routingNumber: this.editData.data.routingNumber,
                            accountNumber: this.editData.data.accountNumber,
                            base: this.editData.data.base
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      this.editData.data.base
                                  )
                                : null,
                            commission: this.editData.data.commission,
                            note: this.editData.data.note,
                        });

                        this.selectedAddress = this.editData.data.address;
                        this.selectedDepartment =
                            this.departments[
                                this.editData.data.departmentId - 1
                            ];
                        this.selectedOffice = this.editData.data.companyOffice;
                        this.selectedUserType = this.editData.data.userType;
                        this.selectedPayment = this.editData.data.paymentType;

                        this.allowOnlyCommission = [
                            'Load %',
                            'Revenue %',
                        ].includes(this.selectedPayment?.name);

                        this.allowPairCommissionBase = [
                            'Base + Load %',
                            'Base + Revenue %',
                        ].includes(this.selectedPayment?.name);

                        this.userStatus = this.editData.data.status !== 1;

                        this.isPaymentTypeAvailable = [
                            'Dispatch',
                            'Manager',
                        ].includes(this.selectedDepartment?.name);

                        if (
                            ['Dispatch', 'Manager'].includes(
                                this.selectedDepartment?.name
                            )
                        ) {
                            this.paymentOptions =
                                this.selectedDepartment.name === 'Dispatch'
                                    ? this.heleperForDispatchers
                                    : this.helperForManagers;
                        }

                        this.typeOfEmploye = this.typeOfEmploye.map((item) => {
                            return {
                                ...item,
                                checked:
                                    item.id === 3
                                        ? !this.editData.data.isAdmin
                                        : this.editData.data.isAdmin,
                            };
                        });

                        this.typeOfPayroll = this.typeOfPayroll.map((item) => {
                            return {
                                ...item,
                                checked:
                                    item.id === 6
                                        ? !this.editData.data.is1099
                                        : this.editData.data.is1099,
                            };
                        });

                        this.onSelectedTab(
                            this.editData.data.isAdmin
                                ? this.typeOfEmploye[1]
                                : this.typeOfEmploye[0],
                            'user-admin'
                        );

                        this.onSelectedTab(
                            this.editData.data.is1099
                                ? this.typeOfPayroll[0]
                                : this.typeOfPayroll[1],
                            '1099-w2'
                        );

                        this.selectedBank = this.editData.data.bank;

                        this.isBankSelected = !!this.selectedBank;

                        this.userFullName =
                            this.editData.data.firstName?.concat(
                                ' ',
                                this.editData.data.lastName
                            );

                        this.isPhoneExtExist =
                            !!this.editData.data.extensionPhone;
                        this.startFormChanges();
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.userForm);
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
