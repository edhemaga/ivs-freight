import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { WebsiteAuthService } from 'src/app/pages/website/services/website-auth.service';
import { WebsiteActionsService } from 'src/app/pages/website/services/website-actions.service';

// enums
import { ConstantString } from 'src/app/pages/website/enums/const-string.enum';

// models
import { ForgotPasswordCommand } from 'appcoretruckassist';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public resetPasswordForm: UntypedFormGroup;

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private websiteAuthService: WebsiteAuthService,
        private websiteActionsService: WebsiteActionsService
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    private createForm(): void {
        this.resetPasswordForm = this.formBuilder.group({
            email: [null, [Validators.required]],
        });

        this.inputService.customInputValidator(
            this.resetPasswordForm.get(ConstantString.EMAIL_ADDRESS),
            ConstantString.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) this.resetPassword();
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) this.resetPassword();
    }

    public resetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            this.inputService.markInvalid(this.resetPasswordForm);

            return;
        }

        this.displaySpinner = true;

        const saveData: ForgotPasswordCommand = {
            email: this.resetPasswordForm.get(ConstantString.EMAIL_ADDRESS)
                .value,
        };

        this.websiteAuthService
            .resetPassword(saveData)
            .pipe(
                takeUntil(this.destroy$),
                tap({
                    next: () => {
                        this.websiteActionsService.setSidebarContentType(
                            ConstantString.RESET_PASSWORD_REQUESTED
                        );

                        localStorage.setItem(
                            ConstantString.CONFIRMATION_EMAIL,
                            JSON.stringify(
                                this.resetPasswordForm.get(
                                    ConstantString.EMAIL_ADDRESS
                                ).value
                            )
                        );

                        this.displaySpinner = false;
                    },
                    error: () => {
                        this.displaySpinner = false;

                        this.resetPasswordForm
                            .get(ConstantString.EMAIL_ADDRESS)
                            .setErrors({ userDoesntExist: true });
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
