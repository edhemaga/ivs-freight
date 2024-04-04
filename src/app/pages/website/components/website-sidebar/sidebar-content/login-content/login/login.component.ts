import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { TaInputService } from 'src/app/shared/components/ta-input/ta-input.service';
import { WebsiteAuthService } from '../../../../../services/website-auth.service';

// validations
import { passwordValidation } from 'src/app/shared/components/ta-input/ta-input.regex-validations';

// enums
import { WebsiteStringEnum } from '../../../../../enums/website-string.enum';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public loginForm: UntypedFormGroup;

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private websiteAuthService: WebsiteAuthService
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    private createForm(): void {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required]],
            password: [null, [Validators.required, ...passwordValidation]],
            stayLoggedIn: [false],
        });

        this.inputService.customInputValidator(
            this.loginForm.get(WebsiteStringEnum.EMAIL_ADDRESS),
            WebsiteStringEnum.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    public onKeyDown(event: { keyCode: number }): void {
        if (event.keyCode === 13) this.userLogin();
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) this.userLogin();
    }

    private userLogin() {
        if (this.loginForm.invalid) {
            this.inputService.markInvalid(this.loginForm);

            return;
        }

        this.displaySpinner = true;

        this.websiteAuthService
            .accountLogin(this.loginForm.value)
            .pipe(
                takeUntil(this.destroy$),
                tap({
                    next: () => {
                        this.displaySpinner = false;
                    },
                    error: (error) => {
                        this.displaySpinner = false;

                        const errorMessage = error.error.error;

                        if (
                            errorMessage ===
                            WebsiteStringEnum.THIS_USER_DOESENT_EXIST
                        ) {
                            this.loginForm
                                .get(WebsiteStringEnum.EMAIL_ADDRESS)
                                .setErrors({ userDoesntExist: true });
                        }

                        if (
                            errorMessage ===
                            WebsiteStringEnum.WRONG_PASSWORD_TRY_AGAIN
                        )
                            this.loginForm
                                .get(WebsiteStringEnum.PASSWORD)
                                .setErrors({ wrongPassword: true });
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
