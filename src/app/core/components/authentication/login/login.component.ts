import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SharedService} from "../../../services/shared/shared.service";
import {AuthService} from "../../../services/auth/auth.service";
import * as moment from "moment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('name') emailInput: any;
  @ViewChild('password') passwordInput: any;

  loginForm!: FormGroup;
  passwordType = 'text';
  copyrightYear!: number;
  inputText!: false;
  passwordText!: false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    //private notification: NotificationService,
    private router: Router,
    //private spinner: SpinnerService,
    private shared: SharedService
  ) {
    this.createForm();
    this.copyrightYear = moment().year();

  }

  ngOnInit() {
    //this.copyrightYear = moment().year();
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
        const url = res.userCompanies.length <= 1 ? '/' : '/select-company';
        // this.notification.success('Login is success', 'Success');
        setTimeout(() => {
          this.router.navigate([url]);
        }, 1000);
        //this.spinner.show(false);
      },
      (error: any) => {
        //error ? this.shared.handleServerError() : null;
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
        [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      ],
      password: ['', Validators.required],
    });
  }

  public onEmailKeyUp(x: any) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.loginForm.get('email')?.value ? this.inputText = false : this.inputText = x.key;
  }

  public onPasswordKeyUp(x: any) {
    this.passwordText = x.key;
    x.key === 'Backspace' && !this.loginForm.get('password')?.value ? this.passwordText = false : this.passwordText = x.key;
  }


  clearEmailInput() {
    this.loginForm.controls['email'].reset();
  }

  clearPasswordInput() {
    this.loginForm.controls['password'].reset();
  }
}
