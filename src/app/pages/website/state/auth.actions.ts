import { LoginProps } from './auth.model';

import { createAction, props } from '@ngrx/store';

export const login = createAction('[Login Page] Login', props<LoginProps>());