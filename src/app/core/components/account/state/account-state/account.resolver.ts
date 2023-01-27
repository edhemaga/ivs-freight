import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { AccountTService } from '../account.service';
import { AccountState, AccountStore } from './account.store';

@Injectable({
    providedIn: 'root',
})
export class AccountResolver implements Resolve<AccountState> {
    constructor(
        private accountService: AccountTService,
        private accountStore: AccountStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.accountService.getAccounts(null, 1, 25),
            this.tableService.getTableConfig(18),
        ]).pipe(
            tap(([accountPagination, tableConfig]) => {
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

                this.accountStore.set(accountPagination.pagination.data);
            })
        );
    }
}
