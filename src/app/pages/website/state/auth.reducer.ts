// store
import { createReducer, on } from '@ngrx/store';

// actions
import * as AuthActions from '@pages/website/state/actions/login/auth.actions';

//models
import { AuthState } from '@pages/website/state/auth.model';

export const authState: AuthState = {
    user: undefined,
    error: undefined,
    loading: false,
    hideSIdebar: false,
};

export const authReducer = createReducer(
    authState,
    on(AuthActions.authLogin, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(AuthActions.authLoginSuccess, (state, user) => ({
        ...state,
        user: user,
        loading: false,
        hideSIdebar: true,
    })),
    on(AuthActions.authLoginError, (state, error) => ({
        ...state,
        error: error.error,
        loading: false,
    }))
);
