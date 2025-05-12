import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormGroup,
    UntypedFormControl,
    Validators,
} from '@angular/forms';

import { AddressEntity } from '@ca-shared/models/address-entity.model';
// Bootstrap
import { Options } from 'ng5-slider';
// Models
import { Tabs } from '@ca-shared/models/tabs.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Mixins
import { AddressMixin } from '@shared/mixins';
import {
    BankResponse,
    CompanyUserModalResponse,
    CompanyUserResponse,
    DepartmentResponse,
    EnumValue,
} from 'appcoretruckassist';
import { forkJoin, of, takeUntil } from 'rxjs';

// Pipes
import { UserModalInputConfigPipe } from '@pages/new-user/modals/user-modal/pipes/user-modal-input-config.pipe';

// Enums
import {
    eUserModalForm,
    eUserDepartments,
    eUserPaymentType,
} from '@pages/new-user/modals/user-modal/enums';
import { eGeneralActions } from '@shared/enums';

// Services
import { UserService } from '@pages/new-user/services/user.service';
import { UserStoreService } from '@pages/new-user/state/services/user-store.service';
import { AddressService } from '@shared/services/address.service';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import {
    CaCustomCardComponent,
    CaInputDatetimePickerComponent,
    CaInputDropdownTestComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaTabSwitchComponent,
    eModalButtonClassType,
    eModalButtonSize,
    InputTestComponent,
    CaInputAddressDropdownComponent,
    CaInputNoteComponent,
} from 'ca-components';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaNgxSliderComponent } from '@shared/components/ta-ngx-slider/ta-ngx-slider.component';

// Interfaces
import { IMappedUser, IUserModal } from '@pages/new-user/interfaces';

// Helpers
import { UserModalHelper } from '@pages/new-user/modals/user-modal/utils/helpers';
import { MethodsCalculationsHelper } from '@shared/utils/helpers';

// Svg Routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrl: './user-modal.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        // Components
        CaModalComponent,
        CaModalButtonComponent,
        CaTabSwitchComponent,
        SvgIconComponent,
        CaInputDropdownTestComponent,
        InputTestComponent,
        CaCustomCardComponent,
        CaInputAddressDropdownComponent,
        CaInputNoteComponent,
        CaInputDatetimePickerComponent,
        TaCheckboxCardComponent,
        TaNgxSliderComponent,

        // Pipes
        UserModalInputConfigPipe,
    ],
})
export class UserModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit
{
    // Inputs
    @Input() editData: IUserModal;

    // Show modal spinner
    public activeAction = null;
    public departmentTabs: Tabs[];
    public dropdownList: CompanyUserModalResponse;
    public labelsBank: BankResponse[] | null;
    // Enums
    public eGeneralActions = eGeneralActions;
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;
    public eUserModalForm = eUserModalForm;
    public eUserDepartments = eUserDepartments;
    public eUserPaymentType = eUserPaymentType;
    // Show modal buttons based on edit mode
    public isEditMode: boolean;
    // Modal title
    public modalTitle: string;
    // Address
    public selectedAddress: AddressEntity = null;
    // Icon routes
    public svgRoutes = SharedSvgRoutes;
    public taxFormTabs: Tabs[];
    public user: CompanyUserResponse;
    public userForm: UntypedFormGroup;
    public userTabs: Tabs[] = UserModalHelper.getUserTabs();

    public selectedDepartment: DepartmentResponse;
    public selectedPaymentType: EnumValue | null;

    public managerOptions: EnumValue[] | null;
    public dispatcherOptions: EnumValue[] | null;
    public commissionOptions: Options = UserModalHelper.getCommissionOptions();

    constructor(
        private userService: UserService,
        public userStoreService: UserStoreService,
        public addressService: AddressService,

        private ngbActiveModal: NgbActiveModal
    ) {
        super();
    }

    get isDispatchOrManager() {
        return (
            this.selectedDepartment?.name === eUserDepartments.DISPATCH ||
            this.selectedDepartment?.name === eUserDepartments.MANAGER
        );
    }

    ngOnInit(): void {
        this.setupModal();
    }

    private setupModal(): void {
        const staticData$ = this.userService.getModalDropdowns();
        this.isEditMode = this.editData?.isEdit;

        const userData$ = this.isEditMode
            ? this.userService.editUserModal(this.editData.id)
            : of(null);

        forkJoin([staticData$, userData$]).subscribe(
            ([dropdownData, userData]) => {
                this.dropdownList = dropdownData;

                this.labelsBank = dropdownData.banks;
                this.managerOptions = dropdownData.managerResponses;
                this.dispatcherOptions = dropdownData.dispatcherResponses;

                this.userForm = UserModalHelper.createForm(userData || {});

                this.user = userData;

                this.selectedAddress = userData?.address;

                this.modalTitle = UserModalHelper.generateModalTitle(
                    this.isEditMode
                );

                this.departmentTabs = UserModalHelper.getDepartmentTabs(
                    userData?.isAdmin
                );

                this.taxFormTabs = UserModalHelper.getTaxFormTabs(
                    userData ? userData.is1099 : true
                );

                this.initListeners();
            }
        );
    }

    private initListeners(): void {
        this.initIncludedInPayrollListener();
    }

    private initIncludedInPayrollListener(): void {
        this.userForm
            .get(eUserModalForm.INCLUDED_IN_PAYROLL)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    UserModalHelper.updateValidators(
                        this.userForm.get(
                            eUserModalForm.START_DATE
                        ) as UntypedFormControl,
                        [Validators.required]
                    );
                    UserModalHelper.updateValidators(
                        this.userForm.get(
                            eUserModalForm.SALARY
                        ) as UntypedFormControl,
                        [Validators.required]
                    );
                } else {
                    UserModalHelper.removeValidators(
                        this.userForm.get(
                            eUserModalForm.START_DATE
                        ) as UntypedFormControl,
                        [Validators.required]
                    );

                    UserModalHelper.removeValidators(
                        this.userForm.get(
                            eUserModalForm.SALARY
                        ) as UntypedFormControl,
                        [Validators.required]
                    );
                }
            });
    }

    public onSelectDepartment(event: DepartmentResponse): void {
        this.selectedDepartment = event;
        this.userForm.get(eUserModalForm.PAYMENT_TYPE).setValue(null);

        if (this.isDispatchOrManager) {
            this.userForm.get(eUserModalForm.PAYMENT_TYPE).enable();
        } else {
            this.userForm.get(eUserModalForm.PAYMENT_TYPE).disable();

            this.userForm.get(eUserModalForm.SALARY).enable();
            this.userForm.get(eUserModalForm.COMMISSION).enable();
        }
    }

    public onSelectBank(event: BankResponse): void {
        if (event) {
            this.userForm.get(eUserModalForm.ROUTING).enable();
            this.userForm.get(eUserModalForm.ACCOUNT).enable();

            UserModalHelper.updateValidators(
                this.userForm.get(eUserModalForm.ROUTING) as UntypedFormControl,
                [Validators.required]
            );
            UserModalHelper.updateValidators(
                this.userForm.get(eUserModalForm.ACCOUNT) as UntypedFormControl,
                [Validators.required]
            );
        } else {
            this.userForm.get(eUserModalForm.ROUTING).patchValue(null);
            this.userForm.get(eUserModalForm.ACCOUNT).patchValue(null);

            this.userForm.get(eUserModalForm.ROUTING).disable();
            this.userForm.get(eUserModalForm.ACCOUNT).disable();

            UserModalHelper.removeValidators(
                this.userForm.get(eUserModalForm.ROUTING) as UntypedFormControl,
                [Validators.required]
            );
            UserModalHelper.removeValidators(
                this.userForm.get(eUserModalForm.ACCOUNT) as UntypedFormControl,
                [Validators.required]
            );
        }
    }

    public onSelectPaymentType(event: DepartmentResponse): void {
        if (event) {
            this.userForm.get(eUserModalForm.SALARY).enable();
            this.userForm.get(eUserModalForm.COMMISSION).enable();
        } else {
            this.userForm.get(eUserModalForm.SALARY).disable();
            this.userForm.get(eUserModalForm.COMMISSION).disable();
        }

        if (event.id === eUserPaymentType.COMMISSION) {
            UserModalHelper.removeValidators(
                this.userForm.get(eUserModalForm.SALARY) as UntypedFormControl,
                [Validators.required]
            );
        } else {
            UserModalHelper.updateValidators(
                this.userForm.get(eUserModalForm.SALARY) as UntypedFormControl,
                [Validators.required]
            );
        }
    }

    public onDepartmentTabChange(tab: Tabs): void {
        const isAdmin = tab.id === 2;
        this.userForm.get(eUserModalForm.IS_ADMIN).setValue(isAdmin);
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) {
            this.selectedAddress = event.address;
        }
    }

    public onModalAction(action: eGeneralActions): void {
        const users: Partial<IMappedUser>[] = [
            {
                isSelected: true,
                fullName: `${this.user?.firstName} ${this.user?.lastName}`,
                id: this.user?.id,
            },
        ];

        this.activeAction = action;

        switch (action) {
            case this.eGeneralActions.CLOSE:
                this.ngbActiveModal.close();
                break;

            case this.eGeneralActions.DEACTIVATE:
                this.userStoreService.dispatchUserStatusChange(
                    { users },
                    this.ngbActiveModal
                );
                break;

            case this.eGeneralActions.DELETE:
                this.userStoreService.dispatchDeleteUsers(
                    { users },
                    this.ngbActiveModal
                );
                break;
            case eGeneralActions.SAVE_AND_ADD_NEW:
            case eGeneralActions.SAVE:
                // eslint-disable-next-line no-case-declarations
                if (this.userForm.invalid) {
                    return;
                }

                const isBaseCommission =
                    this.userForm.get(eUserModalForm.PAYMENT_TYPE).value ===
                    eUserPaymentType.SALARY_AND_COMMISSION;

                const userData = {
                    ...this.userForm.value,
                    address: {
                        ...this.selectedAddress,
                        addressUnit: this.userForm.get(
                            eUserModalForm.ADDRESS_UNIT
                        ).value,
                    },
                    personalEmail:
                        this.userForm.get(eUserModalForm.PERSONAL_EMAIL)
                            .value || null,
                    [isBaseCommission
                        ? eUserModalForm.BASE
                        : eUserModalForm.SALARY]:
                        MethodsCalculationsHelper.convertThousandSepInNumber(
                            this.userForm.value[eUserModalForm.SALARY]
                        ),
                    [eUserModalForm.START_DATE]:
                        MethodsCalculationsHelper.convertDateToBackend(
                            this.userForm.value[eUserModalForm.START_DATE]
                        ),
                    [eUserModalForm.SALARY]: isBaseCommission
                        ? null
                        : MethodsCalculationsHelper.convertThousandSepInNumber(
                              this.userForm.value[eUserModalForm.SALARY]
                          ),
                };

                if (this.isEditMode) {
                    this.userService
                        .editUser({
                            ...userData,
                            id: this.editData.id,
                        })
                        .subscribe(() => {
                            this.userService
                                .editUserModal(this.editData.id)
                                .subscribe((user) =>
                                    this.userStoreService.dispatchUpdateUser(
                                        user
                                    )
                                );
                            this.ngbActiveModal.close();
                        });
                } else {
                    this.userService
                        .createNewUser(userData)
                        .subscribe((newUser) => {
                            if (action === eGeneralActions.SAVE_AND_ADD_NEW) {
                                this.userForm.patchValue(
                                    UserModalHelper.createForm({}).value
                                );

                                // Reset tabs
                                this.departmentTabs =
                                    UserModalHelper.getDepartmentTabs(false);
                                this.taxFormTabs =
                                    UserModalHelper.getTaxFormTabs(true);

                                this.activeAction = null;
                            } else {
                                this.ngbActiveModal.close();
                            }

                            this.userService
                                .editUserModal(newUser.id)
                                .subscribe((user) =>
                                    this.userStoreService.dispatchCreateNewUser(
                                        user
                                    )
                                );
                        });
                }

                break;
        }
    }

    public onTaxFormTabChange(tab: Tabs): void {
        this.userForm.get(eUserModalForm.IS_1099).patchValue(tab.id === 1);
    }

    // Leave for now, as it is not done in backend yet
    public onUserTabChange(): void {}
}
