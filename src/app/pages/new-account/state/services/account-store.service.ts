import { Injectable } from '@angular/core';

// RxJS
import { Observable } from 'rxjs';

// NgRx
import { select, Store } from '@ngrx/store';

// Constants
import { AccountStoreConstants } from '@pages/new-account/utils/constants';

// Selectors
import * as AccountSelector from '@pages/new-account/state/selectors/account.selector';

// Interfaces
import { IMappedAccount } from '@pages/new-account/interfaces';
import { ITableColumn } from '@shared/components/new-table/interfaces';

@Injectable({
    providedIn: 'root',
})
export class AccountStoreService {
    constructor(private store: Store) {}

    public accountListSelector$: Observable<IMappedAccount[]> = this.store.pipe(
        select(AccountSelector.selectAccountData)
    );

    public tableColumnsSelector$: Observable<ITableColumn[]> = this.store.pipe(
        select(AccountSelector.tableColumnsSelector)
    );

    public loadAccounts(): void {
        this.store.dispatch({
            type: AccountStoreConstants.LOAD_ACCOUNTS,
        });
    }
}
