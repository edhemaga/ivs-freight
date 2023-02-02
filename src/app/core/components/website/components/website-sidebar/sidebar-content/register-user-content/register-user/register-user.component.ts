import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';
import { WebsiteAuthStoreService } from 'src/app/core/components/website/state/service/website-auth-store.service';

import {
    addressUnitValidation,
    addressValidation,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    phoneFaxRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';

@Component({
    selector: 'app-register-user',
    templateUrl: './register-user.component.html',
    styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public registerUserForm: FormGroup;

    private registerUserCode: string = null;

    public userInfo: {
        companyName: string;
        firstName: string;
        lastName: string;
        email: string;
    } = {
        companyName: 'ivs freight inc.',
        firstName: 'Aleksandar',
        lastName: 'Djordjevic',
        email: 'aleksandar@gmail.com',
    };

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private websiteActionsService: WebsiteActionsService,
        private websiteAuthStoreService: WebsiteAuthStoreService
    ) {}

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
            this.registerUserForm.get(ConstantString.EMAIL_ADDRESS),
            ConstantString.EMAIL_ADDRESS,
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

                this.registerUserCode = res.code;
            });
    }

    private passwordsNotSame(): void {
        const confirmPasswordControl = this.registerUserForm.get(
            ConstantString.CONFIRM_PASSWORD
        );

        confirmPasswordControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value?.toLowerCase() ===
                        this.registerUserForm
                            .get(ConstantString.PASSWORD)
                            .value?.toLowerCase() &&
                    value &&
                    confirmPasswordControl.value
                ) {
                    confirmPasswordControl.setErrors(null);
                } else {
                    confirmPasswordControl.setErrors({
                        invalid: true,
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
        if (this.registerUserForm.invalid) {
            this.inputService.markInvalid(this.registerUserForm);

            return;
        }

        this.displaySpinner = true;

        const { email, password } = this.registerUserForm.value;

        const saveData: any = {
            email,
            password,
            code: this.registerUserCode,
        };

        this.websiteAuthStoreService
            .registerUser(saveData)
            .pipe(
                takeUntil(this.destroy$),
                tap({
                    next: () => {
                        this.websiteActionsService.setSidebarContentType(
                            ConstantString.REGISTER_USER_CONFIRMATION
                        );

                        localStorage.setItem(
                            ConstantString.CONFIRMATION_EMAIL,
                            JSON.stringify(
                                this.registerUserForm.get(
                                    ConstantString.EMAIL_ADDRESS
                                ).value
                            )
                        );

                        this.displaySpinner = false;
                    },
                    error: (error: any) => {
                        this.displaySpinner = false;
                        console.log('error', error);
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
