import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpResponseBase } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { passwordValidation } from '../../shared/ta-input/ta-input.regex-validations';

import moment from 'moment';

import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AuthStoreService } from '../state/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AuthSecurityService } from '../state/auth-security.service';

import { SetNewPasswordCommand } from 'appcoretruckassist/model/setNewPasswordCommand';

@Component({
    selector: 'app-create-new-password-page',
    templateUrl: './create-new-password-page.component.html',
    styleUrls: ['./create-new-password-page.component.scss'],
})
export class CreateNewPasswordPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public createNewPasswordForm: UntypedFormGroup;

    public copyrightYear: number;

    public isValidLoad: boolean;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private authStoreService: AuthStoreService,
        private notification: NotificationService,
        private router: Router,
        private authSecurityService: AuthSecurityService
    ) {}

    ngOnInit(): void {
        this.checkIsValidInit();

        this.createForm();

        this.passwordsNotSame();

        this.copyrightYear = moment().year();
    }

    private createForm(): void {
        this.createNewPasswordForm = this.formBuilder.group({
            newPassword: [null, [Validators.required, ...passwordValidation]],
            confirmNewPassword: [
                null,
                [Validators.required, ...passwordValidation],
            ],
        });
    }

    public passwordsNotSame(): void {
        this.createNewPasswordForm
            .get('confirmNewPassword')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (
                    value?.toLowerCase() ===
                    this.createNewPasswordForm
                        .get('newPassword')
                        .value?.toLowerCase()
                ) {
                    this.createNewPasswordForm
                        .get('confirmNewPassword')
                        .setErrors(null);
                } else {
                    this.createNewPasswordForm
                        .get('confirmNewPassword')
                        .setErrors({
                            invalid: true,
                        });
                }
            });
    }

    public onCreateNewPassword(): void {
        if (this.createNewPasswordForm.invalid) {
            this.inputService.markInvalid(this.createNewPasswordForm);
            return;
        }

        const newData: SetNewPasswordCommand = {
            newPassword: this.createNewPasswordForm.get('newPassword').value,
        };

        this.authStoreService.getForgotPassword$
            .pipe(takeUntil(this.destroy$))
            .subscribe((token) => {
                localStorage.setItem('user', JSON.stringify({ token: token }));

                this.authStoreService
                    .createNewPassword(newData)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (res: HttpResponseBase) => {
                            if (res.status === 200 || res.status === 204) {
                                this.notification.success(
                                    'Password changed successfully',
                                    'Success'
                                );

                                localStorage.removeItem('user');

                                this.router.navigate([
                                    '/auth/forgot-password/password-changed',
                                ]);
                            }
                        },
                        error: (err) => {
                            this.notification.error(err, 'Error');
                        },
                    });
            });
    }

    public onKeyDown(event: any) {
        if (event.keyCode === 13) {
            this.onCreateNewPassword();
        }
    }

    private checkIsValidInit(): void {
        this.authSecurityService.getAccountActivatedSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (!res) {
                    this.isValidLoad = false;

                    this.router.navigate(['/auth']);

                    return;
                } else {
                    this.isValidLoad = true;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
