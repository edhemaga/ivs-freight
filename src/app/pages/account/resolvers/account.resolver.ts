import { Injectable } from '@angular/core';

import { forkJoin, Observable, tap } from 'rxjs';

// services
import { AccountService } from '@pages/account/services/account.service';

// store
import { AccountStore } from '@pages/account/state/account.store';

@Injectable({
    providedIn: 'root',
})
export class AccountResolver {
    constructor(
        private accountService: AccountService,
        private accountStore: AccountStore
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.accountService.getAccounts(null, 1, 25),
            this.accountService.companyAccountLabelsColorList(),
            this.accountService.companyAccountModal(),
        ]).pipe(
            tap(([accountPagination, colorRes, accountLabels]) => {
                localStorage.setItem(
                    'accountTableCount',
                    JSON.stringify({
                        account: accountPagination.count,
                    })
                );

                const accountLabel = accountLabels.labels.map((item) => {
                    return { ...item, dropLabel: true };
                });

                const accountTableData = accountPagination.pagination.data;
                const modifiedAccountTableData = accountTableData.map((e) => {
                    e.colorRes = colorRes;
                    e.colorLabels = accountLabel;
                    return e;
                });

                this.accountStore.set(accountTableData);
            })
        );
    }
}
