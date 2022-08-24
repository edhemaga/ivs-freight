import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthStoreService } from './../state/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

import moment from 'moment';

import { emailRegex } from '../../shared/ta-input/ta-input.regex-validations';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;

  public copyrightYear!: number;

  constructor(
    private formBuilder: FormBuilder,
    private authStoreService: AuthStoreService,
    private notification: NotificationService,
    private inputService: TaInputService
  ) {}

  ngOnInit() {
    this.createForm();

    this.copyrightYear = moment().year();
  }

  private createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, emailRegex]],
      password: [null, [Validators.required]],
      staySignedIn: [false],
    });
  }

  public userLogin() {
    if (this.loginForm.invalid) {
      this.inputService.markInvalid(this.loginForm);
      return false;
    }

    this.authStoreService
      .accountLogin(this.loginForm.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notification.success('Login is success', 'Success');
        },
        error: () => {
          console.log("AGAIN ERROR ON AUTH SERVICE");
          // this.notification.error(
          //   'Something went wrong. Please try again.',
          //   'Error:'
          // );
        },
      });
  }

  public onKeyDown(event: any): void {
    if (event.keyCode === 13) {
      this.userLogin();
    }
  }

  ngOnDestroy(): void {}
}
