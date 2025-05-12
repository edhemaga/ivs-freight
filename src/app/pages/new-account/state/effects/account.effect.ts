import { Injectable } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// RxJS
import { catchError, forkJoin, map, of, switchMap, withLatestFrom } from 'rxjs';

// Services
import { AccountService } from '@pages/new-account/services/account.service';

// Actions
import * as AccountActions from '@pages/new-account/state/actions/account.action';

// Selectors
import * as AccountSelector from '@pages/new-account/state/selectors/account.selector';

@Injectable()
export class AccountEffect {
    constructor(
        private actions$: Actions,
        private store: Store,

        private accountService: AccountService
    ) {}

    public loadAccounts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.loadAccounts),
            withLatestFrom(
                this.store.select(AccountSelector.filterSelector),
                this.store.select(AccountSelector.tableSettingsSelector)
            ),
            switchMap(([_, filters, tableSettings]) => {
                return forkJoin([
                    this.accountService.getAccountList(
                        1,
                        filters,
                        tableSettings
                    ),
                ]).pipe(
                    map(([data]) =>
                        AccountActions.loadAccountsSuccess({
                            data,
                        })
                    ),
                    catchError(() => of(AccountActions.loadAccountsFailure()))
                );
            })
        )
    );

    public getAccountsListOnPageChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.getAccountsOnPageChange),
            withLatestFrom(
                this.store.select(AccountSelector.pageSelector),
                this.store.select(AccountSelector.filterSelector),
                this.store.select(AccountSelector.tableSettingsSelector)
            ),
            switchMap(([_, page, filters, tableSettings]) => {
                console.log(this);
                return this.accountService
                    .getAccountList(page, filters, tableSettings)
                    .pipe(
                        map((data) =>
                            AccountActions.loadAccountsOnPageChangeSuccess({
                                payload: data,
                            })
                        ),
                        catchError(() =>
                            of(AccountActions.loadAccountsFailure())
                        )
                    );
            })
        )
    );
}
