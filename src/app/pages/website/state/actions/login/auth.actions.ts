import { HttpErrorResponse } from '@angular/common/http';
// store
import { createAction, props } from '@ngrx/store';

// models
import { SignInResponse } from 'appcoretruckassist';
import { LoginProps } from '@pages/website/state/auth.model';

// enums
import { AuthLoginEnums } from '@pages/website/state/auth.enums';

export const authLogin = createAction(
    AuthLoginEnums.LOGIN,
    props<LoginProps>()
);

export const authLoginSuccess = createAction(
    AuthLoginEnums.LOGIN_SUCCESS,
    props<SignInResponse>()
);

export const authLoginError = createAction(
    AuthLoginEnums.LOGIN_ERROR,
    props<{ error: HttpErrorResponse }>()
);
