import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { TrailerService } from '@shared/services/trailer.service';

// store
import {
    TrailerActiveState,
    TrailerActiveStore,
} from '@pages/trailer/state/trailer-active-state/trailer-active.store';

@Injectable({
    providedIn: 'root',
})
export class TrailerActiveResolver implements Resolve<TrailerActiveState> {
    constructor(
        private trailerService: TrailerService,
        private trailerStore: TrailerActiveStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([this.trailerService.getTrailers(1, null, 1, 25)]).pipe(
            tap(([trailerPagination, tableConfig]) => {
                localStorage.setItem(
                    'trailerTableCount',
                    JSON.stringify({
                        active: trailerPagination.activeCount,
                        inactive: trailerPagination.inactiveCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.trailerStore.set(trailerPagination.pagination.data);
            })
        );
    }
}
