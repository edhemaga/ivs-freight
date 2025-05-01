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
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';

// validations
import { passwordValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

// models
import { SetNewPasswordCommand } from 'appcoretruckassist';
import { UserInfoModel } from '@pages/website/models/user-info.model';

@Component({
    selector: 'app-create-new-password',
    templateUrl: './create-new-password.component.html',
    styleUrls: ['./create-new-password.component.scss'],
})
export class CreateNewPasswordComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public createNewPasswordForm: UntypedFormGroup;

    public userInfo: UserInfoModel = null;
    public userAvatar: any = null;

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private websiteAuthService: WebsiteAuthService,
        private websiteActionsService: WebsiteActionsService,
    ) { }

    ngOnInit(): void {
        this.createForm();

        this.getUserInfo();

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

    private getUserInfo(): void {
        this.websiteActionsService.getCreatePasswordSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: UserInfoModel) => {
                this.userInfo = {
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                };
            });

        this.websiteActionsService.getAvatarImageSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
                if (res)
                    this.userAvatar = res;
            });
    }

    public passwordsNotSame(): void {
        this.createNewPasswordForm
            .get(WebsiteStringEnum.CONFIRM_PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value ===
                    this.createNewPasswordForm.get(WebsiteStringEnum.NEW_PASSWORD)
                        .value
                ) {
                    this.createNewPasswordForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.createNewPasswordForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors({
                            invalid: true,
                        });
                }
            });

        this.createNewPasswordForm
            .get(WebsiteStringEnum.NEW_PASSWORD)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value ===
                    this.createNewPasswordForm.get(
                        WebsiteStringEnum.CONFIRM_PASSWORD
                    ).value
                ) {
                    this.createNewPasswordForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors(null);
                } else {
                    this.createNewPasswordForm
                        .get(WebsiteStringEnum.CONFIRM_PASSWORD)
                        .setErrors({
                            invalid: true,
                        });
                }
            });
    }

    public onKeyDown(event: any): void {
        if (event.keyCode === 13) this.createNewPassword();
    }

    public onGetBtnClickValue(event: { notDisabledClick: boolean }): void {
        if (event.notDisabledClick) this.createNewPassword();
    }

    public createNewPassword(): void {
        if (this.createNewPasswordForm.invalid) {
            this.inputService.markInvalid(this.createNewPasswordForm);

            return;
        }

        this.displaySpinner = true;

        const saveData: SetNewPasswordCommand = {
            newPassword: this.createNewPasswordForm.get(
                WebsiteStringEnum.NEW_PASSWORD
            ).value,
        };

        this.websiteActionsService.getResetPasswordToken$
            .pipe(takeUntil(this.destroy$))
            .subscribe((token) => {
                /* WEBSITE AUTH SERVICE*/

                localStorage.setItem('user', JSON.stringify({ token: token }));

                this.websiteAuthService
                    .createNewPassword(saveData)
                    .pipe(
                        takeUntil(this.destroy$),
                        tap({
                            next: () => {
                                this.displaySpinner = false;
                            },
                        })
                    )
                    .subscribe();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
