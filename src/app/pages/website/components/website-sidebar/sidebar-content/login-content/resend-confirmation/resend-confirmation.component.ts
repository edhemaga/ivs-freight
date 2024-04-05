import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

// services
import { TaInputService } from 'src/app/shared/components/ta-input/services/ta-input.service';
import { WebsiteActionsService } from 'src/app/pages/website/services/website-actions.service';
import { WebsiteAuthService } from 'src/app/pages/website/services/website-auth.service';

// enums
import { WebsiteStringEnum } from 'src/app/pages/website/enums/website-string.enum';

// models
import { ResendSignUpCompanyOrUserCommand } from 'appcoretruckassist';

@Component({
    selector: 'app-resend-confirmation',
    templateUrl: './resend-confirmation.component.html',
    styleUrls: ['./resend-confirmation.component.scss'],
})
export class ResendConfirmationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public resendConfirmationForm: UntypedFormGroup;

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
        this.resendConfirmationForm = this.formBuilder.group({
            email: [null, [Validators.required]],
        });

        this.inputService.customInputValidator(
            this.resendConfirmationForm.get(WebsiteStringEnum.EMAIL_ADDRESS),
            WebsiteStringEnum.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) this.resendConfirmation();
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) this.resendConfirmation();
    }

    private resendConfirmation(): void {
        if (this.resendConfirmationForm.invalid) {
            this.inputService.markInvalid(this.resendConfirmationForm);

            return;
        }

        this.displaySpinner = true;

        const saveData: ResendSignUpCompanyOrUserCommand = {
            email: this.resendConfirmationForm.get(
                WebsiteStringEnum.EMAIL_ADDRESS
            ).value,
            isResendConfirmation: true,
        };

        this.websiteAuthService
            .resendRegisterCompanyOrUser(saveData)
            .pipe(
                takeUntil(this.destroy$),
                tap({
                    next: () => {
                        this.websiteActionsService.setSidebarContentType(
                            WebsiteStringEnum.RESEND_CONFIRMATION_REQUESTED
                        );

                        localStorage.setItem(
                            WebsiteStringEnum.CONFIRMATION_EMAIL,
                            JSON.stringify(
                                this.resendConfirmationForm.get(
                                    WebsiteStringEnum.EMAIL_ADDRESS
                                ).value
                            )
                        );
                    },
                    error: (error: any) => {
                        this.displaySpinner = false;

                        const errorMessage = error.error.error;

                        this.resendConfirmationForm
                            .get(WebsiteStringEnum.EMAIL_ADDRESS)
                            .setErrors(
                                errorMessage ===
                                    WebsiteStringEnum.USER_NOT_FOUND
                                    ? { userDoesntExist: true }
                                    : { userAlreadyRegistered: true }
                            );
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
