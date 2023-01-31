import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {
    @Input() passwordResetConfirmation?: boolean = false;

    public confirmationEmail: string = null;

    public requestedResendEmail?: boolean = false;

    constructor(private websiteActionsService: WebsiteActionsService) {}

    ngOnInit(): void {
        this.getConfirmationEmail();
    }

    public onGetBtnClickValue(
        event: { notDisabledClick: boolean },
        type?: string
    ): void {
        if (event.notDisabledClick) {
            if (type === ConstantString.LOGIN_BTN) {
                this.websiteActionsService.setSidebarContentType(
                    ConstantString.LOGIN
                );
            } else {
                this.requestedResendEmail = true;
            }
        }
    }

    private getConfirmationEmail(): void {
        this.confirmationEmail = JSON.parse(
            localStorage.getItem(ConstantString.CONFIRMATION_EMAIL)
        );
    }

    ngOnDestroy(): void {
        localStorage.removeItem(ConstantString.CONFIRMATION_EMAIL);
    }
}
