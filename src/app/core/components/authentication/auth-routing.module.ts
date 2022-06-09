import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ThankYouComponent } from './thank-you-page/thank-you.component';
import { AccountActivatedPageComponent } from './account-activated-page/account-activated-page.component';

const routes: Routes = [
    {
        path: '',
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
        path: 'register/activated',
        component: AccountActivatedPageComponent,
        data: { title: 'Account Activated' },
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'Forgot password' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
