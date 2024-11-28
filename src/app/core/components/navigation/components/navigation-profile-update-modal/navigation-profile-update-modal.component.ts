import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// validations
import {
    addressUnitValidation,
    addressValidation,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';
import { phoneFaxRegex } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { UserProfileUpdateService } from '@shared/services/user-profile-update.service';
import { FormService } from '@shared/services/form.service';

// components
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { CaUploadFilesComponent } from 'ca-components';

// models
import {
    AddressEntity,
    SignInResponse,
    UpdateUserCommand,
    UserResponse,
} from 'appcoretruckassist';

// utils
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';
import { NavigationDataConstants } from '../../utils/constants/navigation-data.constants';

@Component({
    selector: 'app-navigation-profile-update-modal',
    templateUrl: './navigation-profile-update-modal.component.html',
    styleUrls: ['./navigation-profile-update-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [FormService, ModalService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Modal
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaCheckboxCardComponent,
        TaCustomCardComponent,
        // components
        CaUploadFilesComponent,
    ],
})
export class NavigationProfileUpdateModalComponent
    implements OnInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    public uploadOptionsConstants = NavigationDataConstants.UPLOAD_OPTIONS;

    private user: SignInResponse;

    public selectedTab: number = 1;

    public profileUserForm: UntypedFormGroup;

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

    public selectedAddress: AddressEntity = null;
    public userPasswordTyping: boolean = false;
    public correctPassword: boolean = false;
    public setNewPassword: boolean = false;
    public loadingOldPassword: boolean = false;

    public isFormDirty: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private userProfileUpdateService: UserProfileUpdateService,
        private modalService: ModalService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.user = JSON.parse(localStorage.getItem('user'));

        this.getUserById();
        this.changeCheckboxDetection();
        this.disableCardAnimation = true;
    }

    private createForm() {
        this.profileUserForm = this.formBuilder.group({
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            phone: [null, phoneFaxRegex],
            email: [null],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            createNewPassword: [false],
            oldPassword: [null, passwordValidation],
            // New password And password (confirmation)
            newPassword: [null, passwordValidation],
            password: [null, passwordValidation],
            avatar: [null],
        });

        this.inputService.customInputValidator(
            this.profileUserForm.get('email'),
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
        if (data.action === 'close') {
            return;
        }

        if (this.profileUserForm.invalid || !this.isFormDirty) {
            this.inputService.markInvalid(this.profileUserForm);
            return;
        }

        if (data.action === 'save') {
            this.updateUserProfile();
            this.modalService.setModalSpinner({
                action: null,
                status: true,
                close: false,
            });
        }
    }

    public changeCheckboxDetection() {
        this.profileUserForm
            .get('createNewPassword')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.profileUserForm.get('oldPassword'),
                        true,
                        [...passwordValidation]
                    );
                } else {
                    this.inputService.changeValidators(
                        this.profileUserForm.get('newPassword'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.profileUserForm.get('password'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.profileUserForm.get('oldPassword'),
                        false
                    );
                    this.setNewPassword = false;
                    this.correctPassword = false;
                }
            });

        this.confirmationOldPassword();
    }

    public confirmationOldPassword() {
        this.profileUserForm
            .get('oldPassword')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.userPasswordTyping = value?.toString().length >= 1;
                if (value && value.length >= 8) {
                    this.loadingOldPassword = true;
                    this.userProfileUpdateService
                        .validateUserPassword({ password: value })
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (res: any) => {
                                this.correctPassword = !!res.correctPassword;
                                this.loadingOldPassword = false;

                                if (!this.correctPassword) {
                                    this.profileUserForm
                                        .get('oldPassword')
                                        .setErrors({ invalid: true });
                                }
                            },
                            error: () => {},
                        });
                }
            });

        this.passwordsNotSame();
    }

    private passwordsNotSame(): void {
        this.profileUserForm
            .get('newPassword')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value === this.profileUserForm.get('password').value) {
                    this.profileUserForm.get('password').setErrors(null);
                } else {
                    this.profileUserForm.get('password').setErrors({
                        passwordDontMatch: true,
                    });
                }
            });

        this.profileUserForm
            .get('password')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value === this.profileUserForm.get('newPassword').value) {
                    this.profileUserForm.get('password').setErrors(null);
                } else {
                    this.profileUserForm.get('password').setErrors({
                        passwordDontMatch: true,
                    });
                }
            });
    }

    public onSetNewPassword() {
        if (this.correctPassword) {
            this.setNewPassword = true;
            this.inputService.changeValidators(
                this.profileUserForm.get('newPassword'),
                true,
                [...passwordValidation]
            );
            this.inputService.changeValidators(
                this.profileUserForm.get('password'),
                true,
                [...passwordValidation]
            );
        }
    }

    public onUploadImage(event: any) {
        const base64Data = MethodsGlobalHelper.getBase64DataFromEvent(event);
        this.profileUserForm.get('avatar').patchValue(base64Data);
        this.profileUserForm.get('avatar').setErrors(null);
    }

    public onImageValidation(event: boolean) {
        if (!event) {
            this.profileUserForm.get('avatar').setErrors({ invalid: true });
        } else {
            this.inputService.changeValidators(
                this.profileUserForm.get('avatar'),
                false
            );
        }
    }

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
    }): void {
        if (event.valid) {
            this.selectedAddress = event.address;
        }
    }

    private getUserById() {
        this.userProfileUpdateService
            .getUserById(this.user.userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: UserResponse) => {
                    this.profileUserForm.patchValue({
                        firstName: res.firstName,
                        lastName: res.lastName,
                        phone: res.phone,
                        email: res.email,
                        address: res.address.address,
                        addressUnit: res.address.addressUnit,
                        /*  avatar: res.avatar ? res.avatar : null, */
                    });
                    this.selectedAddress = res.address;
                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private updateUserProfile() {
        const { addressUnit, ...form } = this.profileUserForm.value;

        if (this.selectedAddress) {
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };
        }

        const newData: UpdateUserCommand = {
            id: this.user.userId,
            ...form,
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
        };

        this.userProfileUpdateService
            .updateUser(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const newUser = {
                        ...this.user,
                        firstName: this.profileUserForm.get('firstName').value,
                        lastName: this.profileUserForm.get('lastName').value,
                        avatar: this.profileUserForm.get('avatar').value,
                    };
                    this.userProfileUpdateService.updateUserProfile(true);
                    localStorage.setItem('user', JSON.stringify(newUser));
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

    private startFormChanges() {
        this.formService.checkFormChange(this.profileUserForm);
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
