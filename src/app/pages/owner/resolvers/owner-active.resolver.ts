import { Injectable } from '@angular/core';


import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { OwnerService } from '@pages/owner/services/owner.service';

// store
import {
    OwnerActiveState,
    OwnerActiveStore,
} from '@pages/owner/state/owner-active-state/owner-active.store';

@Injectable({
    providedIn: 'root',
})
export class OwnerActiveResolver  {
    constructor(
        private ownerService: OwnerService,
        private ownerStore: OwnerActiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.ownerService.getOwner(
                1,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                1,
                25
            ),
            this.tableService.getTableConfig(17),
        ]).pipe(
            tap(([ownerPagination, tableConfig]) => {
                localStorage.setItem(
                    'ownerTableCount',
                    JSON.stringify({
                        active: ownerPagination.activeCount,
                        inactive: ownerPagination.inactiveCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.ownerStore.set(ownerPagination.pagination.data);
            })
        );
    }
}
