import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PleaseCheckEmailPageComponent } from './please-check-email-page/please-check-email-page.component';
import { CreateNewPasswordPageComponent } from './create-new-password-page/create-new-password-page.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        data: { title: 'Login' },
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'Forgot password' },
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
