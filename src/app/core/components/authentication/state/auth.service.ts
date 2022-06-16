import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { AuthStore } from './auth.store';

import { BehaviorSubject, map, Observable } from 'rxjs';

import {
  AccountService,
  ForgotPasswordCommand,
  SetNewPasswordCommand,
  SignUpCompanyCommand,
  SignupUserCommand,
} from 'appcoretruckassist';
import { SignUpUserInfo } from 'src/app/core/model/signUpUserInfo';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private signUpUserInfoSubject: BehaviorSubject<SignUpUserInfo> =
    new BehaviorSubject<SignUpUserInfo>(null);

  constructor(
    private authStore: AuthStore,
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  public getSignUpUserInfo(signUpUserInfo: SignUpUserInfo) {
    this.signUpUserInfoSubject.next(signUpUserInfo);
  }

  get getSignUpUserInfo$() {
    return this.signUpUserInfoSubject.asObservable();
  }

  public userLogin(data: any) {
    return this.http
      .post(environment.API_ENDPOINT + '/api/account/login', data)
      .pipe(
        map((user: any) => {
          localStorage.setItem('currentUser', JSON.stringify(user.loggedUser));
          localStorage.setItem('token', JSON.stringify(user.token));
          localStorage.setItem('userCompany', JSON.stringify(user.userCompany));
          this.authStore.update(user);
          return user;
        })
      );
  }

  public forgotPassword(data: ForgotPasswordCommand): Observable<object> {
    return this.accountService.apiAccountForgotpasswordPut(data, 'response');
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
}
