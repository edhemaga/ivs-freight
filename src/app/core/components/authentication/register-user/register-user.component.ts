import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponseBase } from '@angular/common/http';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import moment from 'moment';

import { SignupUserCommand } from 'appcoretruckassist/model/models';
import { SignUpUserInfo } from 'src/app/core/model/signUpUserInfo';

import {
  addressValidation,
  emailRegex,
  emailValidation,
  phoneRegex,
} from '../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AuthStoreService } from '../state/auth.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@UntilDestroy()
@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit, OnDestroy {
  public registerUserForm!: FormGroup;

  private signUpUserCode: string;

  public copyrightYear!: number;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private authStoreService: AuthStoreService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.patchForm();

    this.passwordsNotSame();

    this.copyrightYear = moment().year();
  }

  private createForm(): void {
    this.registerUserForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, Validators.maxLength(6)],
      phone: [null, [Validators.required, phoneRegex]],
      email: [null, [Validators.required, emailRegex, ...emailValidation]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }

  private patchForm(): void {
    this.authStoreService.getSignUpUserInfo$
      .pipe(untilDestroyed(this))
      .subscribe((signUpUserInfo: SignUpUserInfo) => {
        this.registerUserForm.patchValue({
          firstName: signUpUserInfo.firstName,
          lastName: signUpUserInfo.lastName,
          address: signUpUserInfo.address,
          addressUnit: signUpUserInfo.addressUnit,
          phone: signUpUserInfo.phone,
          email: signUpUserInfo.email,
        });

        this.signUpUserCode = signUpUserInfo.code;
      });
  }

  public passwordsNotSame(): void {
    this.registerUserForm
      .get('confirmPassword')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (
          value?.toLowerCase() ===
          this.registerUserForm.get('password').value?.toLowerCase()
        ) {
          this.registerUserForm.get('confirmPassword').setErrors(null);
        } else {
          this.registerUserForm.get('confirmPassword').setErrors({
            invalid: true,
          });
        }
      });
  }

  public registerUser(): void {
    if (this.registerUserForm.invalid) {
      this.inputService.markInvalid(this.registerUserForm);
      return;
    }

    const { email, password } = this.registerUserForm.value;

    const saveData: SignupUserCommand = {
      email,
      password,
      code: this.signUpUserCode,
    };

    this.authStoreService
      .signUpUser(saveData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: HttpResponseBase) => {
          if (res.status === 200 || res.status === 204) {
            this.notification.success('Registration is successful', 'Success');

            this.router.navigate(['/auth/register-user/account-activated']);
          }
        },
        error: (err) => {
          this.notification.error(err, 'Error');
        },
      });
  }

  public onKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.registerUser();
    }
  }

  ngOnDestroy(): void {}
}
