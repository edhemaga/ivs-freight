import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { PmService } from '@pages/pm-truck-trailer/services/pm.service';

// Store
import {
    PmTrailerState,
    PmTrailerStore,
} from '@pages/pm-truck-trailer/state/pm-trailer-state/pm-trailer.store';

@Injectable({
    providedIn: 'root',
})
export class PmTrailerResolver implements Resolve<PmTrailerState> {
    constructor(
        // Store
        private pmTrailerStore: PmTrailerStore,

        // Services
        private pmService: PmService,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.pmService.getPMTrailerUnitList(undefined, undefined, 1),
            this.tableService.getTableConfig(14),
        ]).pipe(
            tap(([pmTrailerPagination, tableConfig]) => {
                localStorage.setItem(
                    'pmTrailerTableCount',
                    JSON.stringify({
                        pmTrailer: pmTrailerPagination.pmTrailerCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.pmTrailerStore.set(pmTrailerPagination.pagination.data);
            })
        );
    }
}
