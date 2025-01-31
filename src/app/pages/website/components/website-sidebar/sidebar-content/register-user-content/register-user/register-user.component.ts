/* eslint-disable no-unused-vars */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';
import { AddressService } from '@shared/services/address.service';

// validations
import {
    addressUnitValidation,
    addressValidation,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

// models
import { AddressEntity, SignupUserCommand } from 'appcoretruckassist';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

@Component({
    selector: 'app-register-user',
    templateUrl: './register-user.component.html',
    styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent
    extends AddressMixin(class {})
    implements OnInit, OnDestroy
{
    @ViewChild('inputAddress', { static: false }) public inputAddress: any;

    public destroy$ = new Subject<void>();

    public registerUserForm: UntypedFormGroup;

    private registerUserCode: string = null;

    public selectedAddress: AddressEntity = null;

    public userInfo: {
        companyName: string;
        department: string;
    } = null;

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private websiteActionsService: WebsiteActionsService,
        private websiteAuthService: WebsiteAuthService,
        public addressService: AddressService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();

        this.patchForm();

        this.passwordsNotSame();
    }

    private createForm(): void {
        this.registerUserForm = this.formBuilder.group({
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            address: [null, [...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, [phoneFaxRegex]],
            email: [null, [Validators.required]],
            password: [null, [Validators.required, ...passwordValidation]],
            confirmPassword: [
                null,
                [Validators.required, ...passwordValidation],
            ],
        });

        this.inputService.customInputValidator(
            this.registerUserForm.get(WebsiteStringEnum.EMAIL_ADDRESS),
            WebsiteStringEnum.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    private patchForm(): void {
        this.websiteActionsService.getRegisterUserInfoSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
                this.registerUserForm.patchValue({
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                });

                this.userInfo = {
                    companyName: res.companyName,
                    department: res.department,
                };

                this.registerUserCode = res.code;
            });
    }

    public handleAddressChange(event: {
        address: any;
        longLat: any;
        valid: boolean;
    }): void {
        this.selectedAddress = event.address;

        if (!event.valid) {
            this.registerUserForm
                .get(WebsiteStringEnum.ADDRESS)
                .setErrors({ invalid: true });
        }
    }

    public passwordsNotSame(): void {
        this.registerUserForm
            .get(WebsiteStringEnum.CONFIRM_PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value ===
                    this.registerUserForm.get(WebsiteStringEnum.PASSWORD).value
                ) {
                    this.registerUserForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.registerUserForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors({
                            passwordDontMatch: true,
                        });
                }
            });

        this.registerUserForm
            .get(WebsiteStringEnum.PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value ===
                    this.registerUserForm.get(
                        WebsiteStringEnum.CONFIRM_PASSWORD
                    ).value
                ) {
                    this.registerUserForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.registerUserForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors({
                            passwordDontMatch: true,
                        });
                }
            });
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) {
            this.registerUser();
        }
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) {
            this.registerUser();
        }
    }

    public registerUser(): void {
        if (
            this.inputAddress?.inputDropdown?.inputRef?.focusInput &&
            this.inputAddress?.addresList?.length
        ) {
            return;
        }

        if (this.registerUserForm.invalid) {
            this.inputService.markInvalid(this.registerUserForm);

            return;
        }

        this.displaySpinner = true;

        const { address, addressUnit, confirmPassword, ...registerUserForm } =
            this.registerUserForm.value;

        if (this.selectedAddress) {
            this.selectedAddress.addressUnit = this.registerUserForm.get(
                WebsiteStringEnum.ADDRESS_UNIT
            ).value;
        }

        const saveData: SignupUserCommand = {
            ...registerUserForm,
            address: this.selectedAddress,
            code: this.registerUserCode,
        };

        this.websiteAuthService
            .registerUser(saveData)
            .pipe(
                takeUntil(this.destroy$),
                tap({
                    next: () => {
                        this.websiteActionsService.setSidebarContentType(
                            WebsiteStringEnum.REGISTER_USER_CONFIRMATION
                        );

                        localStorage.setItem(
                            WebsiteStringEnum.CONFIRMATION_EMAIL,
                            JSON.stringify(
                                this.registerUserForm.get(
                                    WebsiteStringEnum.EMAIL_ADDRESS
                                ).value
                            )
                        );

                        this.displaySpinner = false;
                    },
                    error: (error: any) => {
                        this.displaySpinner = false;

                        const errorMessage = error.error.error;

                        if (
                            errorMessage ===
                            WebsiteStringEnum.PHONE_ALREADY_EXIST
                        ) {
                            this.registerUserForm
                                .get(WebsiteStringEnum.PHONE)
                                .setErrors({ phoneAlreadyExist: true });
                        }
                    },
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
