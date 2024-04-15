import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { WebsiteAuthService } from '../services/website-auth.service';
import { AccountService } from 'appcoretruckassist';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffect {
    constructor(
        private actions$: Actions,
        private accountService: AccountService
    ) {}

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.authLogin),
            switchMap((action) =>
                this.accountService.apiAccountLoginPost(action).pipe(
                    map((user) => AuthActions.authLoginSuccess(user)),
                    catchError((error) =>
                        of(AuthActions.authLoginError({ errorMsg: error }))
                    )
                )
            )
        )
    );
}
