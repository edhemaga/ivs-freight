import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// services
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {
    @Input() resendConfirmationRequested?: boolean = false;
    @Input() passwordResetRequested?: boolean = false;
    @Input() registerCompanyConfirmation?: boolean = false;
    @Input() registerUserConfirmation?: boolean = false;

    private destroy$ = new Subject<void>();

    public confirmationEmail: string = null;

    public requestedResendEmail?: boolean = false;

    constructor(
        private websiteActionsService: WebsiteActionsService,
        private websiteAuthService: WebsiteAuthService
    ) {}

    ngOnInit(): void {
        this.getConfirmationEmail();
    }

    public onGetBtnClickValue(
        event: { notDisabledClick: boolean },
        type: string
    ): void {
        if (event.notDisabledClick) {
            if (type === WebsiteStringEnum.LOGIN_BTN) {
                this.websiteActionsService.setSidebarContentType(
                    WebsiteStringEnum.LOGIN
                );
            } else {
                this.requestedResendEmail = true;

                if (
                    this.registerCompanyConfirmation ||
                    this.registerUserConfirmation ||
                    this.resendConfirmationRequested
                )
                    this.resendRegisterConfirmation();

                if (this.passwordResetRequested) this.resendResetPassword();
            }
        }
    }

    public onResetRequestedResend(event: boolean): void {
        if (event) this.requestedResendEmail = false;
    }

    private getConfirmationEmail(): void {
        this.confirmationEmail = JSON.parse(
            localStorage.getItem(WebsiteStringEnum.CONFIRMATION_EMAIL)
        );
    }

    private resendRegisterConfirmation(): void {
        const email = this.confirmationEmail;

        this.websiteAuthService
            .resendRegisterCompanyOrUser({
                email,
                isResendConfirmation: false,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private resendResetPassword(): void {
        const email = this.confirmationEmail;

        this.websiteAuthService
            .resetPassword({ email })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private clearLocalStorage(): void {
        localStorage.removeItem(WebsiteStringEnum.CONFIRMATION_EMAIL);
    }

    ngOnDestroy(): void {
        this.clearLocalStorage();

        this.destroy$.next();
        this.destroy$.complete();
    }
}
