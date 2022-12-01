import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    departmentValidation,
    firstNameValidation,
    lastNameValidation,
    phoneExtension,
    routingBankValidation,
    salaryValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AddressEntity, CreateResponse, EnumValue } from 'appcoretruckassist';
import { phoneFaxRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { distinctUntilChanged, takeUntil, Subject } from 'rxjs';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { BankVerificationService } from '../../../services/BANK-VERIFICATION/bankVerification.service';
import { FormService } from '../../../services/form/form.service';
import { UserTService } from '../../user/state/user.service';
import { CompanyUserModalResponse } from '../../../../../../appcoretruckassist/model/companyUserModalResponse';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsOfficeModalComponent } from '../location-modals/settings-office-modal/settings-office-modal.component';
import { Options } from 'ng5-slider';
import { CreateCompanyUserCommand } from '../../../../../../appcoretruckassist/model/createCompanyUserCommand';
import { CompanyUserResponse } from '../../../../../../appcoretruckassist/model/companyUserResponse';
import { UpdateCompanyUserCommand } from '../../../../../../appcoretruckassist/model/updateCompanyUserCommand';
import {
    convertNumberInThousandSep,
    convertDateFromBackend,
} from '../../../utils/methods.calculations';
import {
    convertThousanSepInNumber,
    convertDateToBackend,
} from '../../../utils/methods.calculations';
import { HttpResponseBase } from '@angular/common/http';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, BankVerificationService],
})
export class UserModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;

    public userForm: FormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Basic',
        },
        {
            id: 2,
            name: 'Additional',
        },
    ];

    public typeOfEmploye = [
        {
            id: 3,
            name: 'User',
            checked: true,
        },
        {
            id: 4,
            name: 'Admin',
            checked: false,
        },
    ];

    public ownerType = [
        {
            id: 10,
            name: 'Owner',
            checked: true,
        },
    ];

    public typeOfPayroll = [
        {
            id: 5,
            name: '1099',
            checked: true,
        },
        {
            id: 6,
            name: 'W-2',
            checked: false,
        },
    ];

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

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private userService: UserTService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit() {
        this.createForm();
        this.getModalDropdowns();
        this.onBankSelected();

        if (this.editData) {
            this.getUserById(this.editData.id);
        }
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
        });

        this.formService.checkFormChange(this.userForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
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

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.userForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.userForm);
                    return;
                }
                if (this.editData) {
                    this.updateUser(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addUser();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                }
                break;
            }
            case 'deactivate': {
                if (this.editData) {
                    this.updateUserStatus(this.editData.id);
                }
                break;
            }

            case 'delete': {
                if (this.editData) {
                    this.deleteUserById(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                    });
                }
                break;
            }
            default: {
                break;
            }
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
        if (event.valid) this.selectedAddress = event.address;
    }

    private onBankSelected(): void {
        this.userForm
            .get('bankId')
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(async (value) => {
                this.isBankSelected =
                    await this.bankVerificationService.onSelectBank(
                        this.selectedBank ? this.selectedBank.name : value,
                        this.userForm.get('routingNumber'),
                        this.userForm.get('accountNumber')
                    );
            });
    }

    public onSaveNewBank(bank: { data: any; action: string }) {
        this.selectedBank = bank.data;

        this.bankVerificationService
            .createBank({ name: this.selectedBank.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: this.selectedBank.name,
                    };
                    this.labelsBank = [...this.labelsBank, this.selectedBank];
                },
                error: () => {},
            });
    }

    public onSelectedTab(event: any, action: string) {
        switch (action) {
            case 'user-admin': {
                this.selectedUserAdmin = event;
                break;
            }
            case '1099-w2': {
                this.selectedW21099 = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'department': {
                this.selectedDepartment = event;

                if (
                    ['Dispatch', 'Manager'].includes(
                        this.selectedDepartment?.name
                    )
                ) {
                    this.isPaymentTypeAvailable = true;

                    this.paymentOptions =
                        this.selectedDepartment.name === 'Dispatch'
                            ? this.heleperForDispatchers
                            : this.helperForManagers;
                } else {
                    this.isPaymentTypeAvailable = false;
                    this.paymentOptions = [];
                    this.allowOnlyCommission = false;
                    this.allowPairCommissionBase = false;
                    this.userForm.get('paymentType').reset();
                    this.selectedPayment = null;
                }
                break;
            }
            case 'office': {
                if (event?.canOpenModal) {
                    this.ngbActiveModal.close();
                    this.modalService.setProjectionModal({
                        action: 'open',
                        payload: {
                            key: 'user-modal',
                            value: {},
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

                break;
            }
            default: {
                break;
            }
        }
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

        if (this.selectedAddress) {
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };
        }

        const newData: UpdateCompanyUserCommand = {
            id: id,
            ...form,
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
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
                    ? true
                    : false
                : false,
            includeInPayroll: includeInPayroll,
            paymentType: this.selectedPayment ? this.selectedPayment.id : null,
            salary: salary ? convertThousanSepInNumber(salary) : null,
            startDate: startDate ? convertDateToBackend(startDate) : null,
            is1099: this.selectedW21099
                ? this.selectedW21099.name === '1099'
                    ? true
                    : false
                : false,
            bankId: this.selectedBank ? this.selectedBank.id : null,
            base: base ? convertThousanSepInNumber(base) : null,
            commission: commission ? parseFloat(commission) : null,
        };

        this.userService
            .updateUser(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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

        if (this.selectedAddress) {
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };
        }

        const newData: CreateCompanyUserCommand = {
            ...form,
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            departmentId: this.selectedDepartment
                ? this.selectedDepartment.id
                : null,
            companyOfficeId: this.selectedOffice
                ? this.selectedOffice.id
                : null,
            userType: null,
            isAdmin: this.selectedUserAdmin
                ? this.selectedUserAdmin.name === 'Admin'
                    ? true
                    : false
                : false,
            includeInPayroll: includeInPayroll,
            paymentType: this.selectedPayment ? this.selectedPayment.id : null,
            salary: salary ? convertThousanSepInNumber(salary) : null,
            startDate: startDate ? convertDateToBackend(startDate) : null,
            is1099: this.selectedW21099
                ? this.selectedW21099.name === '1099'
                    ? true
                    : false
                : false,
            bankId: this.selectedBank ? this.selectedBank.id : null,
            base: base ? convertThousanSepInNumber(base) : null,
            commission: commission ? parseFloat(commission) : null,
        };

        this.userService
            .addUser(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteUserById(id: number) {
        this.userService
            .deleteUserById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private getUserById(id: number) {
        this.userService
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
                            ? convertNumberInThousandSep(res.salary)
                            : null,
                        startDate: res.startDate
                            ? convertDateFromBackend(res.startDate)
                            : null,
                        is1099: res.is1099,
                        bankId: res.bank ? res.bank.name : null,
                        routingNumber: res.routingNumber,
                        accountNumber: res.accountNumber,
                        base: res.base
                            ? convertNumberInThousandSep(res.base)
                            : null,
                        commission: res.commission,
                        note: res.note,
                    });

                    this.selectedAddress = res.address;
                    this.selectedDepartment = res.department;
                    this.selectedOffice = res.companyOffice;
                    this.selectedUserType = res.userType;
                    this.selectedPayment = res.paymentType;

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

                    this.userFullName = res.firstName?.concat(
                        ' ',
                        res.lastName
                    );

                    this.isPhoneExtExist = !!res.extensionPhone;
                },
                error: () => {},
            });
    }

    private updateUserStatus(id: number) {
        this.userService
            .updateUserStatus(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: HttpResponseBase) => {
                    if (res.status === 200 || res.status === 204) {
                        this.userStatus = !this.userStatus;

                        this.modalService.changeModalStatus({
                            name: 'deactivate',
                            status: this.userStatus,
                        });
                    }
                },
                error: () => {},
            });
    }

    private getModalDropdowns() {
        this.userService
            .getModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyUserModalResponse) => {
                    this.departments = res.departments;
                    this.labelsBank = res.banks;
                    this.offices = res.officeShortResponses;
                    this.helperForManagers = res.managerResponses;
                    this.heleperForDispatchers = res.dispatcherResponses;
                },
                error: () => {},
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
