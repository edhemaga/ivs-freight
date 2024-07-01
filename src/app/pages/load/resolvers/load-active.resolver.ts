import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, tap } from 'rxjs';
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
        return this.loadService
            .getLoadList(
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
            )
            .pipe(
                tap((loadPagination) => {
                    localStorage.setItem(
                        'loadTableCount',
                        JSON.stringify({
                            pendingCount: loadPagination.pendingCount,
                            activeCount: loadPagination.activeCount,
                            closedCount: loadPagination.closedCount,
                            templateCount: loadPagination.templateCount,
                        })
                    );

                    this.loadActiveStore.set(loadPagination.pagination.data);
                })
            );
    }
}
