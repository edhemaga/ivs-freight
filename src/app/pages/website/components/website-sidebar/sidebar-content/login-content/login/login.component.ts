import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';

// validations
import { passwordValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';
import { Store } from '@ngrx/store';
import { authLogin } from '@pages/website/state/auth.actions';
import {
    selectAuthLoginError,
    selectLoggedUser,
} from '@pages/website/state/auth.selector';

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
        private websiteAuthService: WebsiteAuthService,
        private store: Store
    ) {
        this.store
            .select(selectAuthLoginError)
            .subscribe((error) => console.log('LOGIN ERROR', error));
        this.store
            .select(selectLoggedUser)
            .subscribe((user) => console.log('LOGIN SUCCESS', user));
    }

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
        if (event.keyCode === 13) this.userNgrxLogin();
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) this.userNgrxLogin();
    }

    private userNgrxLogin() {
        console.log("FORM VALID", this.loginForm.invalid);
        if (this.loginForm.invalid) {
            this.inputService.markInvalid(this.loginForm);

            return;
        }

        this.store.dispatch(authLogin(this.loginForm.value));
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
