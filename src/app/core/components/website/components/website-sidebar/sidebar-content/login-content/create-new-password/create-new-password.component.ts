import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { WebsiteAuthStoreService } from 'src/app/core/components/website/state/service/website-auth-store.service';
import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';

import { passwordValidation } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';
import { SetNewPasswordCommand } from 'appcoretruckassist';

@Component({
    selector: 'app-create-new-password',
    templateUrl: './create-new-password.component.html',
    styleUrls: ['./create-new-password.component.scss'],
})
export class CreateNewPasswordComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public createNewPasswordForm: FormGroup;

    public openHavingTroubleContent: boolean = false;

    public userInfo: { name: string; email: string; imgSrc: string } = {
        name: 'Aleksandar Djordjevic',
        email: 'aleksandar@gmail.com',
        imgSrc: null,
    };

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private websiteAuthStoreService: WebsiteAuthStoreService,
        private websiteActionsService: WebsiteActionsService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.passwordsNotSame();
    }

    private createForm(): void {
        this.createNewPasswordForm = this.formBuilder.group({
            newPassword: [null, [Validators.required, ...passwordValidation]],
            confirmPassword: [
                null,
                [Validators.required, ...passwordValidation],
            ],
        });
    }

    public passwordsNotSame(): void {
        this.createNewPasswordForm
            .get(ConstantString.CONFIRM_PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value?.toLowerCase() ===
                    this.createNewPasswordForm
                        .get(ConstantString.NEW_PASSWORD)
                        .value?.toLowerCase()
                ) {
                    this.createNewPasswordForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.createNewPasswordForm
                        .get(ConstantString.CONFIRM_PASSWORD)
                        .setErrors({
                            invalid: true,
                        });
                }
            });
    }

    public onHavingTroubleClick(): void {
        this.openHavingTroubleContent = !this.openHavingTroubleContent;
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) {
            this.createNewPassword();
        }
    }

    public onGetBtnClickValue(
        event: { notDisabledClick: boolean },
        type?: string
    ): void {
        if (event.notDisabledClick) {
            if (type === ConstantString.CREATE_NEW_PASSWORD_BTN) {
                this.createNewPassword();
            }

            if (type === ConstantString.RESEND_CONFIRMATION_BTN) {
                this.websiteActionsService.setSidebarContentType(
                    ConstantString.RESEND_CONFIRMATION
                );
            }
        }
    }

    public createNewPassword(): void {
        if (this.createNewPasswordForm.invalid) {
            this.inputService.markInvalid(this.createNewPasswordForm);

            return;
        }

        const saveData: SetNewPasswordCommand = {
            newPassword: this.createNewPasswordForm.get(
                ConstantString.NEW_PASSWORD
            ).value,
        };

        this.websiteAuthStoreService.getResetPasswordToken$
            .pipe(takeUntil(this.destroy$))
            .subscribe((token) => {
                localStorage.setItem('user', JSON.stringify({ token: token }));

                this.websiteAuthStoreService
                    .createNewPassword(saveData)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
