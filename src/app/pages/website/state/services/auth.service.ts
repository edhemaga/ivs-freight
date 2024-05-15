import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// store
import { Store, select } from '@ngrx/store';

// selectors
import {
    selectAuthLoginError,
    selectAuthLoading,
} from '@pages/website/state/selectors/auth-login.selector';

// actions
import { authLogin } from '@pages/website/state/actions/login/login.actions';
import { authRegister } from '@pages/website/state/actions/register/register.actions';

// models
import { LoginProps } from '@pages/website/state/models/auth-login.model';
import { SignUpCompanyCommand } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class AuthFacadeService {
    public showSpinner$: Observable<boolean> = this.store.pipe(
        select(selectAuthLoading)
    );

    public loginError$: Observable<{
        type: string;
        error: Record<string, boolean>;
    }> = this.store.pipe(select(selectAuthLoginError));

    constructor(private store: Store) {}

    public logIn(data: LoginProps): void {
        this.store.dispatch(authLogin(data));
    }

    public register(data: SignUpCompanyCommand): void {
        this.store.dispatch(authRegister(data));
    }
}
