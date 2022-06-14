import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponseBase } from '@angular/common/http';
import { Router } from '@angular/router';

import { untilDestroyed } from 'ngx-take-until-destroy';

import moment from 'moment';

import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AuthStoreService } from '../state/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';

import { SetNewPasswordCommand } from 'appcoretruckassist/model/setNewPasswordCommand';

@Component({
  selector: 'app-create-new-password-page',
  templateUrl: './create-new-password-page.component.html',
  styleUrls: ['./create-new-password-page.component.scss'],
})
export class CreateNewPasswordPageComponent implements OnInit, OnDestroy {
  public createNewPasswordForm: FormGroup;

  public copyrightYear: number;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private authStoreService: AuthStoreService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.passwordsNotSame();

    this.copyrightYear = moment().year();
  }

  private createForm(): void {
    this.createNewPasswordForm = this.formBuilder.group({
      newPassword: [null, Validators.required],
      confirmNewPassword: [null, Validators.required],
    });
  }

  public passwordsNotSame(): void {
    this.createNewPasswordForm
      .get('confirmNewPassword')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        if (
          value?.toLowerCase() ===
          this.createNewPasswordForm.get('newPassword').value?.toLowerCase()
        ) {
          this.createNewPasswordForm.get('confirmNewPassword').setErrors(null);
        } else {
          this.createNewPasswordForm.get('confirmNewPassword').setErrors({
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

    this.authStoreService
      .createNewPassword(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: HttpResponseBase) => {
          if (res.status === 200 || res.status === 204) {
            this.notification.success(
              'Password changed successfully',
              'Success'
            );

            this.router.navigate(['/auth/forgot-password/password-changed']);
          }
        },
        error: err => {
          this.notification.error(err, 'Error');
        },
      });
  }

  ngOnDestroy(): void {}
}
