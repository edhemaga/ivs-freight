import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { WebsiteActionsService } from './website-actions.service';

import {
    AccountService,
    ForgotPasswordCommand,
    SetNewPasswordCommand,
    SignInCommand,
    SignInResponse,
    SignUpCompanyCommand,
    VerifyForgotPasswordCommand,
    VerifyOwnerCommand,
} from 'appcoretruckassist';
import { ConstantString } from '../enum/const-string.enum';

@Injectable({
    providedIn: 'root',
})
export class WebsiteAuthStoreService {
    private resetPasswordTokenSubject: BehaviorSubject<string> =
        new BehaviorSubject<string>(null);

    constructor(
        private router: Router,
        private accountService: AccountService,
        private websiteActionsService: WebsiteActionsService
    ) {}

    public setResetPasswordToken(token: string) {
        this.resetPasswordTokenSubject.next(token);
    }

    get getResetPasswordToken$() {
        return this.resetPasswordTokenSubject.asObservable();
    }

    /* BACKEND ACTIONS */

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

                this.setResetPasswordToken(res.token);
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
}
