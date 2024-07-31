import { Injectable } from '@angular/core';


import { Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { LoadService } from '@shared/services/load.service';

// store
import {
    LoadClosedState,
    LoadClosedStore,
} from '@pages/load/state/load-closed-state/load-closed.store';

@Injectable({
    providedIn: 'root',
})
export class LoadClosedResolver  {
    constructor(
        private loadService: LoadService,
        private loadClosedStore: LoadClosedStore
    ) {}
    resolve(): Observable<any> {
        return this.loadService
            .getLoadList(
                null,
                3,
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
                    if (loadPagination) {
                        localStorage.setItem(
                            'loadTableCount',
                            JSON.stringify({
                                pendingCount: loadPagination.pendingCount,
                                activeCount: loadPagination.activeCount,
                                closedCount: loadPagination.pagination.count,
                                templateCount: loadPagination.templateCount,
                            })
                        );
                    }

                    this.loadClosedStore.set(loadPagination?.pagination?.data);
                })
            );
    }
}
