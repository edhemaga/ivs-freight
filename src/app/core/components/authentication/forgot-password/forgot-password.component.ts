import { HttpResponseBase } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { SharedService } from '../../../services/shared/shared.service';
import { emailRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AuthStoreService } from '../state/auth.service';
// import {AuthService} from "../../../services/auth/auth.service";

import { NotificationService } from '../../../services/notification/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    public forgotPasswordForm!: FormGroup;

    public copyrightYear: number;

    get emailField() {
        return this.forgotPasswordForm.get('email');
    }

    @ViewChild('email') emailInput: any;

    email!: null;

    userId = localStorage.getItem('');
    passwordEmailSent = false;

    inputText!: false;

    constructor(
        private formBuilder: FormBuilder,
        private authStoreService: AuthStoreService,
        private inputService: TaInputService,
        private notification: NotificationService,
        private router: Router,
        private shared: SharedService // private authService: AuthService,
    ) {
        this.createForm();

        this.copyrightYear = moment().year();
    }

    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            email: [null, [Validators.required, emailRegex]],
        });
    }

    public onForgotPassword(): void {
        if (this.forgotPasswordForm.invalid) {
            this.inputService.markInvalid(this.forgotPasswordForm);
            return;
        }

        const resetData = { email: this.forgotPasswordForm.get('email').value };

        console.log(resetData, typeof resetData.email);

        this.authStoreService
            .forgotPassword(resetData)
            .pipe(untilDestroyed(this))
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
                            '/login/forgot-password/check-email',
                        ]);

                        this.forgotPasswordForm.reset();
                    }
                },
                error: err => {
                    this.notification.error(err, 'Error');
                },
            });
    }

    /* resetPassword() {
    const resetData = {
      email: this.forgotPasswordForm.get('email').value
    };
    this.authService.requestResetPassword(resetData).subscribe(
      (response: any) => {
        if (response) {
          this.notification.success('Confirmation mail sent', 'Success');
          this.forgotPasswordForm.reset();
          this.passwordEmailSent = true;
        }
      }
    );
  } */

    manageInputValidation(formElement: any) {
        return this.shared.manageInputValidation(formElement);
    }

    public onKeyUp(x: any) {
        this.inputText = x.key;
        x.key === 'Backspace' && !this.forgotPasswordForm.get('email')?.value
            ? (this.inputText = false)
            : (this.inputText = x.key);
    }

    clearEmailInput() {
        this.forgotPasswordForm.controls['email'].reset();
        this.inputText = false;
    }

    ngOnDestroy(): void {}
}
