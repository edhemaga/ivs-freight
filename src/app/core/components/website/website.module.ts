import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';

import { SharedModule } from '../shared/shared.module';

import { WebsiteMainComponent } from './components/website-main/website-main.component';
import { WebsiteNavbarComponent } from './components/website-navbar/website-navbar.component';
import { WebsiteConfirmBtnComponent } from './components/website-confirm-btn/website-confirm-btn.component';
import { WebsiteResendBtnComponent } from './components/website-resend-btn/website-resend-btn.component';

import { WebsiteSidebarComponent } from './components/website-sidebar/website-sidebar.component';
import { RegisterCompanyComponent } from './components/website-sidebar/sidebar-content/register-company-content/register-company/register-company.component';
import { ConfirmationComponent } from './components/website-sidebar/sidebar-content/confirmation-content/confirmation.component';
import { RegisterCompanyHelperComponent } from './components/website-sidebar/sidebar-content/register-company-content/register-company-helper/register-company-helper.component';
import { RegisterCompanyWelcomeComponent } from './components/website-sidebar/sidebar-content/register-company-content/register-company-welcome/register-company-welcome.component';
import { LoginComponent } from './components/website-sidebar/sidebar-content/login-content/login/login.component';
import { ResetPasswordComponent } from './components/website-sidebar/sidebar-content/login-content/reset-password/reset-password.component';
import { CreateNewPasswordComponent } from './components/website-sidebar/sidebar-content/login-content/create-new-password/create-new-password.component';
import { ResetPasswordHelperComponent } from './components/website-sidebar/sidebar-content/login-content/reset-password-helper/reset-password-helper.component';
import { ResendConfirmationComponent } from './components/website-sidebar/sidebar-content/login-content/resend-confirmation/resend-confirmation.component';
import { PasswordUpdatedComponent } from './components/website-sidebar/sidebar-content/login-content/password-updated/password-updated.component';

@NgModule({
    declarations: [
        WebsiteMainComponent,
        WebsiteNavbarComponent,
        WebsiteConfirmBtnComponent,
        WebsiteResendBtnComponent,

        /* SIDEBAR */

        WebsiteSidebarComponent,
        RegisterCompanyComponent,
        ConfirmationComponent,
        RegisterCompanyHelperComponent,
        RegisterCompanyWelcomeComponent,
        LoginComponent,
        ResetPasswordComponent,
        CreateNewPasswordComponent,
        ResetPasswordHelperComponent,
        ResendConfirmationComponent,
        PasswordUpdatedComponent,
    ],
    imports: [CommonModule, WebsiteRoutingModule, SharedModule],
})
export class WebsiteModule {}

/* 

DEPENDENCIES


AngularSvgIconModule
app-ta-input
app-ta-checkbox

*/
