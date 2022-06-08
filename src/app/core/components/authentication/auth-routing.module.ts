import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ThankYouComponent } from './thank-you-page/thank-you.component';

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
        path: 'register/thanks',
        component: ThankYouComponent,
        data: { title: 'Register' },
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
