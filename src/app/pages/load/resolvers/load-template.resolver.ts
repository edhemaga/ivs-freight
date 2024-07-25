import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { LoadService } from '@shared/services/load.service';

// store
import {
    LoadTemplateState,
    LoadTemplateStore,
} from '@pages/load/state/load-template-state/load-template.store';

@Injectable({
    providedIn: 'root',
})
export class LoadTemplateResolver implements Resolve<LoadTemplateState> {
    constructor(
        private loadService: LoadService,
        private loadTemplateStore: LoadTemplateStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return this.loadService
            .getLoadTemplateList(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            )
            .pipe(
                tap((loadPagination) => {
                    localStorage.setItem(
                        'loadTableCount',
                        JSON.stringify({
                            pendingCount: loadPagination.pendingCount,
                            activeCount: loadPagination.activeCount,
                            closedCount: loadPagination.closedCount,
                            templateCount: loadPagination.pagination.count,
                        })
                    );

                    this.loadTemplateStore.set(loadPagination.pagination.data);
                })
            );
    }
}
