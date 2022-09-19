import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponseBase } from '@angular/common/http';

import { AuthStoreService } from '../../state/auth.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import moment from 'moment';

import { AddressEntity, SignUpCompanyCommand } from 'appcoretruckassist';

import {
  addressUnitValidation,
  addressValidation,
  einNumberRegex,
  firstNameValidation,
  lastNameValidation,
  passwordValidation,
  phoneFaxRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public registerForm!: FormGroup;

  public copyrightYear!: number;

  public selectedAddress: AddressEntity = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private notification: NotificationService,
    private authStoreService: AuthStoreService,
    private inputService: TaInputService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.passwordsNotSame();

    this.copyrightYear = moment().year();
  }

  private createForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: [null, [Validators.required, ...firstNameValidation]],
      lastName: [null, [Validators.required, ...lastNameValidation]],
      companyName: [null, Validators.required],
      ein: [null, [Validators.required, einNumberRegex]],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      phone: [null, [Validators.required, phoneFaxRegex]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required, ...passwordValidation]],
      confirmPassword: [null, [Validators.required, ...passwordValidation]],
    });

    this.inputService.customInputValidator(
      this.registerForm.get('email'),
      'email',
      this.destroy$
    );
  }

  public handleAddressChange(event: any): void {
    if (event.valid) {
      this.selectedAddress = event.address;
    }
  }

  public passwordsNotSame(): void {
    this.registerForm
      .get('confirmPassword')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (
          value?.toLowerCase() ===
          this.registerForm.get('password').value?.toLowerCase()
        ) {
          this.registerForm.get('confirmPassword').setErrors(null);
        } else {
          this.registerForm.get('confirmPassword').setErrors({
            invalid: true,
          });
        }
      });
  }

  public registerCompany(): void {
    if (this.registerForm.invalid) {
      this.inputService.markInvalid(this.registerForm);
      return;
    }

    const { address, addressUnit, confirmPassword, ...registerForm } =
      this.registerForm.value;

    this.selectedAddress.addressUnit =
      this.registerForm.get('addressUnit').value;

    const saveData: SignUpCompanyCommand = {
      ...registerForm,
      address: this.selectedAddress,
    };

    this.authStoreService
      .signUpCompany(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponseBase) => {
          if (res.status === 200 || res.status === 204) {
            this.notification.success('Registration is successful', 'Success');

            localStorage.setItem(
              'thankYouEmail',
              JSON.stringify(this.registerForm.get('email').value)
            );

            this.router.navigate(['/auth/register/thank-you']);
          }
        },
        error: (err) => {
          this.notification.error(err, 'Error');
        },
      });
  }

  public onKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.registerCompany();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
