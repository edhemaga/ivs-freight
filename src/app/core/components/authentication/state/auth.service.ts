import { Inject, Injectable } from '@angular/core';
import { AuthState, AuthStore } from './auth.store';
import { Observable, tap } from 'rxjs';

import {
  AccountService,
  SignInCommand,
  SignInResponse,
  SignUpCompanyCommand,
} from 'appcoretruckassist';
import { Router } from '@angular/router';
import { PersistState } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  constructor(
    private authStore: AuthStore,
    private accountService: AccountService,
    private router: Router,
    @Inject('persistStorage') private persistStorage: PersistState
  ) {}

  public accountLogin(data: SignInCommand): Observable<SignInResponse> {
    return this.accountService.apiAccountLoginPost(data).pipe(
      tap((user: SignInResponse) => {
        this.authStore.set({ 1: user });
        localStorage.setItem("user", JSON.stringify(user));
        this.router.navigate(['/dashboard']);
      })
    );
  }

  public accountLogut(): void {
    this.persistStorage.clearStore();
    this.persistStorage.destroy();
    this.router.navigate(['/login']);
  }

  public signUpCompany(data: SignUpCompanyCommand): Observable<object> {
    return this.accountService.apiAccountSignupcompanyPost(data, 'response');
  }
}
