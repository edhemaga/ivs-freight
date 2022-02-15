import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {title: 'Login'},
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {title: 'Forgot password'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
