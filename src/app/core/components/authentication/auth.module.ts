import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ThankYouComponent } from './thank-you-page/thank-you.component';
import { SelectCompanyComponent } from './select-company/select-company.component';
import { RegisterComponent } from './register/register/register.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AngularSvgIconModule } from 'angular-svg-icon';
import * as $ from 'jquery';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PleaseCheckEmailPageComponent } from './please-check-email-page/please-check-email-page.component';
import { CreateNewPasswordPageComponent } from './create-new-password-page/create-new-password-page.component';
import { PasswordChangedPageComponent } from './password-changed-page/password-changed-page.component';

@NgModule({
    declarations: [
        LoginComponent,
        ForgotPasswordComponent,
        ChangePasswordComponent,
        ThankYouComponent,
        SelectCompanyComponent,
        RegisterComponent,
        PleaseCheckEmailPageComponent,
        CreateNewPasswordPageComponent,
        PasswordChangedPageComponent,
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
