import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PleaseCheckEmailPageComponent } from './please-check-email-page/please-check-email-page.component';
import { CreateNewPasswordPageComponent } from './create-new-password-page/create-new-password-page.component';
import { PasswordChangedPageComponent } from './password-changed-page/password-changed-page.component';
import { RegisterComponent } from './register/register/register.component';
import { ThankYouComponent } from './thank-you-page/thank-you.component';
import { AccountActivatedPageComponent } from './account-activated-page/account-activated-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register' },
  },
  {
    path: 'register/thank-you',
    component: ThankYouComponent,
    data: { title: 'Thank You' },
  },
  {
    path: 'register/account-activated',
    component: AccountActivatedPageComponent,
    data: { title: 'Account Activated' },
  }, 
  // http://localhost:4200/api/account/verifyowner?EmailHash=ex62tvq54Ma3MiE566QGd918tLbVXzveVN0R3ehzKeM=&Code=kWkWR8acg0CAYX27L9viEQ==
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Forgot Password' },
  },
  {
    path: 'forgot-password/check-email',
    component: PleaseCheckEmailPageComponent,
    data: { title: 'Check Email' },
  },
  {
    path: 'forgot-password/create-new-password',
    component: CreateNewPasswordPageComponent,
    data: { title: 'Create New Password' },
  },
  {
    path: 'forgot-password/password-changed',
    component: PasswordChangedPageComponent,
    data: { title: 'Password Changed' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
