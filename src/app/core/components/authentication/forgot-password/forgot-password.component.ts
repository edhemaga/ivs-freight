import { HttpResponseBase } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import moment from 'moment';

import {
  emailRegex,
  emailValidation,
} from '../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AuthStoreService } from '../state/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';

import { ForgotPasswordCommand } from 'appcoretruckassist/model/forgotPasswordCommand';

@UntilDestroy()
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  public forgotPasswordForm!: FormGroup;

  public copyrightYear: number;

  constructor(
    private formBuilder: FormBuilder,
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
      email: [null, [Validators.required, emailRegex, ...emailValidation]],
    });
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: HttpResponseBase) => {
          if (res.status === 200 || res.status === 204) {
            this.notification.success('Confirmation mail sent', 'Success');

            localStorage.setItem(
              'checkEmail',
              JSON.stringify(this.forgotPasswordForm.get('email').value)
            );

            this.router.navigate(['/auth/forgot-password/check-email']);
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

  ngOnDestroy(): void {}
}
