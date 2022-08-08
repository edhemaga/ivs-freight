import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import * as $ from 'jquery';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ThankYouComponent } from './thank-you-page/thank-you.component';
import { SelectCompanyComponent } from './select-company/select-company.component';
import { AccountActivatedPageComponent } from './account-activated-page/account-activated-page.component';
import { PleaseCheckEmailPageComponent } from './please-check-email-page/please-check-email-page.component';
import { CreateNewPasswordPageComponent } from './create-new-password-page/create-new-password-page.component';
import { PasswordChangedPageComponent } from './password-changed-page/password-changed-page.component';
import { RegisterComponent } from './register/register/register.component';
import { HelperComponent } from './helper/helper.component';
import { HelperForgotPasswordComponent } from './helper-forgot-password/helper-forgot-password.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { HelperSignupUserComponent } from './helper-signup-user/helper-signup-user.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ThankYouComponent,
    SelectCompanyComponent,
    AccountActivatedPageComponent,
    PleaseCheckEmailPageComponent,
    CreateNewPasswordPageComponent,
    PasswordChangedPageComponent,
    RegisterComponent,
    HelperComponent,
    RegisterUserComponent,
    HelperSignupUserComponent,
    HelperForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    GooglePlaceModule,
    AngularSvgIconModule,
    NgbTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule {}
