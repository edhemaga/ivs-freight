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

import {
    Subject,
    takeUntil,
    tap,
    filter,
    switchMap,
    catchError,
    of,
    distinctUntilChanged,
    debounceTime,
} from 'rxjs';

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
import { AddressService } from '@shared/services/address.service';

// components
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import {
    CaInputComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaUploadFilesComponent,
    CaInputAddressDropdownComponent,
    eModalButtonClassType,
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

// config
import { NavigationDataUploadFilesConfig } from '@core/components/navigation/utils/config';

// Enums
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

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
        CaInputAddressDropdownComponent,
        TaCheckboxCardComponent,
        TaCustomCardComponent,
        TaAppTooltipV2Component,

        // components
        CaUploadFilesComponent,
    ],
})
export class NavigationProfileUpdateModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit, OnDestroy
{
    public destroy$ = new Subject<void>();

    public uploadFilesConfig =
        NavigationDataUploadFilesConfig.NAVIGATION_PROFILE_UPLOAD_FILES_CONFIG;

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
    public eModalButtonClassType = eModalButtonClassType;
    public displayName: string;
    public doesFileExist: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private ngbActiveModal: NgbActiveModal,

        // Services
        private inputService: TaInputService,
        private userProfileUpdateService: UserProfileUpdateService,
        private formService: FormService,
        public addressService: AddressService
    ) {
        super();
    }

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
            .pipe(
                tap((value: string) => {
                    this.userPasswordTyping = value?.toString().length >= 1;
                }),
                filter((value: string) => value && value.length >= 8),
                debounceTime(300), // Debounce to avoid frequent API calls
                distinctUntilChanged(), // Avoid duplicate calls for the same value
                tap(() => (this.loadingOldPassword = true)), // Set loading state
                switchMap((value: string) =>
                    this.userProfileUpdateService
                        .validateUserPassword({ password: value })
                        .pipe(
                            catchError(() => {
                                this.loadingOldPassword = false;
                                return of({ correctPassword: false }); // Handle errors gracefully
                            })
                        )
                ),
                tap((res) => {
                    this.correctPassword = !!res.correctPassword;
                    this.loadingOldPassword = false;

                    if (!this.correctPassword) {
                        this.profileUserForm
                            .get('oldPassword')
                            .setErrors({ invalid: true });
                    }
                })
            )
            .subscribe();

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
        this.uploadFilesConfig.files.push(event);
        this.doesFileExist = !!this.uploadFilesConfig?.files?.length;
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
                        address: res.address.address ? res.address : null,
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
        const { addressUnit, address, ...form } = this.profileUserForm.value;

        let updateAddress = address;
        if (address) {
            updateAddress = {
                ...this.selectedAddress,
                addressUnit,
            };
        }

        const newData: UpdateUserCommand = {
            id: this.user.userId,
            ...form,
            address: updateAddress?.address ? updateAddress : null,
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
