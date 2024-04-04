import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';
import { UserService } from '../services/user.service';

// store
import { UserState, UserStore } from '../state/user.store';

@Injectable({
    providedIn: 'root',
})
export class UserResolver implements Resolve<UserState> {
    constructor(
        private userService: UserService,
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
