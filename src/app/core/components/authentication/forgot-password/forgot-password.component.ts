import { HttpResponseBase } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import moment from 'moment';

import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AuthStoreService } from '../state/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';

import { ForgotPasswordCommand } from 'appcoretruckassist/model/forgotPasswordCommand';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public forgotPasswordForm!: UntypedFormGroup;

    public copyrightYear: number;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private authStoreService: AuthStoreService,
        private inputService: TaInputService,
        private notification: NotificationService,
        private router: Router
    ) {
        this.createForm();

        this.copyrightYear = moment().year();
    }

    ngOnInit(): void {
        this.createForm();
    }

    private createForm(): void {
        this.forgotPasswordForm = this.formBuilder.group({
            email: [null, [Validators.required]],
        });

        this.inputService.customInputValidator(
            this.forgotPasswordForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public onForgotPassword(): void {
        if (this.forgotPasswordForm.invalid) {
            this.inputService.markInvalid(this.forgotPasswordForm);
            return;
        }

        const resetData: ForgotPasswordCommand = {
            email: this.forgotPasswordForm.get('email').value,
        };

        this.authStoreService
            .forgotPassword(resetData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: HttpResponseBase) => {
                    if (res.status === 200 || res.status === 204) {
                        this.notification.success(
                            'Confirmation mail sent',
                            'Success'
                        );

                        localStorage.setItem(
                            'checkEmail',
                            JSON.stringify(
                                this.forgotPasswordForm.get('email').value
                            )
                        );

                        this.router.navigate([
                            '/auth/forgot-password/check-email',
                        ]);
                    }
                },
                error: (err) => {
                    this.notification.error(err, 'Error');
                },
            });
    }

    public onKeyDown(event: any) {
        if (event.keyCode === 13) {
            this.onForgotPassword();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
