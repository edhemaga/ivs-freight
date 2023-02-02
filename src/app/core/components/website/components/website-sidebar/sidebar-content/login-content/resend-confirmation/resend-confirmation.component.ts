import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';
import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';

import { WebsiteAuthStoreService } from 'src/app/core/components/website/state/service/website-auth-store.service';

@Component({
    selector: 'app-resend-confirmation',
    templateUrl: './resend-confirmation.component.html',
    styleUrls: ['./resend-confirmation.component.scss'],
})
export class ResendConfirmationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public resendConfirmationForm: FormGroup;

    public openHavingTroubleContent: boolean = false;

    public displaySpinner: boolean = false;

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
        this.resendConfirmationForm = this.formBuilder.group({
            email: [null, [Validators.required]],
        });

        this.inputService.customInputValidator(
            this.resendConfirmationForm.get(ConstantString.EMAIL_ADDRESS),
            ConstantString.EMAIL_ADDRESS,
            this.destroy$
        );
    }

    public onHavingTroubleClick(): void {
        this.openHavingTroubleContent = !this.openHavingTroubleContent;
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) {
            this.resendConfirmation();
        }
    }

    public onGetBtnClickValue(
        event: { notDisabledClick: boolean },
        type?: string
    ): void {
        if (event.notDisabledClick) {
            if (type === ConstantString.RESEND_CONFIRMATION_BTN) {
                this.resendConfirmation();
            }

            if (type === ConstantString.RESET_PASSWORD_BTN) {
                this.websiteActionsService.setSidebarContentType(
                    ConstantString.RESET_PASSWORD
                );
            }
        }
    }

    private resendConfirmation(): void {
        this.displaySpinner = true;

        this.websiteActionsService.setSidebarContentType(
            ConstantString.RESEND_CONFIRMATION_REQUESTED
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
