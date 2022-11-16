import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import {
  AccountService,
  SignInCommand,
  SignInResponse,
  SignUpCompanyCommand,
  ForgotPasswordCommand,
  SetNewPasswordCommand,
  VerifyOwnerCommand,
  SignupUserCommand,
  VerifyForgotPasswordCommand,
} from 'appcoretruckassist';
import { Router } from '@angular/router';
import { PersistState } from '@datorama/akita';
import { SignUpUserInfo } from '../../../model/signUpUserInfo';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private signUpUserInfoSubject: BehaviorSubject<SignUpUserInfo> =
    new BehaviorSubject<SignUpUserInfo>(null);

  private forgotPasswordTokenSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  constructor(
    private accountService: AccountService,
    private router: Router,
    @Inject('persistStorage') private persistStorage: PersistState
  ) {}

  public getForgotPasswordToken(token: string) {
    this.forgotPasswordTokenSubject.next(token);
  }

  public getSignUpUserInfo(signUpUserInfo: SignUpUserInfo) {
    this.signUpUserInfoSubject.next(signUpUserInfo);
  }

  get getForgotPassword$() {
    return this.forgotPasswordTokenSubject.asObservable();
  }

  get getSignUpUserInfo$() {
    return this.signUpUserInfoSubject.asObservable();
  }

  public accountLogin(data: SignInCommand): Observable<SignInResponse> {
    return this.accountService.apiAccountLoginPost(data).pipe(
      tap((user: SignInResponse) => {
        // Production
        // this.authStore.set({ 1: user });
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

  public signUpUser(data: SignupUserCommand): Observable<any> {
    return this.accountService.apiAccountSignupuserPut(data, 'response');
  }

  public verifyOwner(data: VerifyOwnerCommand): Observable<object> {
    return this.accountService.apiAccountVerifyownerPut(data, 'response');
  }
}
