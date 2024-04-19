import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { SignInResponse } from 'appcoretruckassist';

export interface AuthState {
    user: SignInResponse;
    error: any;
}

export const authState: AuthState = {
    user: undefined,
    error: undefined,
};

export const authReducer = createReducer(
    authState,
    on(AuthActions.authLogin, (state) => { console.log("USER LOGIN SUCCESSSSSS", state); return state; }), //({ ...state, user: state.user })
    on(AuthActions.authLoginError, (state) => ({
        ...state,
        error: state.error,
    }))
);
