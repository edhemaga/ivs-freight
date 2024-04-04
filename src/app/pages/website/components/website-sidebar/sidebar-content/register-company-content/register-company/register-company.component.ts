/* eslint-disable no-unused-vars */

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { TaInputService } from 'src/app/shared/components/ta-input/services/ta-input.service';
import { WebsiteAuthService } from '../../../../../services/website-auth.service';
import { WebsiteActionsService } from '../../../../../services/website-actions.service';

// validations
import {
    einNumberRegex,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    phoneFaxRegex,
} from 'src/app/shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { WebsiteStringEnum } from '../../../../../enums/website-string.enum';

// models
import { SignUpCompanyCommand } from 'appcoretruckassist';

@Component({
    selector: 'app-register-company',
    templateUrl: './register-company.component.html',
    styleUrls: ['./register-company.component.scss'],
})
export class RegisterCompanyComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public registerCompanyForm: UntypedFormGroup;

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
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, [Validators.required]],
            password: [null, [Validators.required, ...passwordValidation]],
            confirmPassword: [
                null,
                [Validators.required, ...passwordValidation],
            ],
        });

        this.inputService.customInputValidator(
            this.registerCompanyForm.get(WebsiteStringEnum.EMAIL_ADDRESS),
            WebsiteStringEnum.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    public passwordsNotSame(): void {
        this.registerCompanyForm
            .get(WebsiteStringEnum.CONFIRM_PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value ===
                    this.registerCompanyForm.get(WebsiteStringEnum.PASSWORD)
                        .value
                ) {
                    this.registerCompanyForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.registerCompanyForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors({
                            passwordDontMatch: true,
                        });
                }
            });

        this.registerCompanyForm
            .get(WebsiteStringEnum.PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value ===
                    this.registerCompanyForm.get(
                        WebsiteStringEnum.CONFIRM_PASSWORD
                    ).value
                ) {
                    this.registerCompanyForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.registerCompanyForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors({
                            passwordDontMatch: true,
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
        if (this.registerCompanyForm.invalid) {
            this.inputService.markInvalid(this.registerCompanyForm);

            return;
        }

        this.displaySpinner = true;

        const { confirmPassword, ...registerCompanyForm } =
            this.registerCompanyForm.value;

        const saveData: SignUpCompanyCommand = {
            ...registerCompanyForm,
        };

        this.websiteAuthService
            .registerCompany(saveData)
            .pipe(
                takeUntil(this.destroy$),
                tap({
                    next: () => {
                        this.websiteActionsService.setSidebarContentType(
                            WebsiteStringEnum.START_TRIAL_CONFIRMATION
                        );

                        localStorage.setItem(
                            WebsiteStringEnum.CONFIRMATION_EMAIL,
                            JSON.stringify(
                                this.registerCompanyForm.get(
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
                            errorMessage === WebsiteStringEnum.EIN_ALREADY_EXIST
                        )
                            this.registerCompanyForm
                                .get(WebsiteStringEnum.EIN)
                                .setErrors({ einAlreadyExist: true });

                        if (
                            errorMessage ===
                            WebsiteStringEnum.PHONE_ALREADY_EXIST
                        )
                            this.registerCompanyForm
                                .get(WebsiteStringEnum.PHONE)
                                .setErrors({ phoneAlreadyExist: true });

                        if (
                            errorMessage ===
                            WebsiteStringEnum.EMAIL_ALREADY_EXIST
                        )
                            this.registerCompanyForm
                                .get(WebsiteStringEnum.EMAIL_ADDRESS)
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
