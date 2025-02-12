import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { WebsiteRoutingModule } from '@pages/website/website-routing.module';
import { SharedModule } from '@shared/shared.module';
//import { SlickCarouselModule } from 'ngx-slick-carousel';

// components
import { WebsiteMainComponent } from '@pages/website/pages/website-main/website-main.component';
import { WebsiteNavbarComponent } from '@pages/website/components/website-navbar/website-navbar.component';
import { SidebarConfirmBtnComponent } from '@pages/website/components/website-sidebar/sidebar-btns/sidebar-confirm-btn/sidebar-confirm-btn.component';
import { SidebarResendBtnComponent } from '@pages/website/components/website-sidebar/sidebar-btns/sidebar-resend-btn/sidebar-resend-btn.component';
import { SidebarDropdownComponent } from '@pages/website/components/website-sidebar/sidebar-dropdown/sidebar-dropdown.component';

import { WebsiteSidebarComponent } from '@pages/website/components/website-sidebar/website-sidebar.component';
import { RegisterCompanyComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-company-content/register-company/register-company.component';
import { ConfirmationComponent } from '@pages/website/components/website-sidebar/sidebar-content/confirmation-content/confirmation.component';
import { RegisterCompanyHelperComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-company-content/register-company-helper/register-company-helper.component';
import { WelcomeComponent } from '@pages/website/components/website-sidebar/sidebar-content/welcome-content/welcome.component';
import { LoginComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/login/login.component';
import { ResetPasswordComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/reset-password/reset-password.component';
import { CreateNewPasswordComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/create-new-password/create-new-password.component';
import { ResetPasswordHelperComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/reset-password-helper/reset-password-helper.component';
import { ResendConfirmationComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/resend-confirmation/resend-confirmation.component';
import { PasswordUpdatedComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/password-updated/password-updated.component';
import { RegisterUserComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user/register-user.component';
import { RegisterUserHelperComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user-helper/register-user-helper.component';
import { RegisterUserHaveAccountHelperComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user-have-account-helper/register-user-have-account-helper.component';
import { VerifyUserHelperComponent } from '@pages/website/components/website-sidebar/sidebar-content/register-user-content/verify-user-helper/verify-user-helper.component';
import { SelectCompanyComponent } from '@pages/website/components/website-sidebar/sidebar-content/login-content/select-company/select-company.component';

import { WebsiteUnderConstructionComponent } from '@pages/website/components/website-under-construction/website-under-construction.component';

import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';

// ngrx
import { EffectsModule } from '@ngrx/effects';
import { AuthEffect } from '@pages/website/state/auth.effect';
import { StoreModule } from '@ngrx/store';

// ngrx reducers
import { authReducer } from '@pages/website/state/auth.reducer';
import { CaInputAddressDropdownComponent, CaProfileImageComponent, InputTestComponent } from 'ca-components';

@NgModule({
    declarations: [
        WebsiteMainComponent,
        WebsiteNavbarComponent,

        // sidebar
        WebsiteSidebarComponent,
        SidebarConfirmBtnComponent,
        SidebarResendBtnComponent,
        SidebarDropdownComponent,
        RegisterCompanyComponent,
        ConfirmationComponent,
        RegisterCompanyHelperComponent,
        WelcomeComponent,
        LoginComponent,
        ResetPasswordComponent,
        CreateNewPasswordComponent,
        ResetPasswordHelperComponent,
        ResendConfirmationComponent,
        PasswordUpdatedComponent,
        RegisterUserComponent,
        RegisterUserHelperComponent,
        RegisterUserHaveAccountHelperComponent,
        VerifyUserHelperComponent,
        SelectCompanyComponent,
        WebsiteUnderConstructionComponent,
    ],
    imports: [
        // modules
        CommonModule,
        WebsiteRoutingModule,
        SharedModule,
        //SlickCarouselModule,
        RouterModule,

        // components
        TaInputComponent,
        TaCheckboxComponent,
        TaSpinnerComponent,
        CaProfileImageComponent,
        CaInputAddressDropdownComponent,
        InputTestComponent,

       // CaComponentsLibModule,
        // ngrx effects
        EffectsModule.forFeature([AuthEffect]),
        //ngrx reducers
        StoreModule.forFeature('auth', authReducer),
    ],
})
export class WebsiteModule {}
