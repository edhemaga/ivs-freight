import { AuthStoreService } from './../state/auth.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { NotificationService } from '../../../services/notification/notification.service';
import { emailRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

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
    this.copyrightYear = moment().year();
    this.createForm();
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
          this.notification.error(
            'Something went wrong. Please try again.',
            'Error:'
          );
        },
      });
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, emailRegex]],
      password: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {}
}
