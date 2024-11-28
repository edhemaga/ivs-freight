// store
import { createReducer, on } from '@ngrx/store';

// actions
import * as AuthLoginActions from '@pages/website/state/actions/login/login.actions';
import * as AuthRegisterActions from '@pages/website/state/actions/register/register.actions';

//models
import { AuthState } from '@pages/website/state/models/auth-state.model';

export const authState: AuthState = {
    user: undefined,
    error: undefined,
    loading: false,
    hideSIdebar: false,
};

export const authReducer = createReducer(
    authState,

    // Login Actions
    on(AuthLoginActions.authLogin, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(AuthLoginActions.authLoginSuccess, (state, user) => ({
        ...state,
        user: user,
        loading: false,
        hideSIdebar: true,
    })),

    on(AuthLoginActions.authLoginError, (state, error) => {
        return {
            ...state,
            error: error.error,
            loading: false,
        };
    }),

    // Register Actions
    on(AuthRegisterActions.authRegister, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(AuthRegisterActions.authRegisterSuccess, (state) => ({
        ...state,
        loading: false,
        error: null,
    })),
    on(AuthRegisterActions.authRegisterError, (state, error) => ({
        ...state,
        error: error.error,
        loading: false,
    }))
);
