import { Injectable } from '@angular/core';


import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { UserService } from '@pages/user/services/user.service';

// store
import { UserActiveStore } from '@pages/user/state/user-active-state/user-active.store';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Injectable({
    providedIn: 'root',
})
export class UserResolver  {
    constructor(
        private userService: UserService,
        private userStore: UserActiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.userService.getUsers(1, 1, 25),
            this.tableService.getTableConfig(22),
        ]).pipe(
            tap(([userPagination, tableConfig]) => {
                localStorage.setItem(
                    TableStringEnum.USER_TABLE_COUNT,
                    JSON.stringify({
                        active: userPagination.activeCount,
                        inactive: userPagination.inactiveCount,
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
