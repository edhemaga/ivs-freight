import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

// effects
import { Actions, createEffect, ofType } from '@ngrx/effects';

//rxjs
import { catchError, map, of, switchMap, tap } from 'rxjs';

// actions
import * as AuthLoginActions from '@pages/website/state/actions/login/login.actions';
import * as AuthRegisterAction from '@pages/website/state/actions/register/register.actions';

// services
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';
import { AuthService } from '@pages/website/services/auth/auth.service';
import { WebsiteStringEnum } from '../enums/website-string.enum';

@Injectable()
export class AuthEffect {
    constructor(
        // router
        private router: Router,
        // actions
        private actions$: Actions,

        // services
        private websiteActionsService: WebsiteActionsService,
        public authService: AuthService
    ) {}

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthLoginActions.authLogin),
            switchMap((action) =>
                this.authService.authLogin(action).pipe(
                    map((user) => AuthLoginActions.authLoginSuccess(user)),
                    tap((user) => {
                        if (user.companies.length > 1) {
                            localStorage.setItem('user', JSON.stringify(user));

                            this.router.navigate(['/website/select-company']);
                        } else {
                            localStorage.setItem('user', JSON.stringify(user));

                            if (!user.areSettingsUpdated) {
                                this.router.navigate(['/company/settings']);
                            } else {
                                this.router.navigate(['/dashboard']);
                            }
                        }
                        this.websiteActionsService.setOpenSidebarSubject(false);
                    }),
                    catchError((error) =>
                        of(AuthLoginActions.authLoginError(error))
                    )
                )
            )
        )
    );

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthRegisterAction.authRegister),
            switchMap((action) =>
                this.authService.authRegister(action).pipe(
                    map((user) =>
                        AuthRegisterAction.authRegisterSuccess({
                            success: true,
                        })
                    ),
                    tap(() => {
                        this.websiteActionsService.setSidebarContentType(
                            WebsiteStringEnum.START_TRIAL_CONFIRMATION
                        );

                        localStorage.setItem(
                            WebsiteStringEnum.CONFIRMATION_EMAIL,
                            action.email
                        );
                    }),
                    catchError((error) =>
                        of(AuthRegisterAction.authRegisterError(error))
                    )
                )
            )
        )
    );
}
