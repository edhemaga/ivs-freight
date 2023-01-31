import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { WebsiteAuthStoreService } from 'src/app/core/components/website/state/service/website-auth-store.service';
import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';

import { ForgotPasswordCommand } from 'appcoretruckassist';
import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public resetPasswordForm: FormGroup;

    public openHavingTroubleContent: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private websiteAuthStoreService: WebsiteAuthStoreService,
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
            this.resetPasswordForm.get(ConstantString.EMAIL),
            ConstantString.EMAIL,
            this.destroy$
        );
    }

    public onHavingTroubleClick(): void {
        this.openHavingTroubleContent = !this.openHavingTroubleContent;
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) {
            this.resetPassword();
        }
    }

    public onGetBtnClickValue(
        event: { notDisabledClick: boolean },
        type?: string
    ): void {
        if (event.notDisabledClick) {
            if (type === ConstantString.RESET_PASSWORD_BTN) {
                this.resetPassword();
            }

            if (type === ConstantString.RESEND_CONFIRMATION_BTN) {
                this.websiteActionsService.setSidebarContentType(
                    ConstantString.RESEND_CONFIRMATION
                );
            }
        }
    }

    public resetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            this.inputService.markInvalid(this.resetPasswordForm);
            return;
        }

        const saveData: ForgotPasswordCommand = {
            email: this.resetPasswordForm.get(ConstantString.EMAIL).value,
        };

        this.websiteAuthStoreService
            .resetPassword(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.websiteActionsService.setSidebarContentType(
                        ConstantString.RESET_PASSWORD_CONFIRMATION
                    );

                    localStorage.setItem(
                        ConstantString.CONFIRMATION_EMAIL,
                        JSON.stringify(
                            this.resetPasswordForm.get(ConstantString.EMAIL)
                                .value
                        )
                    );
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
