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
import { AddressEntity, CreateResponse } from 'appcoretruckassist';
import { phoneFaxRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { distinctUntilChanged, takeUntil, Subject, take } from 'rxjs';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { BankVerificationService } from '../../../services/BANK-VERIFICATION/bankVerification.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { FormService } from '../../../services/form/form.service';
import { UserTService } from '../../user/state/user.service';
import { CompanyUserModalResponse } from '../../../../../../appcoretruckassist/model/companyUserModalResponse';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsOfficeModalComponent } from '../../settings/settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { Options } from 'ng5-slider';

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

    public isPhoneExtExist: boolean = false;
    public isBankSelected: boolean = false;

    public isFormDirty: boolean;

    public isPaymentTypeAvailable: boolean = false;
    public allowOnlyCommission: boolean = false;
    public allowPairCommissionBase: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private userService: UserTService,
        private bankVerificationService: BankVerificationService,
        private notificationService: NotificationService,
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
            personalPhone: [null, [phoneFaxRegex, Validators.required]],
            personalEmail: [null],
            departmentId: [
                null,
                [Validators.required, ...departmentValidation],
            ],
            mainOfficeId: [null],
            userType: [null],
            employePhone: [null, [phoneFaxRegex, Validators.required]],
            employePhoneExt: [null, [...phoneExtension]],
            employeEmail: [null, [Validators.required]],
            isIncludePayroll: [false],
            paymentType: [null],
            startDate: [null],
            payrollType: [null],
            salary: [null, salaryValidation],
            base: [null],
            commission: [null],
            bankId: [null, [...bankValidation]],
            routingNumber: [null, routingBankValidation],
            accountNumber: [null, accountBankValidation],
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
            this.userForm.get('employeEmail'),
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
                    this.notificationService.success(
                        'Successfuly add new bank',
                        'Success'
                    );
                    this.selectedBank = {
                        id: res.id,
                        name: this.selectedBank.name,
                    };
                    this.labelsBank = [...this.labelsBank, this.selectedBank];
                },
                error: () => {
                    this.notificationService.error(
                        "Can't add new bank",
                        'Error'
                    );
                },
            });
    }

    public onSelectedTab(event: any, action: String) {
        switch (action) {
            case 'user-admin': {
                break;
            }
            case '1099-w2': {
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
                console.log('department: ', this.selectedDepartment);

                if (
                    ['Dispatch', 'Manager'].includes(
                        this.selectedDepartment.name
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
                    this.selectedPayment.name
                );

                this.allowPairCommissionBase = [
                    'Base + Load %',
                    'Base + Revenue %',
                ].includes(this.selectedPayment.name);

                break;
            }
            default: {
                break;
            }
        }
    }

    private updateUser(id: number) {}

    private addUser() {}

    private deleteUserById(id: number) {}

    private getUserById(id: number) {}

    private getModalDropdowns() {
        this.userService
            .getModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyUserModalResponse) => {
                    console.log('modal get: ', res);
                    this.departments = res.departments;
                    this.labelsBank = res.banks;
                    this.offices = res.officeShortResponses;
                    this.helperForManagers = res.managerResponses;
                    this.heleperForDispatchers = res.dispatcherResponses;
                },
                error: (error: any) => {
                    this.notificationService.error(error, 'Error');
                },
            });
    }

    // Checkbox Card
    public payrollCheckboxCard: boolean = true;
    public toggleCheckboxCard() {
        this.payrollCheckboxCard = !this.payrollCheckboxCard;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
