import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoginProps } from './models/auth-login.model';
import { Observable } from 'rxjs';
import {
    selectAuthLoginError,
    selectAuthLoading,
} from './selectors/auth-login.selector';
import { authLogin } from './actions/login/login.actions';
import { authRegister } from './actions/register/register.actions';
import { SignUpCompanyCommand } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class AuthFacade {
    showSpinner$: Observable<boolean> = this.store.pipe(
        select(selectAuthLoading)
    );

    loginError$: Observable<{ type: string; error: Record<string, boolean> }> =
        this.store.pipe(select(selectAuthLoginError));

    constructor(private store: Store) {}

    logIn(data: LoginProps): void {
        this.store.dispatch(authLogin(data));
    }

    register(data: SignUpCompanyCommand): void {
        this.store.dispatch(authRegister(data));
    }
}
