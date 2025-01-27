import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

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

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { UserProfileUpdateService } from '@shared/services/user-profile-update.service';
import { FormService } from '@shared/services/form.service';

// components
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import {
    CaInputComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaUploadFilesComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// models
import {
    AddressEntity,
    SignInResponse,
    UpdateUserCommand,
    UserResponse,
} from 'appcoretruckassist';

// utils
import { MethodsGlobalHelper } from '@shared/utils/helpers/methods-global.helper';

// Const
import { NavigationDataConstants } from '../../utils/constants/navigation-data.constants';

// Enums
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { ModalButtonType } from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-navigation-profile-update-modal',
    templateUrl: './navigation-profile-update-modal.component.html',
    styleUrls: ['./navigation-profile-update-modal.component.scss'],
    providers: [FormService, ModalService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // Modal
        CaModalComponent,
        CaInputComponent,
        CaModalButtonComponent,
        TaInputAddressDropdownComponent,
        TaCheckboxCardComponent,
        TaCustomCardComponent,
        TaAppTooltipV2Component,

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

    public profileUserForm: UntypedFormGroup;

    public isCardAnimationDisabled: boolean = false;

    public selectedAddress: AddressEntity = null;
    public userPasswordTyping: boolean = false;
    public correctPassword: boolean = false;
    public setNewPassword: boolean = false;
    public loadingOldPassword: boolean = false;

    public isFormDirty: boolean = false;
    public activeAction: TaModalActionEnum;
    public taModalActionEnum = TaModalActionEnum;
    public svgRoutes = SharedSvgRoutes;
    public modalButtonType = ModalButtonType;
    public displayName: string;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private userProfileUpdateService: UserProfileUpdateService,
        private formService: FormService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit() {
        this.createForm();
        this.user = JSON.parse(localStorage.getItem('user'));

        this.getUserById();
        this.changeCheckboxDetection();
        this.isCardAnimationDisabled = true;
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

    public onModalAction(action: string): void {
        if (action === TaModalActionEnum.CLOSE) {
            this.ngbActiveModal.close();
            return;
        }

        if (this.profileUserForm.invalid || !this.isFormDirty) {
            this.inputService.markInvalid(this.profileUserForm);
            return;
        }

        if (action === TaModalActionEnum.SAVE) {
            this.activeAction = TaModalActionEnum.SAVE;
            this.updateUserProfile();
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
                    this.displayName = `${res.firstName} ${res.lastName}`;

                    setTimeout(() => {
                        this.startFormChanges();
                        this.isCardAnimationDisabled = false;
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

                    this.ngbActiveModal.close();
                },
                error: () => {
                    this.activeAction = null;
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
