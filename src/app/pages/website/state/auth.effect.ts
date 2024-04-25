import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

// effects
import { Actions, createEffect, ofType } from '@ngrx/effects';

//rxjs
import { catchError, map, of, switchMap, tap } from 'rxjs';

// actions
import * as AuthActions from '@pages/website/state/actions/login/auth.actions';

// services
import { WebsiteActionsService } from '@pages/website/services/website-actions.service';
import { AuthService } from '@pages/website/services/auth/auth.service';

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
            ofType(AuthActions.authLogin),
            switchMap((action) =>
                this.authService.authLogin(action).pipe(
                    map((user) => AuthActions.authLoginSuccess(user)),
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
                    catchError((error) => of(AuthActions.authLoginError(error)))
                )
            )
        )
    );
}
