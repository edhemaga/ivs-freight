import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { WebsiteActionsService } from './website-actions.service';

import { PersistState } from '@datorama/akita';

import {
    AccountService,
    ForgotPasswordCommand,
    SetNewPasswordCommand,
    SignInCommand,
    SignInResponse,
    SignUpCompanyCommand,
    SignupUserCommand,
    VerifyForgotPasswordCommand,
    VerifyOwnerCommand,
} from 'appcoretruckassist';
import { ConstantString } from '../enum/const-string.enum';

@Injectable({
    providedIn: 'root',
})
export class WebsiteAuthStoreService {
    constructor(
        @Inject('persistStorage')
        private persistStorage: PersistState,
        private router: Router,
        private accountService: AccountService,
        private websiteActionsService: WebsiteActionsService
    ) {}

    public registerCompany(data: SignUpCompanyCommand): Observable<object> {
        return this.accountService.apiAccountSignupcompanyPost(
            data,
            'response'
        );
    }

    public registerCompanyVerifyOwner(
        data: VerifyOwnerCommand
    ): Observable<object> {
        return this.accountService
            .apiAccountVerifyownerPut(data, 'response')
            .pipe(
                tap(() => {
                    this.router.navigate([ConstantString.WEBSITE]);

                    this.websiteActionsService.setOpenSidebarSubject(true);

                    this.websiteActionsService.setSidebarContentType(
                        ConstantString.START_TRIAL_WELCOME
                    );
                })
            );
    }

    public accountLogin(data: SignInCommand): Observable<SignInResponse> {
        return this.accountService.apiAccountLoginPost(data).pipe(
            tap((user: SignInResponse) => {
                this.router.navigate(['/dashboard']);

                // Production
                // this.authStore.set({ 1: user });
                // Develop
                localStorage.setItem('user', JSON.stringify(user));
            })
        );
    }

    public accountLogout(): void {
        // ---- PRODUCTION MODE ----
        this.persistStorage.clearStore();
        this.persistStorage.destroy();
        this.router.navigate(['/website']);

        // ---- DEVELOP MODE ----
        localStorage.removeItem('user');
    }

    public resetPassword(data: ForgotPasswordCommand): Observable<object> {
        return this.accountService.apiAccountForgotpasswordPut(
            data,
            'response'
        );
    }

    public verifyResetPassword(
        data: VerifyForgotPasswordCommand
    ): Observable<object> {
        return this.accountService.apiAccountVerifyforgotpasswordPut(data).pipe(
            tap((res: { token: string }) => {
                this.router.navigate([ConstantString.WEBSITE]);

                this.websiteActionsService.setOpenSidebarSubject(true);

                this.websiteActionsService.setSidebarContentType(
                    ConstantString.CREATE_NEW_PASSWORD
                );

                this.websiteActionsService.setResetPasswordToken(res.token);
            })
        );
    }

    public createNewPassword(data: SetNewPasswordCommand): Observable<object> {
        return this.accountService
            .apiAccountSetnewpasswordPut(data, 'response')
            .pipe(
                tap(() => {
                    localStorage.removeItem('user');

                    this.websiteActionsService.setSidebarContentType(
                        ConstantString.PASSWORD_UPDATED
                    );
                })
            );
    }

    public registerUser(data: SignupUserCommand): Observable<any> {
        return this.accountService.apiAccountSignupuserPut(data, 'response');
    }
}
