import { SignInResponse } from 'appcoretruckassist';
import { LoginProps } from './auth.model';

import { createAction, props } from '@ngrx/store';

export const authLogin = createAction(
    '[Login Page] Login',
    props<LoginProps>()
);

export const authLoginSuccess = createAction(
    '[Login Page] Login Success',
    props<SignInResponse>()
);

export const authLoginError = createAction(
    '[Login Page] Login Fail',
    props<{ errorMsg: string }>()
);
