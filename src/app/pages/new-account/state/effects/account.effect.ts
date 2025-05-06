import { Injectable } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { catchError, map, mergeMap, of } from 'rxjs';

// Services
import { AccountService } from '@pages/new-account/services/account.service';

// Actions
import * as AccountActions from '@pages/new-account/state/actions/account.action';

@Injectable()
export class AccountEffect {
    constructor(
        private actions$: Actions,
        private accountService: AccountService
    ) {}

    loadAccounts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.loadAccounts),
            mergeMap(() =>
                this.accountService.getAccountList().pipe(
                    map((data) => AccountActions.loadAccountsSuccess({ data })),
                    catchError((error) =>
                        of(AccountActions.loadAccountsFailure({ error }))
                    )
                )
            )
        )
    );
}
