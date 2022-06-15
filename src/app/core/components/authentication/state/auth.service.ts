import { Inject, Injectable } from '@angular/core';
import { AuthState, AuthStore } from './auth.store';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

import {
  AccountService,
  SignInCommand,
  SignInResponse,
  SignUpCompanyCommand,
  ForgotPasswordCommand,
  SetNewPasswordCommand,
  VerifyOwnerCommand,
  VerifyForgotPasswordCommand,
} from 'appcoretruckassist';
import { Router } from '@angular/router';
import { PersistState } from '@datorama/akita';
import { configFactory } from 'src/app/app.config';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private forgotPasswordTokenSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  constructor(
    private authStore: AuthStore,
    private accountService: AccountService,
    private router: Router,
    @Inject('persistStorage') private persistStorage: PersistState
  ) {}

  public getForgotPasswordToken(token: string) {
    console.log('servis', token);
    this.forgotPasswordTokenSubject.next(token);
  }

  get getForgotPassword$() {
    return this.forgotPasswordTokenSubject.asObservable();
  }

  public accountLogin(data: SignInCommand): Observable<SignInResponse> {
    return this.accountService.apiAccountLoginPost(data).pipe(
      tap((user: SignInResponse) => {
        // Production
        this.authStore.set({ 1: user });
        configFactory(user.token);
        // Develop
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/dashboard']);
      })
    );
  }

  public accountLogut(): void {
    // ---- PRODUCTION MODE ----
    this.persistStorage.clearStore();
    this.persistStorage.destroy();
    this.router.navigate(['/auth/login']);
    configFactory(null);
    // ---- DEVELOP MODE ----
    localStorage.removeItem('user');
  }

  public forgotPassword(data: ForgotPasswordCommand): Observable<object> {
    return this.accountService.apiAccountForgotpasswordPut(data, 'response');
  }

  public verifyForgotPassword(
    data: VerifyForgotPasswordCommand
  ): Observable<object> {
    return this.accountService.apiAccountVerifyforgotpasswordPut(data);
  }

  public createNewPassword(data: SetNewPasswordCommand): Observable<object> {
    return this.accountService.apiAccountSetnewpasswordPut(data, 'response');
  }

  public signUpCompany(data: SignUpCompanyCommand): Observable<object> {
    return this.accountService.apiAccountSignupcompanyPost(data, 'response');
  }

  public verifyOwner(data: VerifyOwnerCommand): Observable<object> {
    return this.accountService.apiAccountVerifyownerPut(data, 'response');
  }
}
