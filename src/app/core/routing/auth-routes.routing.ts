import { ResetPasswordHelperComponent } from 'src/app/pages/website/components/website-sidebar/sidebar-content/login-content/reset-password-helper/reset-password-helper.component';
import { RegisterCompanyHelperComponent } from 'src/app/pages/website/components/website-sidebar/sidebar-content/register-company-content/register-company-helper/register-company-helper.component';
import { RegisterUserHaveAccountHelperComponent } from 'src/app/pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user-have-account-helper/register-user-have-account-helper.component';
import { RegisterUserHelperComponent } from 'src/app/pages/website/components/website-sidebar/sidebar-content/register-user-content/register-user-helper/register-user-helper.component';
import { VerifyUserHelperComponent } from 'src/app/pages/website/components/website-sidebar/sidebar-content/register-user-content/verify-user-helper/verify-user-helper.component';

export class AuthRoutes {
    static routes = [
        {
            path: 'website',
            loadChildren: () =>
                import('src/app/pages/website/website.module').then(
                    (m) => m.WebsiteModule
                ),
        },

        {
            path: 'api/account/signupuser',
            component: RegisterUserHelperComponent,
            data: { title: 'Helper Component Route' },
        },
        {
            path: 'api/account/signupuserhaveaccount',
            component: RegisterUserHaveAccountHelperComponent,
            data: { title: 'Helper Component Route' },
        },
        {
            path: 'api/account/verifyuser',
            component: VerifyUserHelperComponent,
            data: { title: 'Helper Component Route' },
        },
        {
            path: 'api/account/verifyowner',
            component: RegisterCompanyHelperComponent,
            data: { title: 'Helper Component Route' },
        },
        {
            path: 'api/account/verifyforgotpassword',
            component: ResetPasswordHelperComponent,
            data: { title: 'Helper Component Route' },
        },
    ];
}
