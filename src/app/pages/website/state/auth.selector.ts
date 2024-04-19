import { createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

const selectLogin = (state: AuthState) => state;

export const selectAuthLoginError = createSelector(
    selectLogin,
    (state) => state.error
);

export const selectLoggedUser = createSelector(
    selectLogin,
    (state) => state.user
);
