import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';
// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { LoadService } from '@shared/services/load.service';

// store
import {
    LoadActiveState,
    LoadActiveStore,
} from '@pages/load/state/load-active-state/load-active.store';

@Injectable({
    providedIn: 'root',
})
export class LoadActiveResolver implements Resolve<LoadActiveState> {
    constructor(
        private loadService: LoadService,
        private loadActiveStore: LoadActiveStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.loadService.getLoadList(
                null,
                2,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                1,
                25,
                null,
                null,
                null,
                null,
                null
            ),
            this.tableService.getTableConfig(3),
        ]).pipe(
            tap(([loadPagination, tableConfig]) => {
                console.log('loadPagination', loadPagination);
                localStorage.setItem(
                    'loadTableCount',
                    JSON.stringify({
                        pendingCount: loadPagination.pendingCount,
                        activeCount: loadPagination.activeCount,
                        closedCount: loadPagination.closedCount,
                        templateCount: loadPagination.templateCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.loadActiveStore.set(loadPagination.pagination.data);
            })
        );
    }
}
