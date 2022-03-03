import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SharedService} from "../../../services/shared/shared.service";
import {AuthService} from "../../../services/auth/auth.service";
import moment from "moment";
import {NotificationService} from "../../../services/notification/notification.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, AfterViewInit {

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  @ViewChild('name') emailInput: any;
  @ViewChild('password') passwordInput: any;

  loginForm: FormGroup;
  passwordType = 'text';
  copyrightYear!: number;
  inputText!: false;
  passwordText!: false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private spinner: SpinnerService,
    private shared: SharedService,
    private changeDetectorRef: ChangeDetectorRef,
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
    this.authService.userLogin(data).subscribe(
      (res: any) => {
        localStorage.setItem('multiple_companies', JSON.stringify(res.userCompanies));
        const url = res.userCompanies.length <= 1 ? '/dashboard' : '/select-company';
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
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      password: ['', Validators.required],
    });
  }

  public onEmailKeyUp(x: any) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.loginForm.get('email')?.value ? this.inputText = false : this.inputText = x.key;
    this.changeDetectorRef.detectChanges();
  }

  public onPasswordKeyUp(x: any) {
    this.passwordText = x.key;
    x.key === 'Backspace' && !this.loginForm.get('password')?.value ? this.passwordText = false : this.passwordText = x.key;
  }

  clearEmailInput() {
    this.loginForm.controls['email'].reset();
    this.inputText = false;
    this.changeDetectorRef.detectChanges();
  }

  clearPasswordInput() {
    this.loginForm.controls['password'].reset();
    this.passwordText = false;
    this.changeDetectorRef.detectChanges();
  }
}
