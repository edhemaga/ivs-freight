import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { UserTService } from '../services/user.service';
import { UserState, UserStore } from '../state/user-state/user.store';

@Injectable({
    providedIn: 'root',
})
export class UserResolver implements Resolve<UserState> {
    constructor(
        private userService: UserTService,
        private userStore: UserStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.userService.getUsers(undefined, 1, 25),
            this.tableService.getTableConfig(22),
        ]).pipe(
            tap(([userPagination, tableConfig]) => {
                localStorage.setItem(
                    'userTableCount',
                    JSON.stringify({
                        users: userPagination.activeCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.userStore.set(userPagination.pagination.data);
            })
        );
    }
}
