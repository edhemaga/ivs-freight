import { HttpErrorResponse } from '@angular/common/http';
// store
import { createAction, props } from '@ngrx/store';

// models
import { SignInResponse } from 'appcoretruckassist';
import { LoginProps } from '@pages/website/state/models/auth-login.model';

// enums
import { AuthLoginEnum } from '@pages/website/state/auth.enums';

export const authLogin = createAction(
    AuthLoginEnum.LOGIN,
    props<LoginProps>()
);

export const authLoginSuccess = createAction(
    AuthLoginEnum.LOGIN_SUCCESS,
    props<SignInResponse>()
);

export const authLoginError = createAction(
    AuthLoginEnum.LOGIN_ERROR,
    props<{ error: HttpErrorResponse }>()
);
