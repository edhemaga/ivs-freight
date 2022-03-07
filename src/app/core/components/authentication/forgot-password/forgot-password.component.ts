import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedService} from "../../../services/shared/shared.service";
// import {AuthService} from "../../../services/auth/auth.service";
import moment from "moment";
// import {NotificationService} from "../../../services/notification/notification.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  get emailField() {
    return this.forgotPasswordForm.get('email');
  }

  @ViewChild('email') emailInput: any;

  email!: null;
  forgotPasswordForm!: FormGroup;
  userId = localStorage.getItem('');
  passwordEmailSent = false;
  copyrightYear: number;
  inputText!: false;

  constructor(
    private formBuilder: FormBuilder,
    private shared: SharedService,
    // private authService: AuthService,
    // private notification: NotificationService
  ) {
    this.createForm();
    this.copyrightYear = moment().year();
  }

  ngOnInit() {
  }

  createForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/)]]
    });
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  /* resetPassword() {
    const resetData = {
      email: this.forgotPasswordForm.get('email').value
    };
    this.authService.requestResetPassword(resetData).subscribe(
      (response: any) => {
        if (response) {
          this.notification.success('Confirmation mail sent', 'Success');
          this.forgotPasswordForm.reset();
          this.passwordEmailSent = true;
        }
      }
    );
  } */

  public onKeyUp(x: any) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.forgotPasswordForm.get('email')?.value ? this.inputText = false : this.inputText = x.key
  }

  clearEmailInput() {
    this.forgotPasswordForm.controls['email'].reset();
    this.inputText = false;
  }

}
