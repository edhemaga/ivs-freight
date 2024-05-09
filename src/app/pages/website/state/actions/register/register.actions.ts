import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

// enums
import { AuthRegisterEnum } from '@pages/website/state/enums/register.enum';

// models
import { SignUpCompanyCommand } from 'appcoretruckassist';

export const authRegister = createAction(
    AuthRegisterEnum.REGISTER,
    props<SignUpCompanyCommand>()
);

export const authRegisterSuccess = createAction(
    AuthRegisterEnum.REGISTER_SUCCESS,
    props<{ success: boolean }>()
);

export const authRegisterError = createAction(
    AuthRegisterEnum.REGISTER_ERROR,
    props<{ error: HttpErrorResponse }>()
);
