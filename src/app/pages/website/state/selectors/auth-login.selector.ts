// store
import { createFeatureSelector, createSelector } from '@ngrx/store';

// models
import { AuthState } from '@pages/website/state/models/auth-state.model';
import { SignInResponse } from 'appcoretruckassist';

// enums
import { WebsiteStringEnum } from '@pages/website/enums/website-string.enum';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoginError = createSelector(
    selectAuthState,
    (state): { type: string; error: Record<string, boolean> } => {

        console.log("LOGIN ERRORS", state);
        if (!state.error) return null;
        const errorMessage = state.error.error;

        if (errorMessage === WebsiteStringEnum.THIS_USER_DOESENT_EXIST) {
            return {
                type: WebsiteStringEnum.EMAIL_ADDRESS,
                error: { userDoesntExist: true },
            };
        } else if (
            errorMessage === WebsiteStringEnum.WRONG_PASSWORD_TRY_AGAIN
        ) {
            return {
                type: WebsiteStringEnum.PASSWORD,
                error: { wrongPassword: true },
            };
        } else if (errorMessage === WebsiteStringEnum.EIN_ALREADY_EXIST)
            return {
                type: WebsiteStringEnum.EIN,
                error: { einAlreadyExist: true },
            };
        else if (errorMessage === WebsiteStringEnum.PHONE_ALREADY_EXIST)
            return {
                type: WebsiteStringEnum.PHONE,
                error: { phoneAlreadyExist: true },
            };
        else if (errorMessage === WebsiteStringEnum.EMAIL_ALREADY_EXIST)
            return {
                type: WebsiteStringEnum.EMAIL_ADDRESS,
                error: { emailAlreadyExist: true },
            };
    }
);

export const selectLoggedUser = createSelector(
    selectAuthState,
    (state): SignInResponse => state.user
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    (state): boolean => state.loading
);
