/* eslint-disable no-unused-vars */

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Observable, Subject, takeUntil } from 'rxjs';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { AuthFacadeService } from '@pages/website/state/services/auth.service';

// validations
import {
    einNumberRegex,
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

// models
import { SignUpCompanyCommand } from 'appcoretruckassist';

@Component({
    selector: 'app-register-company',
    templateUrl: './register-company.component.html',
    styleUrls: ['./register-company.component.scss'],
})
export class RegisterCompanyComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public displaySpinner$: Observable<boolean>;

    public registerCompanyForm: UntypedFormGroup;

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,

        //Services
        private inputService: TaInputService,
        private authFacadeService: AuthFacadeService
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreSelectors();
        this.createForm();

        this.passwordsNotSame();
    }

    private subscribeToStoreSelectors(): void {
        this.authFacadeService.loginError$
            .pipe(takeUntil(this.destroy$))
            .subscribe((error) => {
                if (!error) return;
                this.registerCompanyForm.get(error.type).setErrors(error.error);
            });

        this.displaySpinner$ = this.authFacadeService.showSpinner$;
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

        this.authFacadeService.register(saveData);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
