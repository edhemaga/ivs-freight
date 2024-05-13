import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { AccountService } from '@pages/account/services/account.service';

// store
import { AccountState, AccountStore } from '@pages/account/state/account.store';

@Injectable({
    providedIn: 'root',
})
export class AccountResolver implements Resolve<AccountState> {
    constructor(
        private accountService: AccountService,
        private accountStore: AccountStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.accountService.getAccounts(null, 1, 25),
            this.tableService.getTableConfig(18),
            this.accountService.companyAccountLabelsColorList(),
            this.accountService.companyAccountModal(),
        ]).pipe(
            tap(([accountPagination, tableConfig, colorRes, accountLabels]) => {
                localStorage.setItem(
                    'accountTableCount',
                    JSON.stringify({
                        account: accountPagination.count,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

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
