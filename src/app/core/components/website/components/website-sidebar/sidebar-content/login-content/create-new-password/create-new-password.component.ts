import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { WebsiteAuthService } from 'src/app/core/components/website/state/service/website-auth.service';
import { WebsiteActionsService } from 'src/app/core/components/website/state/service/website-actions.service';

import { passwordValidation } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';

import { ConstantString } from 'src/app/core/components/website/state/enum/const-string.enum';
import { SetNewPasswordCommand } from 'appcoretruckassist';
import { UserInfoModel } from 'src/app/core/components/website/state/model/user-info.model';

@Component({
    selector: 'app-create-new-password',
    templateUrl: './create-new-password.component.html',
    styleUrls: ['./create-new-password.component.scss'],
})
export class CreateNewPasswordComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public createNewPasswordForm: FormGroup;

    public openHavingTroubleContent: boolean = false;

    public userInfo:UserInfoModel = null;

    public displaySpinner: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private websiteAuthService: WebsiteAuthService,
        private websiteActionsService: WebsiteActionsService
    ) {}

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
                    avatar: res.avatar,
                };
            });
    }

    public passwordsNotSame(): void {
        const confirmPasswordControl = this.createNewPasswordForm.get(
            ConstantString.CONFIRM_PASSWORD
        );

        confirmPasswordControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value?.toLowerCase() ===
                        this.createNewPasswordForm
                            .get(ConstantString.PASSWORD)
                            .value?.toLowerCase() &&
                    value &&
                    confirmPasswordControl.value
                ) {
                    confirmPasswordControl.setErrors(null);
                } else {
                    confirmPasswordControl.setErrors({
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

        this.displaySpinner = true;

        const saveData: SetNewPasswordCommand = {
            newPassword: this.createNewPasswordForm.get(
                ConstantString.NEW_PASSWORD
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
