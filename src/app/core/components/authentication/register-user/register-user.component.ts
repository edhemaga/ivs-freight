import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { untilDestroyed } from 'ngx-take-until-destroy';

import moment from 'moment';

import {
  emailRegex,
  phoneRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { SignupUserCommand } from 'appcoretruckassist/model/models';
import { AuthStoreService } from '../state/auth.service';
import { HttpResponseBase } from '@angular/common/http';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit, OnDestroy {
  public registerUserForm!: FormGroup;

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

    this.passwordsNotSame();

    this.copyrightYear = moment().year();
  }

  private createForm(): void {
    this.registerUserForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      phone: [null, [Validators.required, phoneRegex]],
      email: [null, [Validators.required, emailRegex]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }

  public passwordsNotSame(): void {
    this.registerUserForm
      .get('confirmPassword')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
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

    const saveData: SignupUserCommand = {};

    this.notification.success('Registration is successful', 'Success');

    this.router.navigate(['/register-user/account-activated']);
    /* 
    this.authStoreService
      .signUpUser(saveData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: HttpResponseBase) => {
          if (res.status === 200 || res.status === 204) {
            this.notification.success('Registration is successful', 'Success');

            this.router.navigate(['/register-user/account-activated']);
          }
        },
        error: err => {
          this.notification.error(err, 'Error');
        },
      }); */
  }

  ngOnDestroy(): void {}
}
