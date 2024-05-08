import { createAction, props } from '@ngrx/store';
import { AuthRegisterEnum } from '../../enums/register.enums';
import { HttpErrorResponse } from '@angular/common/http';
import { SignUpCompanyCommand } from 'appcoretruckassist';

export const authRegister = createAction(
    AuthRegisterEnum.REGISTER,
    props<SignUpCompanyCommand>()
);

export const authRegisterSuccess = createAction(
    AuthRegisterEnum.REGISTER_SUCCESS,
    props<{success: boolean}>()
);

export const authRegisterError = createAction(
    AuthRegisterEnum.REGISTER_ERROR,
    props<{ error: HttpErrorResponse }>()
);
