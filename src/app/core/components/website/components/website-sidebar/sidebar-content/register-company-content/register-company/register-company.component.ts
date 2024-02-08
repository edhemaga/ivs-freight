/* eslint-disable no-unused-vars */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { WebsiteAuthService } from '../../../../../state/service/website-auth.service';
import { WebsiteActionsService } from '../../../../../state/service/website-actions.service';

// components
import { InputAddressDropdownComponent } from 'src/app/core/components/shared/input-address-dropdown/input-address-dropdown.component';

// validations
import {
    addressUnitValidation,
    addressValidation,
    einNumberRegex,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    phoneFaxRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';

// enums
import { ConstantString } from '../../../../../state/enum/const-string.enum';

// models
import { AddressEntity, SignUpCompanyCommand } from 'appcoretruckassist';

@Component({
    selector: 'app-register-company',
    templateUrl: './register-company.component.html',
    styleUrls: ['./register-company.component.scss'],
})
export class RegisterCompanyComponent implements OnInit, OnDestroy {
    @ViewChild('inputAddress')
    public inputAddress: InputAddressDropdownComponent;

    private destroy$ = new Subject<void>();

    public registerCompanyForm: UntypedFormGroup;

    public selectedAddress: AddressEntity = null;

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private websiteAuthService: WebsiteAuthService,
        private websiteActionsService: WebsiteActionsService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.passwordsNotSame();
    }

    private createForm(): void {
        this.registerCompanyForm = this.formBuilder.group({
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            companyName: [null, Validators.required],
            ein: [null, [Validators.required, einNumberRegex]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, [Validators.required]],
            password: [null, [Validators.required, ...passwordValidation]],
            confirmPassword: [
                null,
                [Validators.required, ...passwordValidation],
            ],
        });

        this.inputService.customInputValidator(
            this.registerCompanyForm.get(ConstantString.EMAIL_ADDRESS),
            ConstantString.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    public handleAddressChange(event: {
        address: any;
        longLat: any;
        valid: boolean;
    }): void {
        this.selectedAddress = event.address;

        if (!event.valid)
            this.registerCompanyForm
                .get(ConstantString.ADDRESS)
                .setErrors({ invalid: true });
    }

    public passwordsNotSame(): void {
        this.registerCompanyForm
            .get(ConstantString.CONFIRM_PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value?.toLowerCase() ===
                    this.registerCompanyForm
                        .get(ConstantString.PASSWORD)
                        .value?.toLowerCase()
                ) {
                    this.registerCompanyForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.registerCompanyForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .setErrors({
                            invalid: true,
                        });
                }
            });

        this.registerCompanyForm
            .get(ConstantString.PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value?.toLowerCase() ===
                    this.registerCompanyForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .value?.toLowerCase()
                ) {
                    this.registerCompanyForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.registerCompanyForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .setErrors({
                            invalid: true,
                        });
                }
            });
    }

    public onKeyDown(event: { keyCode: number }): void {
        if (event.keyCode === 13) this.registerCompany();
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) this.registerCompany();
    }

    private registerCompany(): void {
        if (
            this.inputAddress?.inputDropdown?.inputRef?.focusInput &&
            this.inputAddress?.addresList?.length
        )
            return;

        if (this.registerCompanyForm.invalid) {
            this.inputService.markInvalid(this.registerCompanyForm);

            return;
        }

        this.displaySpinner = true;

        const {
            address,
            addressUnit,
            confirmPassword,
            ...registerCompanyForm
        } = this.registerCompanyForm.value;

        this.selectedAddress.addressUnit = this.registerCompanyForm.get(
            ConstantString.ADDRESS_UNIT
        ).value;

        const saveData: SignUpCompanyCommand = {
            ...registerCompanyForm,
            address: this.selectedAddress,
        };

        this.websiteAuthService
            .registerCompany(saveData)
            .pipe(
                takeUntil(this.destroy$),
                tap({
                    next: () => {
                        this.websiteActionsService.setSidebarContentType(
                            ConstantString.START_TRIAL_CONFIRMATION
                        );

                        localStorage.setItem(
                            ConstantString.CONFIRMATION_EMAIL,
                            JSON.stringify(
                                this.registerCompanyForm.get(
                                    ConstantString.EMAIL_ADDRESS
                                ).value
                            )
                        );

                        this.displaySpinner = false;
                    },
                    error: (error: any) => {
                        this.displaySpinner = false;

                        const errorMessage = error.error.error;

                        if (errorMessage === ConstantString.EIN_ALREADY_EXIST)
                            this.registerCompanyForm
                                .get(ConstantString.EIN)
                                .setErrors({ einAlreadyExist: true });

                        if (errorMessage === ConstantString.PHONE_ALREADY_EXIST)
                            this.registerCompanyForm
                                .get(ConstantString.PHONE)
                                .setErrors({ phoneAlreadyExist: true });

                        if (errorMessage === ConstantString.EMAIL_ALREADY_EXIST)
                            this.registerCompanyForm
                                .get(ConstantString.EMAIL_ADDRESS)
                                .setErrors({ emailAlreadyExist: true });
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
