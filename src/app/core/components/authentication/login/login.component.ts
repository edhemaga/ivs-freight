import { AuthStoreService } from './../state/auth.service';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import moment from 'moment';
import { NotificationService } from '../../../services/notification/notification.service';
import { SpinnerService } from '../../../services/spinner/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm: FormGroup;
  passwordType = 'text';
  copyrightYear!: number;
  inputText!: false;
  passwordText!: false;

  constructor(
    private formBuilder: FormBuilder,
    private authStoreService: AuthStoreService,
    private notification: NotificationService,
    private router: Router,
    private spinner: SpinnerService,
    private shared: SharedService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.copyrightYear = moment().year();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.passwordType = 'password';
    }, 500);
  }

  /**
   * User login function
   *
   * @param e Any
   */
  public userLogin(e: any): any {
    e.preventDefault();
    if (!this.shared.markInvalid(this.loginForm)) {
      return false;
    }
    const data = this.loginForm.value;
    this.authStoreService.userLogin(data).subscribe(
      (res: any) => {
        localStorage.setItem(
          'multiple_companies',
          JSON.stringify(res.userCompanies)
        );
        const url =
          res.userCompanies.length <= 1 ? '/dashboard' : '/select-company';
        this.notification.success('Login is success', 'Success');
        setTimeout(() => {
          this.router.navigate([url]);
        }, 1000);
        this.spinner.show(false);
      },
      (error: any) => {
        error ? this.shared.handleServerError() : null;
      }
    );
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: [null, [Validators.required, Validators.minLength(5)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
