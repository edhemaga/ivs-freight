import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { SignInResponse } from 'appcoretruckassist';

export interface State {
    user: SignInResponse;
}

export const authState: State = {
    user: undefined,
};

export const authReducer = createReducer(
    authState,
    on(AuthActions.authLogin, (state) => ({ ...state, user: state.user }))
);
