import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { WebsiteAuthService } from '../../../../../state/service/website-auth.service';
import { WebsiteActionsService } from '../../../../../state/service/website-actions.service';

import { passwordValidation } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';

import { ConstantString } from '../../../../../state/enum/const-string.enum';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public loginForm: FormGroup;

    public openHavingTroubleContent: boolean = false;

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private websiteAuthService: WebsiteAuthService,
        private websiteActionsService: WebsiteActionsService
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
            this.loginForm.get(ConstantString.EMAIL_ADDRESS),
            ConstantString.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    public onHavingTroubleClick(): void {
        this.openHavingTroubleContent = !this.openHavingTroubleContent;
    }

    public onKeyDown(event: { keyCode: number }): void {
        if (event.keyCode === 13) {
            this.userLogin();
        }
    }

    public onGetBtnClickValue(
        event: { notDisabledClick: boolean },
        type?: string
    ): void {
        if (event.notDisabledClick) {
            if (type === ConstantString.LOGIN_BTN) {
                this.userLogin();
            }

            if (type === ConstantString.RESET_PASSWORD_BTN) {
                this.websiteActionsService.setSidebarContentType(
                    ConstantString.RESET_PASSWORD
                );
            }

            if (type === ConstantString.RESEND_CONFIRMATION_BTN) {
                this.websiteActionsService.setSidebarContentType(
                    ConstantString.RESEND_CONFIRMATION
                );
            }
        }
    }

    private userLogin() {
        if (this.loginForm.invalid) {
            this.inputService.markInvalid(this.loginForm);

            return false;
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
                    error: (error: any) => {
                        this.displaySpinner = false;
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
